'use client'

import { Star } from "akar-icons";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";
import { useContext, useState } from "react";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { deleteFavoriteCoin, addFavoriteCoin } from "@/utils/api/fetchFromServer";

interface FavoritesCoinsProps {
    id: string;
    name: string;
    symbol: string;
    image: string;
    price: number;
    market_cap_rank: number;
    market_cap_value: number;
    total_volume: number;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h_in_currency: number;
    price_change_percentage_7d_in_currency: number;
    coinNumber: number;
}
interface Filter {
    key: keyof FavoritesCoinsProps,
    isHighest: boolean,
}

export default function FavoritesCoins({ coins, setCoins }: { coins: FavoritesCoinsProps[], setCoins: (value: FavoritesCoinsProps[]) => void }) {

    const [filter, setFilter] = useState<Filter>({ key: 'market_cap_rank', isHighest: false });

    const { selectedCurrency } = useContext(GlobalDataContext);

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

    const switchFilter = (option: keyof FavoritesCoinsProps) => {
        const sortedCoins = [...coins];
        sortedCoins.sort((a: FavoritesCoinsProps, b: FavoritesCoinsProps) => {
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

    const handleFavoriteButton = async (coinId: string) => {
        const updatedFavoriteCoins = coins.filter((coin: FavoritesCoinsProps) => coin.id !== coinId);
        setCoins(updatedFavoriteCoins);
        await deleteFavoriteCoin(coinId);
    };

    return (
        <div className="pt-4 max-xl:overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-slate-800 shadow-xl">
                <thead className="sticky top-0 bg-gray-50 dark:bg-slate-950">
                    <tr>
                        <th></th>
                        <th className="px-6 py-3 text-left">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase" onClick={() => switchFilter('market_cap_rank')}>#</button>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('name')}>Coin</button>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price')}>Price</button>
                        </th>
                        <th className="px-6 py-3 text-right ">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price_change_percentage_1h_in_currency')}>1h</button>
                        </th>
                        <th className="px-6 py-3 text-right ">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price_change_percentage_24h_in_currency')}>24h</button>
                        </th>
                        <th className="px-6 py-3 text-right ">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('price_change_percentage_7d_in_currency')}>7d</button>
                        </th>
                        <th className="px-6 py-3 text-right xl:text-left">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider" onClick={() => switchFilter('total_volume')}>24h Volume</button>
                        </th>
                        <th className="px-6 py-3 text-right xl:text-left">
                            <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider" onClick={() => switchFilter('market_cap_value')}>Market Cap</button>
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider">Last 7 Days</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                    {coins.map((item: FavoritesCoinsProps) => (
                        <tr key={item.symbol}>
                            <td className="px-2">
                                <button onClick={() => handleFavoriteButton(item.id)}>
                                    <Star strokeWidth={2} size={12} color='orange' />
                                </button></td>
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
                            <td className="px-6 py-4 whitespace-nowrap ">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(item.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap xl:text-right"><RenderPercentage number={item.price_change_percentage_1h_in_currency} _class="flex flex-row items-center justify-end" /></td>
                            <td className="px-6 py-4 whitespace-nowrap xl:text-right"><RenderPercentage number={item.price_change_percentage_24h_in_currency} _class="flex flex-row items-center justify-end" /></td>
                            <td className="px-6 py-4 whitespace-nowrap xl:text-right"><RenderPercentage number={item.price_change_percentage_7d_in_currency} _class="flex flex-row items-center justify-end" /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-right xl:text-left">{formatNumber(item.total_volume)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right xl:text-left">{formatNumber(item.market_cap_value)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={`https://www.coingecko.com/coins/${item.coinNumber}/sparkline.svg`} className="w-32 h-10" alt="Sparkline" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}