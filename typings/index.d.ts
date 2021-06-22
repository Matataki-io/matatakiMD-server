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

export interface ResponseProps<T> {
  code: number
  message: string
  data: T
}

export interface ResponsePostInfoProps {
  p: {
    id: number
    title: string
    hash: string
    tags: {
      id: number
      name: string
    }[]
    assosiate_with: number
    cc_license: string
    tokens: {
      "id": number,
      "amount": number,
      "name": string,
      "symbol": string,
      "decimals": number,
      "logo": string
    }[]
    prices: {
      "token_id": number
      "platform": string
      "price": number
      "decimals": number
      "stock_quantity": number
      "symbol": string
      "logo": string|null
      "name": string|null
    }[]
    editTokens: {
      "id": number,
      "amount": number,
      "name": string,
      "symbol": string,
      "decimals": number,
      "logo": string
    }[]
    editPrices: {
      "token_id": number
      "platform": string
      "price": number
      "decimals": number
      "stock_quantity": number
      "symbol": string
      "logo": string|null
      "name": string|null
    }[]
    ipfs_hide: number
    is_original: number
  }
}