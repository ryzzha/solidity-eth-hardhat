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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface AuctionEngineInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "auctions"
      | "buy"
      | "createAuction"
      | "getPriceFor"
      | "owner"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "AuctionCreated" | "AuctionEnded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "auctions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "buy", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "createAuction",
    values: [string, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceFor",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;

  decodeFunctionResult(functionFragment: "auctions", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
}

export namespace AuctionCreatedEvent {
  export type InputTuple = [
    index: BigNumberish,
    itemName: string,
    startingPrice: BigNumberish,
    duration: BigNumberish
  ];
  export type OutputTuple = [
    index: bigint,
    itemName: string,
    startingPrice: bigint,
    duration: bigint
  ];
  export interface OutputObject {
    index: bigint;
    itemName: string;
    startingPrice: bigint;
    duration: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AuctionEndedEvent {
  export type InputTuple = [
    index: BigNumberish,
    currentPrice: BigNumberish,
    winner: AddressLike
  ];
  export type OutputTuple = [
    index: bigint,
    currentPrice: bigint,
    winner: string
  ];
  export interface OutputObject {
    index: bigint;
    currentPrice: bigint;
    winner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AuctionEngine extends BaseContract {
  connect(runner?: ContractRunner | null): AuctionEngine;
  waitForDeployment(): Promise<this>;

  interface: AuctionEngineInterface;

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

  auctions: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, bigint, bigint, bigint, bigint, boolean] & {
        seller: string;
        item: string;
        startingPrice: bigint;
        finalPrice: bigint;
        startAt: bigint;
        endAt: bigint;
        discountRate: bigint;
        stopped: boolean;
      }
    ],
    "view"
  >;

  buy: TypedContractMethod<[index: BigNumberish], [void], "payable">;

  createAuction: TypedContractMethod<
    [
      _item: string,
      _startingPrice: BigNumberish,
      _duration: BigNumberish,
      _discountRate: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  getPriceFor: TypedContractMethod<[index: BigNumberish], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "auctions"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, bigint, bigint, bigint, bigint, boolean] & {
        seller: string;
        item: string;
        startingPrice: bigint;
        finalPrice: bigint;
        startAt: bigint;
        endAt: bigint;
        discountRate: bigint;
        stopped: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "buy"
  ): TypedContractMethod<[index: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "createAuction"
  ): TypedContractMethod<
    [
      _item: string,
      _startingPrice: BigNumberish,
      _duration: BigNumberish,
      _discountRate: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getPriceFor"
  ): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "AuctionCreated"
  ): TypedContractEvent<
    AuctionCreatedEvent.InputTuple,
    AuctionCreatedEvent.OutputTuple,
    AuctionCreatedEvent.OutputObject
  >;
  getEvent(
    key: "AuctionEnded"
  ): TypedContractEvent<
    AuctionEndedEvent.InputTuple,
    AuctionEndedEvent.OutputTuple,
    AuctionEndedEvent.OutputObject
  >;

  filters: {
    "AuctionCreated(uint256,string,uint256,uint256)": TypedContractEvent<
      AuctionCreatedEvent.InputTuple,
      AuctionCreatedEvent.OutputTuple,
      AuctionCreatedEvent.OutputObject
    >;
    AuctionCreated: TypedContractEvent<
      AuctionCreatedEvent.InputTuple,
      AuctionCreatedEvent.OutputTuple,
      AuctionCreatedEvent.OutputObject
    >;

    "AuctionEnded(uint256,uint256,address)": TypedContractEvent<
      AuctionEndedEvent.InputTuple,
      AuctionEndedEvent.OutputTuple,
      AuctionEndedEvent.OutputObject
    >;
    AuctionEnded: TypedContractEvent<
      AuctionEndedEvent.InputTuple,
      AuctionEndedEvent.OutputTuple,
      AuctionEndedEvent.OutputObject
    >;
  };
}
