import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from "@1hive/connect-types"
import { ErrorException } from "@1hive/connect-core"
import { GraphQLWrapper, QueryResult } from "@1hive/connect-thegraph"
import { IFinanceConnector } from "../types"
import Transaction from "../models/Transaction"
import TokenBalance from "../models/TokenBalance"
import * as queries from "./queries"
import { parseTransactions, parseTokenBalances } from "./parsers"

export function subgraphUrlFromChainId(chainId: number): string | null {
  if (chainId === 1) {
    return "https://api.thegraph.com/subgraphs/name/blossomlabs/aragon-finance-mainnet"
  }
  if (chainId === 4) {
    return "https://api.thegraph.com/subgraphs/name/blossomlabs/aragon-finance-rinkeby"
  }
  if (chainId === 10) {
    return "https://api.thegraph.com/subgraphs/name/blossomlabs/aragon-finance-optimism"
  }
  if (chainId === 100) {
    return "https://api.thegraph.com/subgraphs/name/blossomlabs/aragon-finance-gnosis"
  }

  return null
}

type FinanceConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class FinanceConnectorTheGraph implements IFinanceConnector {
  #gql: GraphQLWrapper

  constructor(config: FinanceConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new ErrorException(
        "FinanceConnectorTheGraph requires subgraphUrl to be passed."
      )
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async disconnect(): Promise<void> {
    this.#gql.close()
  }

  async transactionsForApp(
    appAddress: Address,
    first: number,
    skip: number
  ): Promise<Transaction[]> {
    return this.#gql.performQueryWithParser<Transaction[]>(
      queries.ALL_TRANSACTIONS("query"),
      { appAddress, first, skip },
      (result: QueryResult) => parseTransactions(result)
    )
  }

  onTransactionsForApp(
    appAddress: Address,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Transaction[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Transaction[]>(
      queries.ALL_TRANSACTIONS("subscription"),
      { appAddress, first, skip },
      callback,
      (result: QueryResult) => parseTransactions(result)
    )
  }

  async balanceForToken(
    appAddress: Address,
    tokenAddress: Address,
    first: number,
    skip: number
  ): Promise<TokenBalance> {
    return this.#gql.performQueryWithParser<TokenBalance>(
      queries.BALANCE_FOR_TOKEN("query"),
      { appAddress, tokenAddress, first, skip },
      (result: QueryResult) => parseTokenBalances(result)
    )
  }

  onBalanceForToken(
    appAddress: Address,
    tokenAddress: Address,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenBalance>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<TokenBalance>(
      queries.BALANCE_FOR_TOKEN("subscription"),
      { appAddress, tokenAddress, first, skip },
      callback,
      (result: QueryResult) => parseTokenBalances(result)
    )
  }

  balanceForApp(
    appAddress: Address,
    first: number,
    skip: number
  ): Promise<TokenBalance> {
    return this.#gql.performQueryWithParser<TokenBalance>(
      queries.BALANCE_FOR_APP("query"),
      { appAddress, first, skip },
      (result: QueryResult) => parseTokenBalances(result)
    )
  }

  onBalanceForApp(
    appAddress: Address,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenBalance>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<TokenBalance>(
      queries.BALANCE_FOR_APP("subscription"),
      { appAddress, first, skip },
      callback,
      (result: QueryResult) => parseTokenBalances(result)
    )
  }
}
