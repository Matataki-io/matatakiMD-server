import 'egg';

declare module 'egg' {
  interface Application {
    mysql: any,
}
}
declare module '@octokit/auth-oauth-user'