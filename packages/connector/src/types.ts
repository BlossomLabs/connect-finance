import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from "@1hive/connect-types"
import Transaction from "./models/Transaction"
import TokenBalance from "./models/TokenBalance"

export interface TransactionData {
  id: string
  token: Address
  entity: Address
  isIncoming: boolean
  amount: string
  date: string
  reference: string
  transactionHash: string
}

export interface TokenBalanceData {
  id: string
  token: Address
  balance: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IFinanceConnector {
  disconnect(): Promise<void>
  transactionsForApp(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Transaction[]>
  onTransactionsForApp(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Transaction[]>
  ): SubscriptionHandler
  balanceForToken(
    appAddress: string,
    tokenAddress: string,
    first: number,
    skip: number
  ): Promise<TokenBalance>
  onBalanceForToken(
    appAddress: string,
    tokenAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenBalance>
  ): SubscriptionHandler
  balanceForApp(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<TokenBalance>
  onBalanceForApp(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<TokenBalance>
  ): SubscriptionHandler
}
