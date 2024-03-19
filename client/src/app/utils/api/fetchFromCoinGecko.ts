import { json } from "./fetch";

export const getSupportedCurrencies = async () => {
    const response = await json('simple/supported_vs_currencies', {
    }, process.env.NEXT_PUBLIC_COINGECKO_API_URL, true);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};


export const getCoinsMarketData = async (currency: string, order: string ,per_page: Number, page: Number) => {
    const response = await json(`coins/markets?vs_currency=${currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=true&locale=en`,{
    }, process.env.NEXT_PUBLIC_COINGECKO_API_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getCurrentCoinData = async (coinId: string) => {
    const response = await json(`coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`,{
    }, process.env.NEXT_PUBLIC_COINGECKO_API_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getHistoricalCoinData = async (coinId: string, date: string) => {
    const response = await json(`coins/${coinId}/history?date=${date}&localization=false`,{
    }, process.env.NEXT_PUBLIC_COINGECKO_API_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
};

export const getCoinMarketChart = async (coinId: string, currency: string, days: Number) => {
    const response = await json(`coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}&interval=daily&precision=full`,{
    },process.env.NEXT_PUBLIC_COINGECKO_API_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}

export const getCoinMarketChartRange = async (coinId: string, currency: string, from: Number, to: Number) => {
    const response = await json(`coins/${coinId}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}&precision=full`,{
    },process.env.NEXT_PUBLIC_COINGECKO_API_URL);

    if (!response.ok || response.json === undefined) {
        throw new Error(`${response.status} - ${response.json?.error}`);
    }

    return response.json;
}