import { Controller } from 'egg';
export default class MTKController extends Controller {
  public async accountList() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
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
    } catch (e) {
      this.logger.error('e', e);

      ctx.body = {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async userProfile() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    try {
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
    } catch (e) {
      this.logger.error('e', e);
      ctx.body = {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async tokenTokenList() {
    const { ctx } = this;
    const token = ctx.header['access-token'];
    const { pagesize, order } = ctx.request.query;

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
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
    } catch (e) {
      this.logger.error('e', e);
      ctx.body = {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async postPublish() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { title, content, shortContent, platform, author, hCaptchaData } = ctx.request.body;

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
          author, cover: '', fissionFactor: 2000,
          data: { title, author, content },
          platform, signId: null, title, is_original: 0, tags: [],
          cc_license: null, commentPayPoint: 1, shortContent, requireToken: [],
          requireBuy: null, editRequireToken: [], editRequireBuy: null, ipfs_hide: true,
          assosiateWith: null, hCaptchaData, ipfs_or_github: 'ipfs',
        },
      });

      console.log('result', result);

      ctx.body = result.data;
    } catch (e) {
      this.logger.error('e', e);
      ctx.body = {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async doINeedHCaptcha() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/captcha/doINeedHCaptcha`, {
        dataType: 'json',
        method: 'GET',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
      });

      ctx.body = result.data;
    } catch (e) {
      this.logger.error('e', e);
      ctx.body = {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async postsImport() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { url } = this.ctx.request.body;
    console.log('url', url, !url);
    if (!url) {
      ctx.body = {
        code: -1,
        message: 'URL 不能為空',
      };
      return;
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/posts/importer`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        data: {
          url,
        },
      });

      ctx.body = result.data;
    } catch (e) {
      this.logger.error('e', e);
      ctx.body = {
        code: -1,
        message: e.toString(),
      };
    }
  }
}
