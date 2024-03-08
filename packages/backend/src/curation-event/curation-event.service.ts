import { Injectable } from '@nestjs/common';
import { CreateCurationEventInput } from './dto/create-curation-event.input.js';
import Web3, { EventLog } from 'web3';
import { ConfigService } from '@nestjs/config';
import contractAbi from '../web3/curation.abi.js';
import { LogsSubscription } from 'web3-eth-contract';
import { EthBlockService } from '../eth-block/eth-block.service.js';
import { Erc20TokenService } from '../erc20-token/erc20-token.service.js';
import { CurationEvent } from './entities/curation-event.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Raw, Repository } from 'typeorm';
import { BeneficiaryStats } from './entities/beneficiary-stats.entity.js';
import { SponsorStats } from './entities/sponsor-stats.entity.js';
import { Erc20Token } from '../erc20-token/entities/erc20-token.entity.js';
import { formatErc20TokenAmount } from '../web3/utils.js';

@Injectable()
export class CurationEventService {
  private web3: Web3;
  private subscription: LogsSubscription;

  constructor(
    private configService: ConfigService,
    private erc20TokenService: Erc20TokenService,
    private ethBlockService: EthBlockService,
    @InjectRepository(CurationEvent)
    private curationEventRepository: Repository<CurationEvent>,
    web3: Web3,
  ) {
    const contractAddress = this.configService.get<string>(
      'CURATION_CONTRACT_ADDRESS',
    );
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const subscription = contract.events['Curation']();
    subscription.on('connected', (subscriptionId) => {
      console.log(`connected to subscription ${subscriptionId}`);
    });

    subscription.on('data', (event) => {
      console.log(`received event ${event}`);
      this.processEvent(event);
    });

    subscription.on('error', (error) => {
      console.error(`received error ${error}`);
    });
    this.subscription = subscription;
    contract
      .getPastEvents({
        fromBlock: 0,
        toBlock: 'latest',
      })
      .then(async (curations) => {
        for (const curation of curations) {
          if (typeof curation === 'string' || curation.event !== 'Curation')
            continue;

          console.log(curation.event, curation.returnValues);
          await this.processEvent(curation);
        }
      });
  }

  private async processEvent(curation: EventLog) {
    console.log(curation);
    const contractAddress = (curation.returnValues.token as string) || '0x0';

    return this.create({
      txnHash: curation.transactionHash,
      logIndex: BigInt(curation.logIndex),
      from: `${curation.returnValues.from}`,
      to: `${curation.returnValues.to}`,
      uri: `${curation.returnValues.uri}`,
      tokenContractAddress: contractAddress,
      amount: curation.returnValues.amount as bigint,
      blockNumber: BigInt(curation.blockNumber),
    });
  }

  async create(createCurationEventInput: CreateCurationEventInput) {
    console.log('will create', createCurationEventInput);
    const { tokenContractAddress: contractAddress, blockNumber } =
      createCurationEventInput;
    const token = await this.erc20TokenService.create({ contractAddress });
    const block = await this.ethBlockService.getBlock(BigInt(blockNumber));
    const timestamp = Number(block.timestamp) * 1000;

    const curationEvent = {
      ...createCurationEventInput,
      token,
      date: new Date(timestamp),
    } as unknown as CurationEvent;

    const existing = await this.curationEventRepository.findOneBy({
      txnHash: curationEvent.txnHash,
      logIndex: curationEvent.logIndex,
    });

    if (existing) {
      return existing;
    }

    return this.curationEventRepository.save(curationEvent);
  }

  private formatAmounts(curationEvents: CurationEvent[]) {
    return curationEvents.map((c) => {
      c.amountInDecimals = formatErc20TokenAmount(`${c.amount}`, c.token.decimals);
      c.formattedAmount = `${c.token.symbol} ${c.amountInDecimals}`;
      return c;
    })
  }

  async findAll() {
    return this.formatAmounts(await this.curationEventRepository.find());
  }

  async findOne(id: bigint) {
    const curationEvent = await this.curationEventRepository.findOneBy({ id });
    if (curationEvent) {
      return this.formatAmounts([curationEvent])[0];
    }
    return curationEvent;
  }

