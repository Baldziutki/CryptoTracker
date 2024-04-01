'use client'

import { useState, useEffect, useContext } from "react";
import { getGlobalMarketData } from "@/utils/api/fetchFromServer";
import { useSearchParams } from "next/navigation";
import { getCoinsMarketData } from "@/utils/api/fetchFromCoinGecko";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";
import Pagination from "../pagination/Pagination";
interface coinsAmountData {
    amount: number,
    pages: number
}

interface CoinMarketData {
    id: string,
    market_cap_rank: number,
    image: string,
    name: string,
    symbol: string,
    current_price: number,
    price_change_percentage_1h_in_currency: number,
    price_change_percentage_24h_in_currency: number,
    price_change_percentage_7d_in_currency: number,
    total_volume: number,
    market_cap: number,
    coinNumber: number,
}
interface Filter {
    key: keyof CoinMarketData,
    isHighest: boolean,
}
export default function Cryptocurrencies() {
    const [coinsAmount, setCoinsAmount] = useState<coinsAmountData>({ amount: 0, pages: 1 });
    const [coins, setCoins] = useState<CoinMarketData[]>([]);
    const [filter, setFilter] = useState<Filter>({ key: 'market_cap_rank', isHighest: false });

    const searchParams = useSearchParams();
    const pagination = searchParams.get('page') !== null ? parseInt(searchParams.get('page')!) : 1;

    const { selectedCurrency } = useContext(GlobalDataContext);

    const extractImageNumber = (imageString: string) => {
        const regex = /\/images\/(\d+)\/large\//;
        const match = imageString.match(regex);
        if (match && match[1]) {
            return parseInt(match[1]);
        } else {
            return 36501; //number of empty svg
        }
    }

    const formatNumber = (number: number) => {
        if (number === null) {
            return '-';
        } else {
            const strNum = number.toFixed();
            const length = strNum.length;
            if (number < 1) {
                return `${number} ${selectedCurrency.toUpperCase()}`
            }
            else if (length > 12) {
                return `${(number / 1000000000000).toFixed(3)} T ${selectedCurrency.toUpperCase()}`
            } else if (length <= 12 && length >= 9) {
                return `${(number / 1000000000).toFixed(3)} B ${selectedCurrency.toUpperCase()}`
            } else if (length < 9 && length >= 6) {
                return `${(number / 1000000).toFixed(3)} M ${selectedCurrency.toUpperCase()}`
            } else {
                return `${number.toFixed(2)} ${selectedCurrency.toUpperCase()}`
            }
        }
    }
    const switchFilter = (option: keyof CoinMarketData) => {
        const sortedCoins = [...coins];
        sortedCoins.sort((a: CoinMarketData, b: CoinMarketData) => {
            const itemA = a[option];
            const itemB = b[option];
            if (option === filter.key && filter.isHighest) {
                setFilter({ key: option, isHighest: false });
                return (itemA < itemB) ? -1 : ((itemA > itemB) ? 1 : 0);
            } else {
                setFilter({ key: option, isHighest: true });
                return (itemA > itemB) ? -1 : ((itemA < itemB) ? 1 : 0);
            }

        });
        setCoins(sortedCoins);
    }

    useEffect(() => {
        setCoins([]);
        (async () => {
            const fetchedGlobalMarketData = await getGlobalMarketData();
            const fetchedCoinsMarketData = await getCoinsMarketData(selectedCurrency, 100, pagination);
            const coinsAmountData = {
                amount: fetchedGlobalMarketData.active_cryptocurrencies,
                pages: Math.ceil(fetchedGlobalMarketData.active_cryptocurrencies / 100),
            }
            const coinsMarketData: CoinMarketData[] = fetchedCoinsMarketData.map((item: CoinMarketData) => ({
                id: item.id,
                market_cap_rank: item.market_cap_rank ?? '-',
                image: item.image,
                name: item.name,
                symbol: item.symbol,
                current_price: item.current_price,
                price_change_percentage_1h_in_currency: item.price_change_percentage_1h_in_currency,
                price_change_percentage_24h_in_currency: item.price_change_percentage_24h_in_currency,
                price_change_percentage_7d_in_currency: item.price_change_percentage_7d_in_currency,
                total_volume: item.total_volume,
                market_cap: item.market_cap,
                coinNumber: extractImageNumber(item.image)
            }));
            setCoins(coinsMarketData);
            setCoinsAmount(coinsAmountData);
        })();
    }, [selectedCurrency,pagination]);


    return (
        <div className="pt-2">
            <div className="max-xl:overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-slate-800">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-slate-950">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase" onClick={() => switchFilter('market_cap_rank')}>#</button>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('name')}>Coin</button>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('current_price')}>Price</button>
                            </th>
                            <th className="px-6 py-3 text-right xl:text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price_change_percentage_1h_in_currency')}>1h</button>
                            </th>
                            <th className="px-6 py-3 text-right xl:text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price_change_percentage_24h_in_currency')}>24h</button>
                            </th>
                            <th className="px-6 py-3 text-right xl:text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price_change_percentage_7d_in_currency')}>7d</button>
                            </th>
                            <th className="px-6 py-3 text-right xl:text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider" onClick={() => switchFilter('total_volume')}>24h Volume</button>
                            </th>
                            <th className="px-6 py-3 text-right xl:text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider" onClick={() => switchFilter('market_cap')}>Market Cap</button>
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider">Last 7 Days</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {coins.map((item: CoinMarketData) => (
                            <tr key={item.symbol}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.market_cap_rank}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a className="flex items-center" href={`/coins/${item.id}`}>
                                        <img src={item.image} className="w-10 h-10 rounded-full mr-2" alt={item.name} />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                            <div className="text-xs text-gray-500 uppercase">{item.symbol}</div>
                                        </div>
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap ">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(item.current_price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap xl:text-right"><RenderPercentage number={item.price_change_percentage_1h_in_currency} _class="flex flex-row items-center justify-end" /></td>
                                <td className="px-6 py-4 whitespace-nowrap xl:text-right"><RenderPercentage number={item.price_change_percentage_24h_in_currency} _class="flex flex-row items-center justify-end" /></td>
                                <td className="px-6 py-4 whitespace-nowrap xl:text-right"><RenderPercentage number={item.price_change_percentage_7d_in_currency} _class="flex flex-row items-center justify-end" /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right xl:text-left">{formatNumber(item.total_volume)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right xl:text-left">{formatNumber(item.market_cap)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={`https://www.coingecko.com/coins/${item.coinNumber}/sparkline.svg`} className="w-32 h-10" alt="Sparkline" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="py-6">
                <Pagination currentPage={pagination} totalPages={coinsAmount.pages} />
            </div>
        </div>
    );
}