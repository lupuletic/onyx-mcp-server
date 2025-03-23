// Global Jest types
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: any;
declare const beforeEach: (fn: () => void) => void;
declare const afterEach: (fn: () => void) => void;
declare const beforeAll: (fn: () => void) => void;
declare const afterAll: (fn: () => void) => void;
declare const jest: any;

// Third-party module declarations
declare module 'nock' {
  function cleanAll(): void;
  function disableNetConnect(): void;
  function enableNetConnect(matcher?: string | RegExp): void;
  
  interface Scope {
    get(path: string): Interceptor;
    post(path: string, body?: any): Interceptor;
    put(path: string, body?: any): Interceptor;
    delete(path: string): Interceptor;
    patch(path: string, body?: any): Interceptor;
    query(params: any): Scope;
    reply(statusCode: number, body?: any, headers?: any): Scope;
    replyWithError(error: any): Scope;
    persist(): Scope;
  }
  
  interface Interceptor {
    query(params: any): Interceptor;
    reply(statusCode: number, body?: any, headers?: any): Scope;
    replyWithError(error: any): Scope;
  }
  
  function nock(basePath: string): Scope;
  
  namespace nock {
    export { cleanAll, disableNetConnect, enableNetConnect };
  }
  
  export = nock;
}