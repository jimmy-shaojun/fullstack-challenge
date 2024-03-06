import { Test, TestingModule } from '@nestjs/testing';
import { IpfsController } from './ipfs.controller';

describe('IpfsController', () => {
  let ipfsController: IpfsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IpfsController],
    }).compile();

    ipfsController = app.get<IpfsController>(IpfsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ipfsController).toBeDefined();
    });
  });
});
