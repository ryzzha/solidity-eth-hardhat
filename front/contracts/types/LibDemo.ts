/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface LibDemoInterface extends Interface {
  getFunction(
    nameOrSignature: "runnerArray" | "runnerString"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "runnerArray",
    values: [BigNumberish[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "runnerString",
    values: [string, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "runnerArray",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "runnerString",
    data: BytesLike
  ): Result;
}

export interface LibDemo extends BaseContract {
  connect(runner?: ContractRunner | null): LibDemo;
  waitForDeployment(): Promise<this>;

  interface: LibDemoInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  runnerArray: TypedContractMethod<
    [numbers: BigNumberish[], el: BigNumberish],
    [boolean],
    "view"
  >;

  runnerString: TypedContractMethod<
    [str1: string, str2: string],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "runnerArray"
  ): TypedContractMethod<
    [numbers: BigNumberish[], el: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "runnerString"
  ): TypedContractMethod<[str1: string, str2: string], [boolean], "view">;

  filters: {};
}
