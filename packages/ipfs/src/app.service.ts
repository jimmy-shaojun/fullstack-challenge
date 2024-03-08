import { Injectable } from '@nestjs/common';
import type { HeliaLibp2p } from 'helia';
import { unixfs } from '@helia/unixfs';
import { UnixFSEntry } from 'ipfs-unixfs-exporter';
import { Readable } from 'stream';
import { Response } from 'express';

@Injectable()
export class AppService {
  private helia?: HeliaLibp2p;

  constructor() {
    this.getHelia();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getHelia(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const { createHelia } = await import('helia');
      this.helia = await createHelia();
    }
    return this.helia;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }

  async ls(cid: any) {
    const fs = unixfs(this.helia!);
    const fsEntries = await fs.ls(cid);
    const subs: UnixFSEntry[] = [];
    for await (const fsEntry of fsEntries) {
      subs.push(fsEntry);
    }
    return subs;
  }

  async stat(cid: any) {
    const fs = unixfs(this.helia!);
    const stats = await fs.stat(cid);
    return { cid: stats.cid, type: stats.type, mode: stats.mode };
  }

  async fileSize(cid: any) {
    const fs = unixfs(this.helia!);
    for await (const stat of fs.ls(cid)) {
      return Number(stat.size);
    }
    return 0;
  }

  async streamFile(cid: any, res: Response) {
    const children = await this.ls(cid);
    cid = children[0].cid;
    
    const fs = unixfs(this.helia!);
    const stream = new Readable();
    for await (const chunk of fs.cat(cid)) {
      stream.push(chunk);
    }
    stream.pipe(res);
    stream.push(null);
  }

  async streamFileInDir(cid: any, file: string, res: Response) {
    const children = await this.ls(cid);
    cid = children[0].cid;
    if (children.length > 1) {
      for (const child of children) {
        if (child.name === file) {
          cid = child.cid;
          break;
        }
      }
    }
    
    const fs = unixfs(this.helia!);
    const stream = new Readable();
    for await (const chunk of fs.cat(cid)) {
      stream.push(chunk);
    }
    stream.pipe(res);
    stream.push(null);
  }
}
