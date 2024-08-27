export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIGMA_CLIENT_ID: string;
      FIGMA_CLIENT_SECRET: string;
    }
  }
}
