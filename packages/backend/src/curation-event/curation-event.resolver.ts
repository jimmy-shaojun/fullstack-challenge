import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurationEventService } from './curation-event.service';
import { CurationEvent } from './entities/curation-event.entity';
import { CreateCurationEventInput } from './dto/create-curation-event.input';

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

  @Query(() => CurationEvent, { name: 'curationEvent' })
  findOne(@Args('id', { type: () => BigInt }) id: bigint) {
    return this.curationEventService.findOne(id);
  }
}
