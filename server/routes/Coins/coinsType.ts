import { Static, Type } from '@sinclair/typebox'

export const CoinAdd = Type.Object({
    coinId: Type.String(),
    coinName: Type.String(),
    coinAmount: Type.Number(),
    coinAddDate: Type.Date()
});
export type CoinAddType = Static<typeof CoinAdd>;

export const CoinDelete = Type.Object({
    coinId: Type.String(),
    coinName: Type.String(),
    coinAmount: Type.Number(),
});
export type CoinDeleteType = Static<typeof CoinDelete>;