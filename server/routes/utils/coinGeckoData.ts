import dotenv from 'dotenv';

dotenv.config();

export let trendingCoins: any;

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

export const coinGeckoDataInterval = () => {
    getTrendingData();
    setInterval(getTrendingData, 600000);
}