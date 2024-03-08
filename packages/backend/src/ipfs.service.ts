import { Injectable, Res } from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';
import { verifiedFetch } from '@helia/verified-fetch'

@Injectable()
export class IpfsService {
  async catCid(cid: string, @Res() response) {
    const resp = await verifiedFetch(`ipfs://${cid}`);
    const blob = await resp.blob();
    const buffer = new Uint8Array(await blob.arrayBuffer())
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(response);
  }


}
