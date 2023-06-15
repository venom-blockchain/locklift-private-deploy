<p align="center">
  <a href="https://github.com/venom-blockchain/developer-program">
    <img src="https://raw.githubusercontent.com/venom-blockchain/developer-program/main/vf-dev-program.png" alt="Logo" width="366.8" height="146.4">
  </a>
</p>

# Deploy contract with private endpoint

[Locklift](https://github.com/broxus/locklift) plugin that enables you to deploy smart contracts using a private RPC endpoint.

## Installation

- Install the plugin.

```bash
npm i --save-dev locklift-private-deploy
```

- Initialize the plugin via the `locklift.config.ts` file.

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
  privateRPC: "http://private-rpc.com/rpc",
  // ...
}
```

## How to use

You can use this plugin as simple as `locklift.factory.deployContract()`. For example:

```ts
const { contract: sample } = await locklift.privateRPC.deployContract({
    contract: "Sample",
    publicKey: signer.publicKey,
    initParams: { _nonce: 0 },
    constructorParams: { _state: 0 },
    value: locklift.utils.toNano(3),
  });
```
