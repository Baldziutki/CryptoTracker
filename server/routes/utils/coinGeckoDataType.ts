import { Static, Type } from '@sinclair/typebox';


const TrendingCoin = Type.Object({
    id: Type.String(),
    coin_id: Type.Number(),
    name: Type.String(),
    symbol: Type.String(),
    market_cap_rank: Type.Number(),
    thumb: Type.String(),
    small: Type.String(),
    large: Type.String(),
    slug: Type.String(),
    price_btc: Type.Number(),
    score: Type.Number(),
    data: Type.Object({
        price: Type.String(),
        price_btc: Type.String(),
        price_change_percentage_24h: Type.Any(),
        market_cap: Type.String(),
        market_cap_btc: Type.String(),
        total_volume: Type.String(),
        total_volume_btc: Type.String(),
        sparkline: Type.String(),
        content: Type.Optional(Type.Any()), 
    }),
});

export const TrendingCoins = Type.Array(Type.Object({
    item: TrendingCoin,
}));

export  type TrendingCoinsType = Static<typeof TrendingCoins>;