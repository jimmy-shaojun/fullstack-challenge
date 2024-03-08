import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':cid')
  async getCid(@Param() params: any) {
    return this.appService.stat(params.cid);
  }

  @Get('ls/:cid')
  async lsCid(@Param() params: any) {
    const subs = await this.appService.ls(params.cid);
    return subs.map((s) => ({
      cid: s.cid,
      type: s.type,
      path: s.path,
      size: Number(s.size),
      name: s.name,
      depth: s.depth,
    }));
  }

  @Get('cat/:cid/:file')
  async catFile(@Param() params: any, @Res() res: Response) {
    const cid = params.cid;
    const file = params.file;
    this.appService.streamFileInDir(cid, file, res);
  }

  @Get('cat/:cid')
  async catCid(@Param() params: any, @Res() res: Response) {
    const cid = params.cid;
    const subs = await this.appService.ls(cid);
    if (subs.length > 1) {
      for(const sub of subs) {
        if (sub.name === 'index.htm' || sub.name === 'index.html') {
          res.redirect(`/cat/${cid}/${sub.name}`);
          return;
        }
      }
    }
    this.appService.streamFile(cid, res);
  }
}
