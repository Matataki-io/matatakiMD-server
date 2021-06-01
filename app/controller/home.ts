import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index(): Promise<any> {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
