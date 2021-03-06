import { Controller } from 'egg';
import { ResponseProps, ResponsePostInfoProps } from '../../typings/index.d';
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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/account/list`, {
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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/user/stats`, {
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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/token/tokenlist?pagesize=${pagesize}&order=${order}`, {
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
        message: 'no title???content???shortContent???platform???author',
      };
      return;
    }

    try {
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/post/publish`, {
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
          cc_license: null, commentPayPoint: 0, shortContent, requireToken: [],
          requireBuy: null, editRequireToken: [], editRequireBuy: null, ipfs_hide: true,
          assosiateWith: null, hCaptchaData,
          indie_post: false, indie_sync_tags: false,
        },
      });

      this.logger.info('result', result);

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
        message: 'no signId???title???content???shortContent???platform???author',
      };
      return;
    }

    try {
      // ?????? ???

      // ?????? ???
      // ??????Fan??? ???
      // cc ???
      // ???????????? ???
      // ???????????? ???
      // ???????????? ???
      // ???????????? ??? ????????????????????????
      // ???????????? hash ???
      // ???????????? ???
      // ????????? IPFS / Github ????????????????????? ?????? false

      const resultPost = await ctx.curl<ResponseProps<ResponsePostInfoProps>>(`${this.config.mtkApi}/pInfo/${signId}`, {
        dataType: 'json',
        method: 'GET',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
      });

      const { data: resultPostInfo } = resultPost;
      if (resultPostInfo.code !== 0) {
        throw new Error('????????????????????????');
      }
      const { data: resultPostInfoData } = resultPostInfo;

      this.logger.info('resultPostInfoData', resultPostInfoData);

      // ??????
      const tags = resultPostInfoData.p.tags.map(i => i.name) || [];
      // ?????? Fan ???
      const assosiateWith = resultPostInfoData.p.assosiate_with || null;
      // cc
      const cc_license = resultPostInfoData.p.cc_license || null;
      // ????????????
      const requireToken = resultPostInfoData.p.tokens.map(i => {
        return {
          tokenId: i.id,
          amount: i.amount,
        };
      }) || [];
      // ????????????
      const requireBuy = resultPostInfoData.p.prices.map(i => {
        return {
          tokenId: i.token_id,
          amount: i.price,
        };
      }) || [];
      // ????????????
      const editRequireToken = resultPostInfoData.p.editTokens.map(i => {
        return {
          tokenId: i.id,
          amount: i.amount,
        };
      }) || [];
      // ????????????
      const editRequireBuy = resultPostInfoData.p.editPrices.map(i => {
        return {
          tokenId: i.token_id,
          amount: i.price,
        };
      }) || [];
      // ???????????? hash
      const ipfs_hide = Boolean(resultPostInfoData.p.ipfs_hide);
      // ????????????
      const is_original = Number(resultPostInfoData.p.is_original);
      // ????????? IPFS / Github
      const indie_post = resultPostInfoData.p.hash.startsWith('Gh');

      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/post/edit`, {
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
          platform, title, is_original, tags,
          cc_license, commentPayPoint: 0, shortContent, requireToken,
          requireBuy, editRequireToken, editRequireBuy, ipfs_hide,
          assosiateWith, hCaptchaData,
          indie_post, indie_sync_tags: false, // ?????? false
        },
      });

      this.logger.info('result', result);

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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/captcha/doINeedHCaptcha`, {
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
    this.logger.info('url', url, !url);
    if (!url) {
      ctx.body = {
        code: -1,
        message: 'URL ????????????',
      };
      return;
    }

    try {
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/posts/importer`, {
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
        message: 'title???content???shortContent ????????????',
      };
      return;
    }

    try {
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/draft/save`, {
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
        message: 'ID ????????????',
      };
      return;
    }

    try {
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/preview`, {
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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/post/uploadImage`, {
        dataType: 'json',
        method: 'POST',
        contentType: 'json',
        headers: {
          'x-access-token': token,
        },
        timeout: 60 * 1000,
        files: files[0].filepath, // TODO:  ????????????????????????
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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/posts/timeRanking`, {
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
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/post/ipfs/${hash}`, {
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

  public async pInfo() {
    const { ctx } = this;
    const token = ctx.header['access-token'];

    if (!token) {
      ctx.body = {
        code: -1,
        message: 'no token',
      };
      return;
    }

    const { id } = this.ctx.params;

    if (!id) {
      ctx.body = {
        code: -1,
        message: 'no id',
      };
      return;
    }


    try {
      const result = await ctx.curl<ResponseProps<any>>(`${this.config.mtkApi}/pInfo/${id}`, {
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
