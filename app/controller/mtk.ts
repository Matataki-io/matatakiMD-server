import { Controller } from 'egg';
export default class MTKController extends Controller {
  public async accountList() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      throw new Error('no token');
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/account/list`, {
        dataType: 'json',
        method: 'GET',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
      });

      ctx.body = result.data;
    } catch (error) {
      ctx.body = error;
    }
  }
  public async userProfile() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    try {

      if (!token) {
        throw new Error('no token');
      }

      const result = await ctx.curl(`${this.config.mtkApi}/user/stats`, {
        dataType: 'json',
        method: 'GET',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
      });

      ctx.body = result.data;
    } catch (error) {
      ctx.body = error;
    }
  }
  public async tokenTokenList() {
    const { ctx } = this;
    const token = ctx.header['access-token'];
    const { pagesize, order } = ctx.request.query;

    if (!token) {
      throw new Error('no token');
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/token/tokenlist?pagesize=${pagesize}&order=${order}`, {
        dataType: 'json',
        method: 'GET',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
      });

      ctx.body = result.data;
    } catch (error) {
      ctx.body = error;
    }
  }
  public async postPublish() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      throw new Error('no token');
    }

    const { title, content } = ctx.request.body;

    console.log('title', title);

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/post/publish`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        data: {
          author: 'author', cover: '', fissionFactor: 2000,
          data: { title, author: 'author', content },
          platform: 'email', signId: null, title, is_original: 0, tags: [],
          cc_license: null, commentPayPoint: 1, shortContent: content.slice(0, 300), requireToken: [],
          requireBuy: null, editRequireToken: [], editRequireBuy: null, ipfs_hide: true,
          assosiateWith: null, hCaptchaData: { expired: false, token: null, eKey: null, error: null },
          ipfs_or_github: 'ipfs',
        },
      });

      console.log('result', result);

      ctx.body = result.data;
    } catch (error) {
      this.logger.error('error', error);
      ctx.body = error;
    }
  }
}
