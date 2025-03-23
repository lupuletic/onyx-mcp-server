// Global Jest types
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: {
  <T>(actual: T): jest.Matchers<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any(constructor: any): any;
};
declare const beforeEach: (fn: () => void) => void;
declare const afterEach: (fn: () => void) => void;
declare const beforeAll: (fn: () => void) => void;
declare const afterAll: (fn: () => void) => void;
declare const jest: {
  fn: <T = unknown>() => jest.Mock<T>;
  mock: (moduleName: string) => void;
  spyOn: <T extends object, M extends keyof T>(object: T, method: M) => jest.SpyInstance;
  setTimeout: (timeout: number) => void;
  resetModules: () => void;
};

// Third-party module declarations
declare module 'nock' {
  function cleanAll(): void;
  function disableNetConnect(): void;
  function enableNetConnect(matcher?: string | RegExp): void;
  
  interface Scope {
    get(path: string): Interceptor;
    post(path: string, body?: Record<string, unknown>): Interceptor;
    put(path: string, body?: Record<string, unknown>): Interceptor;
    delete(path: string): Interceptor;
    patch(path: string, body?: Record<string, unknown>): Interceptor;
    query(params: Record<string, string | number | boolean>): Scope;
    reply(statusCode: number, body?: string | Record<string, unknown>, headers?: Record<string, string>): Scope;
    replyWithError(error: Error | string): Scope;
    persist(): Scope;
  }
  
  interface Interceptor {
    query(params: Record<string, string | number | boolean>): Interceptor;
    reply(statusCode: number, body?: string | Record<string, unknown>, headers?: Record<string, string>): Scope;
    replyWithError(error: Error | string): Scope;
  }
  
  function nock(basePath: string): Scope;
  
  namespace nock {
    export { cleanAll, disableNetConnect, enableNetConnect };
  }
  
  export = nock;
}