export let exchangesAmount: Number;

const getExchangesAmount = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/exchanges/list');
    const data = await response.json();

    exchangesAmount = data.length;
};

export const setIntervalForExchangesAmount = async () => {
    getExchangesAmount();
    setInterval(getExchangesAmount, 3600000);
};