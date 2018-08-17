interface EnvConfig {
  root: string;
  name: string;
  port: number;
  env: string;
  debug: boolean;
  db: string;
  test: boolean;
  oAuthSecret: string;
  newJobTopicARN: string;
}

export {
  EnvConfig
};