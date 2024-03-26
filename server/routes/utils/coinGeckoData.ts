import dotenv from 'dotenv';

dotenv.config();

export let trendingCoins: any;
export let globalMarketData: any;
export let fearAndGreedData: any;

const getTrendingData = async () => {
    const apiKey: string | undefined = process.env["COINGECKO_API_KEY"];
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending', {
        headers: {
            "x-cg-demo-api-key": apiKey || '',
        }
    });

    const data = await response.json();

    if (response.ok) {
        trendingCoins = data.coins;
    }

}

const getGlobalMarketData = async () => {
    const apiKey: string | undefined = process.env["COINGECKO_API_KEY"];
    const response = await fetch('https://api.coingecko.com/api/v3/global', {
        headers: {
            "x-cg-demo-api-key": apiKey || '',
        }
    });

    const data = await response.json();

    if (response.ok) {
        globalMarketData = data.data;
    }

}

const getFearAndGreed = async () => {
    const response = await fetch('https://api.alternative.me/fng/');

    const data = await response.json();
    if (response.ok) {
        fearAndGreedData = data;
    }
}

export const coinGeckoDataInterval = () => {
    getTrendingData();
    getGlobalMarketData();
    getFearAndGreed();
    setInterval(getTrendingData, 600000);
    setInterval(getGlobalMarketData, 660000);
    setInterval(getFearAndGreed, 660000);
}