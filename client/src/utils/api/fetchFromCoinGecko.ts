import { off } from "process";
import { json } from "./fetch";

export const getSupportedCurrencies = async () => {
    const response = await json('simple/supported_vs_currencies', { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};


export const getCoinsMarketData = async (currency: string, per_page: Number, page: Number, order: string = 'market_cap_desc',) => {
    const response = await json(`coins/markets?vs_currency=${currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=true&locale=en&price_change_percentage=1h%2C24h%2C7d`, { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json as any[];
};

export const getCurrentCoinData = async (coinId: string) => {
    const response = await json(`coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`, { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getHistoricalCoinData = async (coinId: string, date: string) => {
    const response = await json(`coins/${coinId}/history?date=${date}&localization=false`, { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getCoinMarketChart = async (coinId: string, currency: string, days: Number) => {
    const response = await json(`coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}&interval=daily&precision=full`, { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getCoinMarketChartRange = async (coinId: string, currency: string, from: Number, to: Number) => {
    const response = await json(`coins/${coinId}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}&precision=full`, { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getExchangesList = async () => {
    const response = await json('exchanges', { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getGlobalMarketData = async () => {
    const response = await json('global', { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}

export const searchCoins = async (input: string) => {
    const response = await json(`search?query=${input}`, { headers: { 'x-cg-demo-api-key': `${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}` } },
        process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}