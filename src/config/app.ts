interface IAppConfig {
  name: string;
  env: string;
  url: string;
}

export default {
  name: process.env.APP_NAME,
  env: process.env.NODE_ENV,
  url: process.env.APP_URL,
} as IAppConfig;
