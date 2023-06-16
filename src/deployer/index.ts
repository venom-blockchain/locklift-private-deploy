import { Address, Contract } from "everscale-inpage-provider";
import { Locklift } from "locklift";
import { DeployContractParams, FactoryType } from "locklift/internal/factory";
import { DeployTransaction } from "locklift/types";

import axios from "axios";

import { Signer } from "locklift";
import { DeployParams } from "locklift/internal/factory";
import { ConstructorParams, TransactionWithOutput } from "locklift/types";
import { ClockWithOffset, SignedMessage, TokensObject, createExternalMessage, repackAddress } from "nekoton-wasm";

export class PrivateDeployer<T extends FactoryType> {
  private readonly locklift: Locklift<T>;
  private readonly privateRPC: string;

  constructor(locklift: Locklift<T>, privateRPC: string) {
    this.locklift = locklift;
    this.privateRPC = privateRPC;
  }

  public deployContract = async <ContractName extends keyof T>(
    args: DeployContractParams<T, ContractName>,
  ): Promise<{ contract: Contract<T[ContractName]> } & DeployTransaction> => {
    const { tvc, abi } = this.locklift.factory.getContractArtifacts(args.contract);
    return this._deployContract(
      abi,
      {
        tvc: args.tvc || tvc,
        workchain: args.workchain,
        publicKey: args.publicKey,
        initParams: args.initParams,
      } as DeployParams<T[ContractName]>,
      args.constructorParams,
      args.value,
    );
  };
  private _deployContract = async <Abi>(
    abi: Abi,
    deployParams: DeployParams<Abi>,
    constructorParams: ConstructorParams<Abi>,
    value: string,
  ): Promise<{ contract: Contract<Abi>; tx: TransactionWithOutput }> => {
    const expectedAddress = await this.locklift.provider.getExpectedAddress(abi, deployParams);

    await this.locklift.utils.errorExtractor(this.locklift.giver.sendTo(expectedAddress, value));
    const stateInit = await this.locklift.provider.getStateInit(abi, deployParams);
    const signer = (await this.locklift.keystore.getSigner("0"))!;
    // @ts-ignore
    const signatureId = locklift.context.network.config.connection.id;

    const signedMessage = await this.prepareSignedMessage(
      expectedAddress,
      signer,
      JSON.stringify(abi),
      stateInit.stateInit,
      JSON.parse(JSON.stringify(constructorParams)),
      signatureId,
    );

    const subscription = new this.locklift.provider.Subscriber();
    const txProm = subscription.transactions(expectedAddress).first();

    try {
      await this.sendMessage(this.privateRPC, signedMessage.boc);
    } catch (err) {
      throw new Error(`sendMessage to rpc endpoint: ${err}`);
    }

    const transactions = (await txProm).transactions;
    await subscription.unsubscribe();

    const tx = { transaction: transactions[0] } as TransactionWithOutput;
    const contract = new this.locklift.provider.Contract(abi, expectedAddress);

    return { contract, tx };
  };

  private prepareSignedMessage = async (
    contract: Address,
    signer: Signer,
    abi: string,
    stateInit: string,
    constructorParams: TokensObject,
    signatureId = 1000,
    TIMEOUT = 60,
  ): Promise<SignedMessage> => {
    const clock = new ClockWithOffset();
    const repackedRecipient = repackAddress(contract.toString());
    const unsignedMessage = createExternalMessage(
      clock,
      repackedRecipient,
      abi,
      "constructor",
      stateInit,
      constructorParams,
      signer.publicKey,
      TIMEOUT,
    );
    const signature = await signer.sign(unsignedMessage.hash, signatureId);

    return unsignedMessage.sign(signature);
  };

  private sendMessage = async (url: string, msgBoc: string) => {
    return axios.post(url, {
      jsonrpc: "2.0",
      id: 1,
      method: "sendMessage",
      params: {
        message: msgBoc,
      },
    });
  };
}
