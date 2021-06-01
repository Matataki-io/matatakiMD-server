import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.get('/api/users', controller.github.users);
  router.put('/api/push', controller.github.push);
  router.get('/api/pull', controller.github.pull);
  router.get('/api/users/repos', controller.github.usersRepos);
  router.get('/api/repos/branches', controller.github.reposBranches);
  router.get('/api/repos/contents/list', controller.github.reposContentsList);

  router.post('/api/upload', controller.oss.upload);
  router.post('/api/ipfs/upload', controller.ipfs.upload);

  // MTK API
  router.get('/api/user/stats', controller.mtk.userProfile);
  router.get('/api/account/list', controller.mtk.accountList);
  router.post('/api/post/publish', controller.mtk.postPublish);
};
