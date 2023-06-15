import { PrivateDeployer } from "./deployer";
import { FactoryType } from "locklift/internal/factory";

export const PLUGIN_NAME = "privateRPC" as const;

export type PrivateDeployerExtension<T extends FactoryType> = {
  [key in typeof PLUGIN_NAME]: PrivateDeployer<T>;
};

export type LockliftConfigExtension = {
  privateRPC: string;
};
