<p align="center">
  <a href="https://github.com/venom-blockchain/developer-program">
    <img src="https://raw.githubusercontent.com/venom-blockchain/developer-program/main/vf-dev-program.png" alt="Logo" width="366.8" height="146.4">
  </a>
</p>

# Locklift private deploy plugin example

In this example, we will deploy a sample contract using private RPC

First, we need to install all required dependencies.

```bash
npm i
```

The next step is to initialize the plugin via `locklift.config.ts` file: 
```ts
// locklift.config.ts
// ...
import { PrivateDeployerExtension, LockliftConfigExtension } from "locklift-private-deploy";
import "locklift-private-deploy";

declare module "locklift" {
  export interface Locklift<FactorySource> extends PrivateDeployerExtension<FactorySource> {}
  export interface LockliftConfig extends LockliftConfigExtension {}
}

// ...

const config: LockliftConfig = {
  pivateRPC: "http://private-rpc.com/rpc", // insert you url here
  // ...
}
```

So we are ready to deploy our contract:
```bash
npx locklift run --network test --script scripts/00-deploy.ts
```
