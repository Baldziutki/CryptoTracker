'use client'

import { useState, useEffect, useContext } from "react"
import { getGlobalMarketData } from "@/utils/api/fetchFromServer";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { RenderPercentage } from "@/components/renderPercentage/RenderPercentage";
import dynamic from "next/dynamic";
const NoSSR = dynamic(() => Promise.resolve(({ number, currency }: { number: number, currency:string }) => {
    const strNum = number.toFixed();
    const length = strNum.length;

    if (length > 12) {
        return <> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number / 1000000000000))} T </>
    } else if (length <= 12 && length >= 9) {
        return <> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number / 1000000000))} B </>
    } else {
        return <> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number))} </>
    }
}), { ssr: false })

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
    percentage: number,

}

export default function HeaderStats() {
    const [globalMarketData, setGlobalMarketData] = useState<GlobalMarketData | undefined>();
    const { selectedCurrency } = useContext(GlobalDataContext);


    useEffect(() => {
        (async () => {
            const fetchedGlobalMarketData = await getGlobalMarketData();
            const data = fetchedGlobalMarketData;
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
                percentage: data.market_cap_change_percentage_24h_usd,
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
                <div>
                    <span>Coins: </span>
                    <span className='font-medium'>{globalMarketData.coins}</span>
                </div>
                <div>
                    <span>Exchanges: </span>
                    <span className='font-medium'>{globalMarketData.exchanges}</span>
                </div>
                <div className="flex flex-row gap-1">
                    <span>Market Cap: </span>
                    <span className="flex flex-row font-medium"><NoSSR number={globalMarketData.marketCap} currency={selectedCurrency}/> <RenderPercentage number={globalMarketData.percentage} _class='flex items-center' /></span>
                </div>
                <div>
                    <span>24h Vol: </span>
                    <span className='font-medium'><NoSSR number={globalMarketData.dailyVolume} currency={selectedCurrency}/></span>
                </div>
                <div>
                    <span>Dominance: </span>
                    <span className='font-medium'>{globalMarketData.Dominance.firstCoin} {globalMarketData.Dominance.firstPercentages}% {globalMarketData.Dominance.secondCoin} {globalMarketData.Dominance.secondPercentages}%</span>
                </div>
            </div>
        </div>
    )
}