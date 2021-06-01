import { Controller } from 'egg';

export default class GithubController extends Controller {
  public async users(): Promise<any> {
    const { ctx } = this;
    ctx.body = await ctx.service.github.users();
  }
  public async push(): Promise<any> {
    const { ctx } = this;
    const { contents, owner, repo, path, branch, commit } = ctx.request.body;
    ctx.body = await ctx.service.github.push({ contents, owner, repo, path, branch, commit });
  }
  public async pull(): Promise<any> {
    const { ctx } = this;
    const { owner, repo, path, branch } = ctx.request.query;
    ctx.body = await ctx.service.github.pull({ owner, repo, path, branch });
  }
  public async usersRepos(): Promise<any> {
    const { ctx } = this;
    const { username } = ctx.request.query;
    ctx.body = await ctx.service.github.usersRepos({ username });
  }
  public async reposBranches(): Promise<any> {
    const { ctx } = this;
    const { owner, repo } = ctx.request.query;
    ctx.body = await ctx.service.github.reposBranches({ owner, repo });
  }
  public async reposContentsList(): Promise<any> {
    const { ctx } = this;
    const { owner, repo } = ctx.request.query;
    ctx.body = await ctx.service.github.reposContentsList({ owner, repo });
  }
}
