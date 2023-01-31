import { ErrorUnexpectedResult } from "@1hive/connect-core"
import { QueryResult } from "@1hive/connect-thegraph"
import TokenBalance from "../../models/TokenBalance"
import { TokenBalanceData } from "../../types"

export function parseTokenBalances(result: QueryResult): TokenBalance {
  const tokenBalances = result.data.tokenBalances

  if (!tokenBalances) {
    throw new ErrorUnexpectedResult("Unable to parse TokenBalance.")
  }

  const datas = tokenBalances.map((balance: any): TokenBalanceData => {
    return balance
  })

  return datas.map((data: TokenBalanceData) => {
    return new TokenBalance(data)
  })
}
