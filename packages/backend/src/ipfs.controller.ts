import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly appService: AppService) {}

  @Get(':cid')
  async getCid(@Param() params: any) {
    const helia = await this.appService.getHelia();
    const cid = params.cid;
    const value = await helia.blockstore.get(cid);
    return String(value);
  }
}
