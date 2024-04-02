'use client'
import { useContext } from "react";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";
import { Progress } from "@radix-ui/themes";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";


interface PriceSection {
    image: string,
    name: string,
    symbol: string,
    market_cap_rank: number
    price: number,
    price_change: number,
    low_24h: number,
    high_24h: number,
    current_price_to_bitcoin: number
    price_change_24h_to_bitcoin: number,
}

export default function PriceSection(props: PriceSection) {

    const { selectedCurrency } = useContext(GlobalDataContext);
    const { image, name, symbol, market_cap_rank, price, price_change, low_24h, high_24h, current_price_to_bitcoin, price_change_24h_to_bitcoin } = props;



    return (
        <div className="pt-2 ">
            <div className="flex flex-row justify-evenly">
                <div className="flex items-center gap-1">
                    <img src={image} className="w-12 h-12 rounded-full" />
                    <span className="text-5xl text font-medium">{name}</span>
                    <span className="text-lg text-gray-500">{symbol} Price</span>
                    <span className="text-lg bg-gray-100 rounded-md px-1 dark:bg-slate-800">#{market_cap_rank}</span>
                </div>
                <div className="flex justify-center">
                    <span className="text-4xl font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(price)}</span>
                    <RenderPercentage number={price_change} _class="flex items-center font-bold text-lg" />
                </div>
            </div>
            <div className="flex">
                <span className="text-sm text-gray-500 pr-1">{current_price_to_bitcoin} BTC</span>
                <RenderPercentage number={price_change_24h_to_bitcoin} _class="flex items-center text-sm" />
            </div>
            <div>
                <Progress value={(Math.abs(high_24h - price) /Math.abs(price - low_24h))} />
                <div className="flex items-center justify-between text-sm font-medium">
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(low_24h)}</span>
                    <span>24h Range</span>
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(high_24h)}</span>
                </div>
            </div>
        </div>
    )


}