'use client'

import { useState, useEffect, useContext } from 'react';
import { getTrendingCoins } from '@/utils/api/fetchFromServer';
import { getGlobalMarketData, getFearAndGreed } from '@/utils/api/fetchFromServer';
import { GlobalDataContext } from '@/utils/context/GlobalDataContext';
import { RenderPercentage } from '../renderPercentage/RenderPercentage';
import MarketCapCard from './MarketCapCard';
import TradingVolumeCard from './TradingVolumeCard';
import TrendingCard from './TrendingCard';
import FearAndGreedCard from './FearAndGreedCard';


interface MarketData {
    marketCap: number,
    dailyVolume: number,
    percentage: number
}

interface FearAndGreed {
    name: string,
    data: [{
        value: string,
        value_classification: string,
        timestamp: string,
        time_until_update: string
    }]

}

export default function Highlights() {

    const [coins, setCoins] = useState<any>([]);
    const [globalMarketData, setGlobalMarketData] = useState<MarketData>({ marketCap: 0, dailyVolume: 0, percentage: 0 });
    const [fearAndGreed, setFearAndGreed] = useState<FearAndGreed>({
        name: '',
        data: [{
            value: '0',
            value_classification: '',
            timestamp: '',
            time_until_update: ''
        }]
    });
    const { selectedCurrency } = useContext(GlobalDataContext);

    const formatedMarketCap = (number: number) => {
        const strNum = number.toFixed();
        const length = strNum.length;

        if (length > 12) {
            return `${(number / 1000000000000).toFixed(2)}T Trillion ${selectedCurrency.toUpperCase()}`
        } else if (length <= 12 && length >= 9) {
            return `${(number / 1000000000).toFixed(2)}B Billion ${selectedCurrency.toUpperCase()}`
        } else {
            return `${(number / 1000).toFixed(2)}K Thousand ${selectedCurrency.toUpperCase()}`
        }
    }

    useEffect(() => {
        (async () => {
            const fetchedTrendingData = await getTrendingCoins();
            const fetchedGlobalMarketData = await getGlobalMarketData();
            const fetchedFearAndGreedData = await getFearAndGreed();
            const data = fetchedGlobalMarketData;
            const selectedData = {
                marketCap: data.total_market_cap[selectedCurrency],
                dailyVolume: data.total_volume[selectedCurrency],
                percentage: data.market_cap_change_percentage_24h_usd,
            }
            let topThreeCoins: any = [];
            topThreeCoins.push(fetchedTrendingData[0]);
            topThreeCoins.push(fetchedTrendingData[1]);
            topThreeCoins.push(fetchedTrendingData[2]);
            const { metadata, ...fearAndGreedData } = fetchedFearAndGreedData;
            setGlobalMarketData(selectedData);
            setCoins(topThreeCoins);
            setFearAndGreed(fearAndGreedData);

        })();
    }, [selectedCurrency]);

    return (
        <div className='pt-2'>
            <div className='flex flex-col'>
                <span className='font-extrabold text-2xl'>Cryptocurrency Prices by Market Cap</span>
                <div className='flex flex-row gap-1'>
                    <span className='text-sm'>The global cryptocurrency market cap today is {new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(globalMarketData.marketCap)}, a</span>
                    <RenderPercentage number={globalMarketData.percentage} _class='flex items-center' />
                    <span>change in the last 24 hours</span>
                </div>
            </div>
            <div className="grid xl:grid-flow-col 2xl:grid-cols-3  pt-4 gap-2 ">
                <div className="grid gap-3">
                    <MarketCapCard marketCap={globalMarketData.marketCap} percentage={globalMarketData.percentage} />
                    <TradingVolumeCard dailyVolume={globalMarketData.dailyVolume} />
                </div>
                <TrendingCard coins={coins} selectedCurrency={`${selectedCurrency}`} />
                <FearAndGreedCard value={Number(fearAndGreed?.data[0].value)} />
            </div>
        </div>
    )
}