import { Injectable } from '@nestjs/common';
import { CreateCurationEventInput } from './dto/create-curation-event.input';
import Web3, { EventLog } from 'web3';
import { ConfigService } from '@nestjs/config';
import contractAbi from '../web3/curation.abi';
import { LogsSubscription } from 'web3-eth-contract';
import { EthBlockService } from '../eth-block/eth-block.service';
import { Erc20TokenService } from '../erc20-token/erc20-token.service';
import { CurationEvent } from './entities/curation-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findAll() {
    return this.curationEventRepository.find();
  }

  async findOne(id: bigint) {
    return this.curationEventRepository.findOneBy({ id });
  }
}
