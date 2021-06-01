import { Controller } from 'egg';
import * as moment from 'moment';
import * as md5 from 'crypto-js/md5';
import * as fs from 'mz/fs';

export default class OssController extends Controller {
  public async upload() {
    const ctx = this.ctx;
    const file = ctx.request.files[0];

    this.logger.info('upload files %s', file);
    // oss path
    const time = moment().format('YYYY/MM/DD/');
    const filepathMd5 = md5(file.filepath).toString();
    const filetype = file.filename.split('.');
    const name = `${this.config.ossName}/${time}${filepathMd5}.${filetype[filetype.length - 1]}`;

    let result;
    try {
      result = await ctx.oss.put(name, file.filepath);
    } catch (e) {
      this.logger.error('upload image error %i', e.toString());
    } finally {
      await fs.unlink(file.filepath);
    }

    if (result) {
      this.logger.info('get oss object: %j', result);
      // ctx.unsafeRedirect(result.url);
      ctx.body = {
        code: 0,
        data: `/${result.name}`,
        message: 'success',
      };
    } else {
      ctx.body = {
        code: -1,
        message: 'please select a file to upload！',
      };
    }
  }
}
