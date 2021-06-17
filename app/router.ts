import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  // Github API
  // Github user info
  router.get('/api/users', controller.github.users);
  // GitHub push
  router.put('/api/push', controller.github.push);
  // Github pull
  router.get('/api/pull', controller.github.pull);
  // Github users repos
  router.get('/api/users/repos', controller.github.usersRepos);
  // Github repos branches
  router.get('/api/repos/branches', controller.github.reposBranches);
  // Github repos contents list
  router.get('/api/repos/contents/list', controller.github.reposContentsList);

  // upload image
  router.post('/api/upload', controller.oss.upload);
  // upload ipfs
  router.post('/api/ipfs/upload', controller.ipfs.upload);

  // MTK API
  // MTK user info
  router.get('/api/user/stats', controller.mtk.userProfile);
  // MTK user account list
  router.get('/api/account/list', controller.mtk.accountList);
  // MTK 发布文章
  router.post('/api/post/publish', controller.mtk.postPublish);
  // MTK 验证码白名单
  router.get('/api/captcha/doINeedHCaptcha', controller.mtk.doINeedHCaptcha);
  // MTK 导入文章
  router.post('/api/posts/importer', controller.mtk.postsImport);
  // MTK 创建草稿
  router.post('/api/draft/save', controller.mtk.draftSave);
  // MTK 草稿预览
  router.post('/api/preview', controller.mtk.preview);
  // MTK 上传封面
  router.post('/api/post/uploadImage', controller.mtk.uploadImage);
  // MTK 文章接口
  router.get('/api/posts/timeRanking', controller.mtk.postsTimeRanking);
};
