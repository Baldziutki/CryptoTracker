import { Static, Type } from '@sinclair/typebox'

export const Transaction = Type.Object({
  transactionId: Type.String(),
  coinId: Type.String(),
  coinName: Type.String(),
  coinAmount: Type.Number(),
  coinAddDate: Type.Optional(Type.String()),
  coinAddDateValue: Type.Number(),
});
export type TransactionType = Static<typeof Transaction>;

export const AddTransaction = Type.Object({
  coinId: Type.String(),
  coinName: Type.String(),
  coinAmount: Type.Number(),
  coinAddDate: Type.Optional(Type.String()),
  coinAddDateValue: Type.Number(),
});
export type AddTransactionType = Static<typeof AddTransaction>;

export const TransactionDelete = Type.Object({
  transactionId: Type.String(),
});
export type TransactionDeleteType = Static<typeof TransactionDelete>;

export const UserTransactions = Type.Array(Transaction);

export type UserTransactionsType = Static<typeof UserTransactions>;

export const FavoriteCoin = Type.Object({
  coinId: Type.String(),
  coinName: Type.Optional(Type.String()),
});
export type FavoriteCoinType = Static<typeof FavoriteCoin>;

export const FavoriteUserCoins = Type.Array(FavoriteCoin);
export type FavoriteCoinsType = Static<typeof FavoriteUserCoins>;

