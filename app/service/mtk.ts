import { Service } from 'egg';

/**
 * MTK Service
 */
export default class MTK extends Service {
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
      if (result.status === 200 && result.data.code === 0) {
        return result.data.data;
      }
      return false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
