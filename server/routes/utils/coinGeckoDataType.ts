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

const DataType = Type.Object({
    price: Type.String(),
    price_btc: Type.String(),
    price_change_percentage_24h: Type.Any(),
    market_cap: Type.String(),
    market_cap_btc: Type.String(),
    total_volume: Type.String(),
    total_volume_btc: Type.String(),
    sparkline: Type.String(),
    content: Type.Optional(Type.Object({
        title: Type.String(),
        description: Type.String(),
    })),
});


const CoinType = Type.Object({
    thumb: Type.String(),
    name: Type.String(),
    symbol: Type.String(),
    market_cap_rank: Type.Number(),
    id: Type.String(),
    coin_id: Type.Number(),
    data: DataType,
});

export const SearchCoins = Type.Array(CoinType);

export type SearchCoinsType = Static<typeof SearchCoins>;

export const GlobalMarketData = Type.Object({
    active_cryptocurrencies: Type.Number(),
    upcoming_icos: Type.Number(),
    ongoing_icos: Type.Number(),
    ended_icos: Type.Number(),
    markets: Type.Number(),
    total_market_cap: Type.Any(),
    total_volume: Type.Any(),
    market_cap_percentage: Type.Any(),
    market_cap_change_percentage_24h_usd: Type.Number(),
    updated_at: Type.Number(),
});

export type GlobalMarketDataType = Static<typeof GlobalMarketData>;