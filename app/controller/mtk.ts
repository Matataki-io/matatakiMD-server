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

    const { title, content, shortContent, platform, author, hCaptchaData, cover } = ctx.request.body;

    if (!title || !content || !shortContent || !platform || !author) {
      ctx.body = {
        code: -1,
        message: 'no title、content、shortContent、platform、author',
      };
      return;
    }

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
          author, cover, fissionFactor: 2000,
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

  public async postEdit() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { signId, title, content, shortContent, platform, author, hCaptchaData, cover } = ctx.request.body;

    if (!signId || !title || !content || !shortContent || !platform || !author) {
      ctx.body = {
        code: -1,
        message: 'no signId、title、content、shortContent、platform、author',
      };
      return;
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/post/edit`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        data: {
          signId,
          author, cover, fissionFactor: 2000,
          data: { title, author, content },
          platform, title, is_original: 0, tags: [],
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

  public async draftSave() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { title, content, shortContent } = ctx.request.body;

    if (!title && !content && !shortContent) {
      ctx.body = {
        code: -1,
        message: 'title、content、shortContent 不能為空',
      };
      return;
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/draft/save`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        data: {
          title, content, fissionFactor: 2000,
          cover: '', is_original: 0, tags: [],
          assosiate_with: null, commentPayPoint: 0, short_content: shortContent,
          cc_license: '', ipfs_hide: true, requireToken: [],
          requireBuy: [], editRequireToken: [],
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

  public async preview() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { id } = this.ctx.request.body;
    if (!id) {
      ctx.body = {
        code: -1,
        message: 'ID 不能為空',
      };
      return;
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/preview`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        data: {
          id,
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

  public async uploadImage() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const files = ctx.request.files;
    this.logger.info('files', files);

    if (!files.length) {
      ctx.body = {
        code: -1,
        message: 'no files',
      };
      return;
    }

    try {
      const result = await ctx.curl(`${this.config.mtkApi}/post/uploadImage`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        files: files[0].filepath, // TODO:  暂时支持一张图片
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

  public async postsTimeRanking() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { author, page = 1, pagesize = 20 } = this.ctx.request.query;

    if (!author) {
      ctx.body = {
        code: -1,
        message: 'no author',
      };
      return;
    }


    try {
      const result = await ctx.curl(`${this.config.mtkApi}/posts/timeRanking`, {
        dataType: 'json',
        method: 'GET',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        data: {
          author,
          page,
          pagesize,
          extra: 'showAll=0',
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

  public async postIpfs() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { hash } = this.ctx.params;

    if (!hash) {
      ctx.body = {
        code: -1,
        message: 'no hash',
      };
      return;
    }


    try {
      const result = await ctx.curl(`${this.config.mtkApi}/post/ipfs/${hash}`, {
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
}
