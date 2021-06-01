export default () => {
  return async function setHeader(ctx, next) {
    console.log('ctx', ctx);
    ctx.set('Access-Control-Allow-Credentials', 'true');
    await next();
  };
};

