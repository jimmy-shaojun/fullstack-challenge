import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { IpfsService } from './ipfs.service.js';
import { Readable } from 'typeorm/platform/PlatformTools.js';
import { read } from 'fs';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  // @Get(':cid')
  // async getCid(@Param() params: any) {
  //   return this.ipfsService.stat(params.cid);
  // }

  // @Get('ls/:cid')
  // async lsCid(@Param() params: any) {
  //   const subs = await this.ipfsService.ls(params.cid);
  //   return subs.map((s) => ({
  //     cid: s.cid,
  //     type: s.type,
  //     path: s.path,
  //     size: Number(s.size),
  //     name: s.name,
  //     depth: s.depth,
  //   }));
  // }

  // @Get('cat/:cid')
  // async catCid(@Param() params: any, @Res() res: Response) {
  //   const cid = params.cid;
  //   this.ipfsService.streamFile(cid, res);
  // }

  @Get('view/:cid')
  async viewCid(@Param() params: any, @Res() response) {
    const cid = params.cid;
    await this.ipfsService.catCid(cid, response);
  }

  @Get('view/:cid/:path')
  async viewCid2(@Param() params: any, @Res() response) {
    const cid = params.cid;
    const path = params.path;
    await this.ipfsService.catCid(`${cid}/${path}`, response);
  }
}