  async find(sender?: string, receiver?: string,from?: Date, to?: Date) {
    const findWhereOptions: FindOptionsWhere<CurationEvent> = {}
    if (sender) {
      findWhereOptions.from = sender;
    }
    if (receiver) {
      findWhereOptions.to = receiver;
    }
    if(from || to) {
      findWhereOptions.date = Raw( () => {
        const fromExpr = from?`date >= '${from.toISOString()}'`:undefined;
        const toExpr = to?`date <= '${to.toISOString()}'`:undefined;
        return [fromExpr, toExpr].filter(e => e !== undefined).join(' AND ')
      })
    }

    const findOrderOption: FindOptionsOrder<CurationEvent> = {
      date: "DESC"
    }

    return this.formatAmounts(await this.curationEventRepository.find({ 
      where: findWhereOptions,
      order: findOrderOption,
    }));
  }

  async findBySender(sender: string) {
    return this.formatAmounts(await this.curationEventRepository.findBy({ from: sender }));
  }

  async findByReceiver(receiver: string) {
    return this.formatAmounts(await this.curationEventRepository.findBy({ to: receiver }));
  }


  async beneficiaryStats(from: Date, to: Date): Promise<BeneficiaryStats[]> {
    const stats = await this.curationEventRepository.manager.query(`
    WITH stats AS 
    (SELECT "to" as "beneficiary", "tokenId", sum("amount") as total_amount
    FROM "curation_event" 
    WHERE date >=$1 AND date <= $2 
    GROUP BY "beneficiary", "tokenId")

    SELECT stats.*,
    "erc20_token"."name", "erc20_token"."symbol", "erc20_token"."decimals","erc20_token"."chainId", "erc20_token"."contractAddress","erc20_token"."totalSupply"
    FROM stats INNER JOIN "erc20_token" ON stats."tokenId" = "erc20_token"."id"
    ORDER BY total_amount DESC
    `, [from, to]);

    const beneficiaryStats: BeneficiaryStats[] = stats.map((row) => {
      const b = new BeneficiaryStats();
      b.token = new Erc20Token();
      b.beneficiary = row.beneficiary
      b.fromDate = from;
      b.toDate = to;
      b.amount = row.total_amount;
      b.token.id = row.tokenId;
      b.token.chainId = row.chainId;
      b.token.contractAddress = row.contractAddress;
      b.token.name = row.name;
      b.token.decimals = row.decimals;
      b.token.symbol = row.symbol;
      b.token.totalSupply = row.totalSupply;
      b.amountInDecimals = formatErc20TokenAmount(`${b.amount}`, b.token.decimals);
      b.formattedAmount = `${b.token.symbol} ${b.amountInDecimals}`;
      return b;
    });

    return beneficiaryStats;
  }

  async sponsorStats(from: Date, to: Date): Promise<SponsorStats[]> {
    const stats = await this.curationEventRepository.manager.query(`
    WITH stats AS 
    (SELECT "from" as "sponsor", "tokenId", sum("amount") as total_amount
    FROM "curation_event" 
    WHERE date >=$1 AND date <= $2 
    GROUP BY "sponsor", "tokenId")

    SELECT stats.*,
    "erc20_token"."name", "erc20_token"."symbol", "erc20_token"."decimals","erc20_token"."chainId", "erc20_token"."contractAddress","erc20_token"."totalSupply"
    FROM stats INNER JOIN "erc20_token" ON stats."tokenId" = "erc20_token"."id"
    ORDER BY total_amount DESC
    `, [from, to]);

    const sponsorStats: SponsorStats[] = stats.map((row) => {
      const b = new SponsorStats();
      b.token = new Erc20Token();
      b.sponsor = row.sponsor;
      b.fromDate = from;
      b.toDate = to;
      b.amount = row.total_amount;
      b.token.id = row.tokenId;
      b.token.chainId = row.chainId;
      b.token.contractAddress = row.contractAddress;
      b.token.name = row.name;
      b.token.decimals = row.decimals;
      b.token.symbol = row.symbol;
      b.token.totalSupply = row.totalSupply;
      b.amountInDecimals = formatErc20TokenAmount(`${b.amount}`, b.token.decimals);
      b.formattedAmount = `${b.token.symbol} ${b.amountInDecimals}`;
      return b;
    });

    return sponsorStats;
  }
}
