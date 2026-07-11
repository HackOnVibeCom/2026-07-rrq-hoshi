declare module "midtrans-client" {
  export class Snap {
    constructor(opts: { isProduction: boolean; serverKey: string; clientKey?: string });
    createTransaction(input: unknown): Promise<{ token: string; redirect_url: string }>;
  }
}