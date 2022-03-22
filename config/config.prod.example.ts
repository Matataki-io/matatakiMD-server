import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // Secret
  config.secret = '';
  // Jwt Token Secret
  config.jwtTokenSecret = '';

  config.redis = {
    client: {
      port: 6379,
      host: '',
      password: '',
      db: 0,
    },
  };

  config.mysql = {
    clients: {
      matataki: {
        host: '',
        port: '3306',
        user: '',
        password: '',
        database: '',
        ssl: {},
        multipleStatements: true,
        charset: 'utf8mb4',
      },
    },
    default: {
      multipleStatements: true,
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // mulitpart
  config.multipart = {
    mode: 'file',
    tmpdir: './uploads',
  };

  // OSS Config
  config.oss = {
    client: {
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      endpoint: '',
      timeout: '60s',
    },
  };

  // OSS Name Prefix
  config.ossName = 'editor';

  // Matataki Api Url
  config.mtkApi = '';

  // Fleek Config
  config.ipfsConfig = {
    apiKey: '',
    apiSecret: '',
  };

  return config;
};
