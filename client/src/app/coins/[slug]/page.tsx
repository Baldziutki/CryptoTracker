'use client'
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs"
import CoinChart from "@/components/coins/CoinChart";
import DataSection from "@/components/coins/DataSection";
import PriceSection from "@/components/coins/PriceSection"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react";
import { getCoinMarketChart, getCurrentCoinData } from "@/utils/api/fetchFromCoinGecko";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import HistoricalPrice from "@/components/coins/HistoricalPrice";
import CoinCalculator from "@/components/coins/CoinCalculator";

export default function Coin() {

    const [days, setDays] = useState<number>(365);
    const [chartData, setChartData] = useState<[number, number][]>();
    const [priceData, setPriceData] = useState<any>();
    const [coinData, setCoinData] = useState<any>();
    const [historcialData, setHistoricalData] = useState<any>()
    const [color, setColor] = useState('blue');
    const params = useParams<{ slug: string }>();
    const { selectedCurrency } = useContext(GlobalDataContext)
    const [activeButton, setActiveButton] = useState<number>(365);

    const handleButtonClick = (days: number) => {
        setActiveButton(days);
    };

    useEffect(() => {
        (async () => {
            const fetchedChartData = await getCoinMarketChart(params.slug, selectedCurrency, days);
            setChartData(fetchedChartData.prices);
        })();
    }, [days]);

    useEffect(() => {
        (async () => {
            const fetchedCurrentCoinData = await getCurrentCoinData(params.slug);
            const filteredPriceData = {
                image: fetchedCurrentCoinData.image.large,
                name: fetchedCurrentCoinData.name,
                symbol: fetchedCurrentCoinData.symbol,
                market_cap_rank: fetchedCurrentCoinData.market_cap_rank,
                price: fetchedCurrentCoinData.market_data.current_price[selectedCurrency],
                price_change: fetchedCurrentCoinData.market_data.price_change_percentage_24h_in_currency[selectedCurrency],
                low_24h: fetchedCurrentCoinData.market_data.low_24h[selectedCurrency],
                high_24h: fetchedCurrentCoinData.market_data.high_24h[selectedCurrency],
                current_price_to_bitcoin: fetchedCurrentCoinData.market_data.current_price['btc'],
                price_change_24h_to_bitcoin: fetchedCurrentCoinData.market_data.price_change_percentage_24h_in_currency['btc'],
            }
            const filteredCoinData = {
                market_cap: fetchedCurrentCoinData.market_data.market_cap[selectedCurrency],
                fully_diluted_valuation: fetchedCurrentCoinData.market_data.fully_diluted_valuation[selectedCurrency],
                total_volume: fetchedCurrentCoinData.market_data.total_volume[selectedCurrency],
                total_supply: fetchedCurrentCoinData.market_data.total_supply,
                circulating_supply: fetchedCurrentCoinData.market_data.circulating_supply,
                max_supply: fetchedCurrentCoinData.market_data.max_supply,
            }
            const filteredHistoricalData = {
                price: fetchedCurrentCoinData.market_data.current_price[selectedCurrency],
                low_24h: fetchedCurrentCoinData.market_data.low_24h[selectedCurrency],
                high_24h: fetchedCurrentCoinData.market_data.high_24h[selectedCurrency],
                ath: fetchedCurrentCoinData.market_data.ath[selectedCurrency],
                atl: fetchedCurrentCoinData.market_data.atl[selectedCurrency],
                ath_date: fetchedCurrentCoinData.market_data.ath_date[selectedCurrency],
                atl_date: fetchedCurrentCoinData.market_data.atl_date[selectedCurrency],
            }
            const whichColor = filteredPriceData.price_change > 0 ? 'green' : 'red';
            setColor(whichColor);
            setPriceData(filteredPriceData);
            setCoinData(filteredCoinData);
            setHistoricalData(filteredHistoricalData);
        })();
    }, [selectedCurrency]);

    const options = {
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date',
            },
        },
        yAxis: {
            type: 'number',
            title: {
                text: 'Price (USD)',
            },
        },
        series: [{
            name: 'Price',
            data: chartData,
            color: color
        }]
    }

    return (
        <div className="flex flex-col container mx-auto 2xl:max-w-screen-xl pt-2 gap-8">
            <div className="">
                <Breadcrumbs.Root>
                    <Breadcrumbs.Item name='Cryptocurencies' link='/' className="font-medium" />
                    <Breadcrumbs.Item name={params.slug} className="font-light capitalize" />
                </Breadcrumbs.Root>
                <PriceSection {...priceData} />
                <div className="grid grid-cols-2 gap-4">
                    <DataSection {...coinData} />
                    <div>
                        <HistoricalPrice {...historcialData} />
                        {priceData ? <CoinCalculator coinName={params.slug} currency={selectedCurrency.toUpperCase()} price={priceData.price} /> : null}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-end gap-2 pb-2">
                    <button
                        className={`border-2 rounded w-12 ${activeButton === 1 ? 'bg-slate-300 dark:bg-slate-600' : ''}`}
                        onClick={() => handleButtonClick(1)}>24h</button>
                    <button
                        className={`border-2 rounded w-12 ${activeButton === 7 ? 'bg-slate-300 dark:bg-slate-600' : ''}`}
                        onClick={() => handleButtonClick(7)}>7d</button>
                    <button
                        className={`border-2 rounded w-12 ${activeButton === 31 ? 'bg-slate-300 dark:bg-slate-600' : ''}`}
                        onClick={() => handleButtonClick(31)}>1m</button>
                    <button
                        className={`border-2 rounded w-12 ${activeButton === 92 ? 'bg-slate-300 dark:bg-slate-600' : ''}`}
                        onClick={() => handleButtonClick(92)}>3m</button>
                    <button
                        className={`border-2 rounded w-12 ${activeButton === 365 ? 'bg-slate-300 dark:bg-slate-600' : ''}`}
                        onClick={() => handleButtonClick(365)}>1y</button>
                </div>
                <CoinChart {...options} />
            </div>
        </div>
    )
}