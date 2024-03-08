import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurationEventService } from './curation-event.service.js';
import { CurationEvent } from './entities/curation-event.entity.js';
import { CreateCurationEventInput } from './dto/create-curation-event.input.js';
import { SponsorStats } from './entities/sponsor-stats.entity.js';
import { BeneficiaryStats } from './entities/beneficiary-stats.entity.js';

@Resolver(() => CurationEvent)
export class CurationEventResolver {
  constructor(private readonly curationEventService: CurationEventService) {}

  @Mutation(() => CurationEvent)
  createCurationEvent(
    @Args('createCurationEventInput')
    createCurationEventInput: CreateCurationEventInput,
  ) {
    return this.curationEventService.create(createCurationEventInput);
  }

  @Query(() => [CurationEvent], { name: 'allCurationEvents' })
  findAll() {
    return this.curationEventService.findAll();
  }

  @Query(() => [CurationEvent], { name: 'findCurationEvents' })
  findWhere(
    @Args('sender', { type: () => String, description: 'from of the CurationEvent', nullable: true }) sender: string, 
    @Args('receiver', { type: () => String, description: 'to of the CurationEvent', nullable: true  }) receiver: string,
    @Args('from', { type: () => Date, description: 'CurationEvents should occur after `from` date, inclusive', nullable: true  }) from: Date, 
    @Args('to', { type: () => Date, description: 'CurationEvents should occur before `to` date, non-inclusive', nullable: true }) to: Date) {
    return this.curationEventService.find(sender, receiver, from, to);
  }

  @Query(() => CurationEvent, { name: 'curationEvent' })
  findOne(@Args('id', { type: () => BigInt }) id: bigint) {
    return this.curationEventService.findOne(id);
  }

  @Query(() => [SponsorStats], { name: 'sponsorStats' })
  sponsorStats(
    @Args('from', { type: () => Date, description: 'CurationEvents that are used to calculate stats should occur after `from` date, inclusive' }) from: Date, 
    @Args('to', { type: () => Date, description: 'CurationEvents that are used to calculate stats should occur before `to` date, non-inclusive' }) to: Date) {
    return this.curationEventService.sponsorStats(from, to);
  }

  @Query(() => [BeneficiaryStats], { name: 'beneficiaryStats' })
  beneficiaryStats(
    @Args('from', { type: () => Date, description: 'CurationEvents that are used to calculate stats should occur after `from` date, inclusive' }) from: Date, 
    @Args('to', { type: () => Date, description: 'CurationEvents that are used to calculate stats should occur before `to` date, non-inclusive' }) to: Date) {
    return this.curationEventService.beneficiaryStats(from, to);
  }
}
