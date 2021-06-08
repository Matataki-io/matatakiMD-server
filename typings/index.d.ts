import 'egg';

declare module 'egg' {
  interface Application {
    mysql: any,
}
}
declare module '@octokit/auth-oauth-user'


export interface OctokitState {
  status: number
  data: any
}
export interface PushProps {
  contents: string
  owner: string
  repo: string
  path: string
  branch: string
  commit: string
}

export interface PullProps {
  owner: string
  repo: string
  path: string
  branch: string
}

export interface UsersReposProps {
  username: string
}
export interface ReposBranchesProps {
  owner: string
  repo: string
}

export interface ReposListProps {
  name: string
  full_name: string
  private: string
  owner: {
    login: string
  }
}

export interface ReposContentsListProps {
  name: string
  path: string
  sha: string
  url: string
  html_url: string
  type: string
}