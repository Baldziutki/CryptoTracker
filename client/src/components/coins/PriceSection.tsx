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

    const {selectedCurrency} = useContext(GlobalDataContext);
    const { image, name, symbol, market_cap_rank, price, price_change, low_24h, high_24h, current_price_to_bitcoin, price_change_24h_to_bitcoin } = props;



    return (
        <div className="max-w-96">
            <div className="flex flex-row gap-1 items-center">
                <img src={image} className="w-6 h-6" />
                <span className="text-xl text font-medium">{name}</span>
                <span className="text-sm text-gray-500">{symbol} Price</span>
                <span className="text-sm bg-gray-100 rounded-md px-1 dark:bg-slate-800">#{market_cap_rank}</span>
            </div>
            <div className="flex">
                <span className="text-3xl font-bold">{price} {selectedCurrency.toUpperCase()}</span>
                <RenderPercentage number={price_change} _class="flex items-center font-bold text-lg" />
            </div>
            <div className="flex">
                <span className="text-sm text-gray-500 pr-1">{current_price_to_bitcoin} BTC</span>
                <RenderPercentage number={price_change_24h_to_bitcoin} _class="flex items-center text-sm" />
            </div>
            <div>
                <Progress value={((high_24h - price) / (price - low_24h)) * 100} />
                <div className="flex items-center justify-between text-sm font-medium">
                    <span>{low_24h} {selectedCurrency.toUpperCase()}</span>
                    <span>24h Range</span>
                    <span>{high_24h} {selectedCurrency.toUpperCase()}</span>
                </div>
            </div>
        </div>
    )


}