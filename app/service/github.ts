import { Service } from 'egg';
import { Octokit } from '@octokit/rest';
import { isEmpty } from 'lodash';

interface octokitState {
  status: number
  data: any
}
interface pushProps {
  contents: string
  owner: string
  repo: string
  path: string
  branch: string
  commit: string
}

interface pullProps {
  owner: string
  repo: string
  path: string
  branch: string
}

interface usersReposProps {
  username: string
}
interface reposBranchesProps {
  owner: string
  repo: string
}

/**
 * GithubService
 */
export default class GithubService extends Service {

  private async getAccountGithubToken() {
    const { service } = this;

    const user = await service.mtk.userProfile();
    console.log('user', user);

    try {
      if (!user) {
        throw new Error('not user');
      }

      const mysqlMatataki = this.app.mysql.get('matataki');
      const sql = `SELECT * from github WHERE uid = ${user.id} LIMIT 0, 1;`;
      const resultsMatatakiUserGithub = await mysqlMatataki.query(sql);

      console.log('resultsMatatakiUserGithub', resultsMatatakiUserGithub);

      return !isEmpty(resultsMatatakiUserGithub[0]) ? resultsMatatakiUserGithub[0].access_token : false;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public async users(): Promise<object> {

    const token = await this.getAccountGithubToken();

    if (!token) {
      return {
        code: -1,
        message: 'no token',
      };
    }

    const octokit = new Octokit({
      auth: token,
    });
    const { status, data } = await octokit.rest.users.getAuthenticated();
    this.logger.info('status', status);
    this.logger.info('data', data);
    if (status === 200) {
      return {
        code: 0,
        data,
      };
    }
    return {
      code: -1,
      message: 'error',
    };
  }
  public async push({ contents, owner, repo, path, branch, commit }: pushProps): Promise<object> {
    const token = await this.getAccountGithubToken();

    if (!token) {
      return {
        code: -1,
        message: 'no token',
      };
    }

    this.logger.info('push', contents, owner, repo, path, branch, commit);
    // branch default
    const octokit = new Octokit({
      auth: token,
    });

    try {
      const { status: resultContentStatus, data: resultContent }: octokitState = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (resultContentStatus === 200) {
        //
      } else {
        return {
          code: 0,
          message: 'error',
        };
      }

      this.logger.info('resultContent', resultContent);

      const contentsBase64 = new Buffer(contents).toString('base64');
      this.logger.info('contentsBase64', contentsBase64);
      const res = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: commit || `Update ${Date.now()}`,
        content: contentsBase64,
        sha: resultContent.sha,
      });
      this.logger.info('push res', res);
      return {
        code: 0,
        message: 'success',
      };
    } catch (e) {
      this.logger.info('e', e);
      return {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async pull({ owner, repo, path, branch }: pullProps): Promise<object> {
    const token = await this.getAccountGithubToken();

    if (!token) {
      return {
        code: -1,
        message: 'no token',
      };
    }

    this.logger.info('pull', owner, repo, path, branch);

    const octokit = new Octokit({
      auth: token,
    });

    const { status: resultContentStatus, data: resultContent }: octokitState = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (resultContentStatus === 200) {
      const content: string = new Buffer(resultContent.content, 'base64').toString();
      this.logger.info('content', content);
      return {
        code: 0,
        message: 'success',
        data: {
          content,
        },
      };
    }
    return {
      code: 0,
      message: 'error',
    };
  }

  public async usersRepos({ username }: usersReposProps): Promise<object> {
    const token = await this.getAccountGithubToken();

    if (!token) {
      return {
        code: -1,
        message: 'no token',
      };
    }

    const octokit = new Octokit({
      auth: token,
    });

    let user = {
      public_repos: 0,
    };
    try {
      const { status: statusUser, data: dataUser }: octokitState = await octokit.rest.users.getAuthenticated();
      if (statusUser === 200) {
        user = dataUser;
      }
    } catch (e) {
      this.logger.error(e);
    }

    const count = (user as any).public_repos;
    const per_page = 100; // default 30 max 100
    const len = Math.floor(count / per_page) + 1;
    const list: any[] = [];

    try {
      for (let i = 1; i <= len; i++) {
        const { status, data }: octokitState = await octokit.repos.listForUser({
          username,
          type: 'owner',
          sort: 'updated',
          page: i,
          per_page,
        });

        this.logger.info('data', data);

        if (status === 200) {
        // console.log('data', data)
          const _list = data.map((i: any) => ({
            name: i.name,
            full_name: i.full_name,
            private: i.private,
            owner: {
              login: i.owner.login,
            },
          }));

          list.push(...(_list as any));
        } else {
          this.logger.error('fail', status);
        }
      }

      return {
        code: 0,
        data: list,
      };
    } catch (e) {
      return {
        code: -1,
        message: e.toString(),
      };
    }
  }
  public async reposBranches({ owner, repo }: reposBranchesProps): Promise<object> {
    const token = await this.getAccountGithubToken();

    if (!token) {
      return {
        code: -1,
        message: 'no token',
      };
    }

    const octokit = new Octokit({
      auth: token,
    });

    const { status, data }: octokitState = await octokit.repos.listBranches({
      owner,
      repo,
    });

    this.logger.info('data', data);

    if (status === 200) {
      return {
        code: 0,
        data,
      };
    }
    return {
      code: -1,
      messag: 'error',
    };
  }

  public async reposContentsList({ owner, repo }): Promise<object> {
    const token = await this.getAccountGithubToken();

    if (!token) {
      return {
        code: -1,
        message: 'no token',
      };
    }

    const octokit = new Octokit({
      auth: token,
    });

    const { status, data }: octokitState = await octokit.repos.getContent({
      owner,
      repo,
      path: '',
    });

    this.logger.info('data', data);

    if (status === 200) {
      const listFilter = data.filter((i: any) => {
        return i.type === 'file' && (i.name).includes('.md');
      });
      const list = listFilter.map((i: any) => ({
        name: i.name,
        path: i.path,
        sha: i.sha,
        url: i.url,
        html_url: i.html_url,
        type: i.type,
      }));

      return {
        code: 0,
        data: list,
      };
    }
    return {
      code: 0,
      message: 'error',
    };

  }
}
