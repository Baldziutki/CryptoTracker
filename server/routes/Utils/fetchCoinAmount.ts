export let coinAmount: Number;

const getCoinAmount = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const data = await response.json();

    coinAmount = data.length;
};

export const setIntervalForCoinAmount = async () => {
    getCoinAmount();
    setInterval(getCoinAmount, 3600000);
};