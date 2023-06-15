import "./type-extensions";
import { Locklift, LockliftConfig } from "locklift";
import { addPlugin } from "locklift/plugins";
import { PLUGIN_NAME } from "./type-extensions";
import { PrivateDeployer } from "./deployer";

export * from "./type-extensions";

type LockliftConfigOptions = Locklift<any> extends Locklift<infer F> ? F : never;

// add plugin flow
addPlugin({
  // plugin name
  pluginName: PLUGIN_NAME,
  //Initializer function that will be called by locklift
  initializer: async ({
    locklift,
    config,
    network,
  }: {
    locklift: Locklift<any>;
    config: LockliftConfig<LockliftConfigOptions>;
    network?: string;
  }) => {
    // @ts-ignore
    return new PrivateDeployer(locklift, config.privateRPC);
  },
});
