import { Static, Type } from '@sinclair/typebox'

export const Coin = Type.Object({
  coinId: Type.String(),
  coinName: Type.String(),
  coinAmount: Type.Number(),
  coinAddDate: Type.Optional(Type.String()),
  coinAddDateValue: Type.Number(),
});
export type CoinType = Static<typeof Coin>;

export const CoinDelete = Type.Object({
  coinId: Type.String(),
  coinName: Type.String(),
  coinAmount: Type.Number(),
});
export type CoinDeleteType = Static<typeof CoinDelete>;

export const UserCoins = Type.Array(Coin);

export type UserCoinsType = Static<typeof UserCoins>;

export const FavoriteCoin = Type.Object({
  coinId: Type.String(),
  coinName: Type.Optional(Type.String()),
});
export type FavoriteCoinType = Static<typeof FavoriteCoin>;

export const FavoriteUserCoins = Type.Array(FavoriteCoin);
export type FavoriteCoinsType = Static<typeof FavoriteUserCoins>;

