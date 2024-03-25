'use client'

import { useState, useEffect, useContext } from "react"
import { getGlobalMarketData } from "@/utils/api/fetchFromCoinGecko";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";

interface GlobalMarketData {
    coins: number,
    exchanges: number,
    marketCap: number,
    dailyVolume: number,
    Dominance: {
        firstCoin: string,
        firstPercentages: number,
        secondCoin: string,
        secondPercentages: number
    },

}

export default function HeaderStats() {
    const [globalMarketData, setGlobalMarketData] = useState<GlobalMarketData | undefined>();
    const {selectedCurrency} = useContext(GlobalDataContext);

    const formatNumber = (number: number) => {
        const strNum = number.toFixed();
        const length = strNum.length;

        if (length > 12) {
            return `${(number / 1000000000000).toFixed(3)}T ${selectedCurrency.toUpperCase()}`
        } else if (length <= 12 && length >= 9) {
            return `${(number / 1000000000).toFixed(3)}B ${selectedCurrency.toUpperCase()}`
        } else {
            return `${number.toFixed(3)} ${selectedCurrency.toUpperCase()}`
        }
    }

    useEffect(() => {
        (async () => {
            const fetchedGlobalMarketData = await getGlobalMarketData();
            const data = fetchedGlobalMarketData.data;
            const selectedData = {
                coins: data.active_cryptocurrencies,
                exchanges: data.markets,
                marketCap: data.total_market_cap[selectedCurrency],
                dailyVolume: data.total_volume[selectedCurrency],
                Dominance: (() => {
                    const keys = Object.keys(data.market_cap_percentage);
                    const firstKey = keys[0];
                    const firstValue = data.market_cap_percentage[firstKey];
                    const secondKey = keys[1];
                    const secondValue = data.market_cap_percentage[secondKey];
                    return {
                        firstCoin: firstKey.toUpperCase(),
                        firstPercentages: firstValue.toFixed(2),
                        secondCoin: secondKey.toUpperCase(),
                        secondPercentages: secondValue.toFixed(2)
                    }
                })(),
            }
            setGlobalMarketData(selectedData);
        })();

    }, [selectedCurrency]);

    if (!globalMarketData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex flex-row gap-6 text-xs pt-3">
                <p>Coins: {globalMarketData.coins}</p>
                <p>Exchanges: {globalMarketData.exchanges}</p>
                <p>Market Cap: {formatNumber(globalMarketData.marketCap)}</p>
                <p>24h Vol: {formatNumber(globalMarketData.dailyVolume)}</p>
                <p>Dominance: {globalMarketData.Dominance.firstCoin} {globalMarketData.Dominance.firstPercentages}% {globalMarketData.Dominance.secondCoin} {globalMarketData.Dominance.secondPercentages}%</p>
            </div>
        </div>
    )
}