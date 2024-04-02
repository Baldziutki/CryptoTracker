'use client'

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";
import Pagination from "../pagination/Pagination";
import { getGlobalMarketData } from "@/utils/api/fetchFromServer";
import { getExchangesData } from "@/utils/api/fetchFromCoinGecko";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";

interface CoinsExchangestData {
    amount: number,
    pages: number
}

interface ExchangesData {
    id: string,
    image: string,
    name: string,
    year_established: number,
    trust_score: number,
    trust_score_rank: number,
    url: string,
    trade_volume_24h_btc: number,
    trade_volume_24h_btc_normalized: number,
    exchangeNumber: number,
}
interface Filter {
    key: keyof ExchangesData,
    isHighest: boolean,
}
export default function ExchangesComponent() {

    const [exchangesAmount, setExchangesAmount] = useState<CoinsExchangestData>({ amount: 0, pages: 1 });
    const [exchangesData, setExchangesData] = useState<ExchangesData[]>([]);
    const [filter, setFilter] = useState<Filter>({ key: 'trust_score_rank', isHighest: false });
    const { selectedCurrency } = useContext(GlobalDataContext);

    const searchParams = useSearchParams();
    const pagination = searchParams.get('page') !== null ? parseInt(searchParams.get('page')!) : 1;

    const switchFilter = (option: keyof ExchangesData) => {
        const sortedExchanges = [...exchangesData];
        sortedExchanges.sort((a: ExchangesData, b: ExchangesData) => {
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
        setExchangesData(sortedExchanges);
    };

    const extractImageNumber = (imageString: string) => {
        const regex = /\/images\/(\d+)\/small\//;
        const match = imageString.match(regex);
        if (match && match[1]) {
            return parseInt(match[1]);
        } else {
            return 36501; //number of empty svg
        }
    }


    useEffect(() => {
        (async () => {
            const fetchedGlobalMarketData = await getGlobalMarketData();
            const fetchedExchangesData = await getExchangesData(100, pagination);
            const exchangesAmountData = {
                amount: fetchedGlobalMarketData.markets,
                pages: Math.ceil(fetchedGlobalMarketData.markets / 100),
            }
            const filteredExchangesData: ExchangesData[] = fetchedExchangesData.map((item: ExchangesData) => ({
                id: item.id,
                image: item.image,
                name: item.name,
                year_established: item.year_established,
                trust_score: item.trust_score,
                url: item.url,
                trust_score_rank: item.trust_score_rank,
                trade_volume_24h_btc: item.trade_volume_24h_btc,
                trade_volume_24h_btc_normalized: item.trade_volume_24h_btc_normalized,
                exchangeNumber: extractImageNumber(item.image),
            }))
            setExchangesData(filteredExchangesData);
            setExchangesAmount(exchangesAmountData);
        })();
    }, [pagination])


    return (
        <div className="pt-2">
            <div className="max-xl:overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-slate-800">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-slate-950">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase" onClick={() => switchFilter('trust_score_rank')}>#</button>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('name')}>Exchange</button>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('trust_score')}>Trust Score</button>
                            </th>
                            <th className="px-6 py-3 text-right">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('trade_volume_24h_btc_normalized')}>24h Volume (Normalized)</button>
                            </th>
                            <th className="px-6 py-3 text-right">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('trade_volume_24h_btc')}>24h Volume</button>
                            </th>
                            <th className="px-6 py-3 text-right">
                                <button className="text-xs font-medium text-gray-500 dark:text-slate-50 uppercase " onClick={() => switchFilter('year_established')}>Year established</button>
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-slate-50 uppercase tracking-wider">Last 7 Days</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {exchangesData.map((item: ExchangesData) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.trust_score_rank}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a className="flex items-center" href={item.url}>
                                        <img src={item.image} className="w-10 h-10 rounded-full mr-2" alt={item.name} />
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap ">{item.trust_score}/10</td>
                                <td className="px-6 py-4 whitespace-nowrap xl:text-right">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(item.trade_volume_24h_btc_normalized)}</td>
                                <td className="px-6 py-4 whitespace-nowrap xl:text-right">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(item.trade_volume_24h_btc)}</td>
                                <td className="px-6 py-4 whitespace-nowrap xl:text-right">{item.year_established}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={`https://www.coingecko.com/exchanges/${item.exchangeNumber}/sparkline.svg`} className="w-32 h-10" alt="Sparkline" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="py-6">
                <Pagination currentPage={pagination} totalPages={exchangesAmount.pages} />
            </div>
        </div>
    );
}