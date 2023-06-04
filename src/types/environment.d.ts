declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    ENV: 'test' | 'dev' | 'prod';
    MERCHANTID: string;
    VERSION: number;
    HASHKEY: string;
    HASHIV: string;
    HOST: string;
    NOTIFYURL: string;
    RETURNURL: string;
  }
}
