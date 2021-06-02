import { Controller } from 'egg';
import * as md5 from 'crypto-js/md5';
import * as fleekStorage from '@fleekhq/fleek-storage-js';

export default class IpfsController extends Controller {
  public async upload() {
    const { ctx } = this;
    const { title, content } = ctx.request.body;
    try {
      const uploadedFile = await fleekStorage.upload({
        apiKey: this.app.config.ipfsConfig.apiKey,
        apiSecret: this.app.config.ipfsConfig.apiSecret,
        key: `matatakiMD/${md5(`${title}-${Date.now()}`).toString()}`,
        data: content,
      });
      console.log('uploadedFile', uploadedFile);
      ctx.body = {
        code: 0,
        data: uploadedFile,
      };
    } catch (error) {
      ctx.body = {
        code: -1,
        message: 'ipfs upload fail',
      };
    }
  }
}
