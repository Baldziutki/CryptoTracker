import { Static, Type } from '@sinclair/typebox'

export const CoinAdd = Type.Object({
  coinId: Type.String(),
  coinName: Type.String(),
  coinAmount: Type.Number(),
  coinAddDate: Type.Optional(Type.String())
});
export type CoinAddType = Static<typeof CoinAdd>;

export const CoinDelete = Type.Object({
  coinId: Type.String(),
  coinName: Type.String(),
  coinAmount: Type.Number(),
});
export type CoinDeleteType = Static<typeof CoinDelete>;

export const UserCoins = Type.Object({
  coins: Type.Array(
    Type.Object({
      coinId: Type.String(),
      coinName: Type.String(),
      coinAmount: Type.Number(),
      coinAddDate: Type.Optional(Type.String()),
    })
  ),
});
export type UserCoinsType = Static<typeof UserCoins>;

export const FavoriteCoin = Type.Object({
  coinId: Type.String(),
  coinName: Type.Optional(Type.String()),
});
export type FavoriteCoinType = Static<typeof FavoriteCoin>;

export const FavoriteUserCoins = Type.Object({
  favoriteCoins: Type.Array(
    Type.Object({
      coinId: Type.String(),
      coinName: Type.String()
    })
  ),
});
export type FavoriteCoinsType = Static<typeof FavoriteUserCoins>;

