'use client'
import { useContext, useEffect, useState } from "react";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";
import { Progress } from "@radix-ui/themes";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { Star } from "akar-icons";
import { addFavoriteCoin, deleteFavoriteCoin, getFavoriteCoins } from "@/utils/api/fetchFromServer";
import { useRouter } from "next/navigation";

interface PriceSection {
    image: string,
    id: string,
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

    const { selectedCurrency, loggedIn } = useContext(GlobalDataContext);
    const { image, id, name, symbol, market_cap_rank, price, price_change, low_24h, high_24h, current_price_to_bitcoin, price_change_24h_to_bitcoin } = props;
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const router = useRouter();

    const calculateRatio = (price: number) => {
        const ratio = (Math.abs(price - low_24h) / Math.abs(high_24h - price));
        if (ratio <= 1) {
            return ratio * 100;
        } else {
            return (Math.abs(high_24h - price) / Math.abs(price - low_24h)) * 100;
        }
    }

    const handleFavoriteButton = async (coinName: string, coinId: string) => {
        if (loggedIn) {
            if (isFavorite) {
                setIsFavorite(false);
                await deleteFavoriteCoin(coinId);

            } else {
                setIsFavorite(true);
                await addFavoriteCoin(coinId, coinName);
            }
        }else{
            router.replace('/wallet')
        }
    };

    useEffect(() => {
        (async () => {
            if (loggedIn) {
                const fetchedFavoriteCoins = await getFavoriteCoins();
                const favorite = fetchedFavoriteCoins.find((item: any) => item.coinName === name);
                if (favorite) {
                    setIsFavorite(true);
                }
            }
        })();
    }, [loggedIn, name])

    return (
        <div className="pt-2 ">
            <div className="flex flex-row justify-evenly max-md:flex-col">
                <div className="flex max-md:flex-col">
                    <div className="flex items-center gap-1 max-[350px]:flex-col">
                        <img src={image} className="w-12 h-12 rounded-full" />
                        <span className="text-5xl text font-medium">{name}</span>
                        <span className="text-lg text-gray-500 uppercase">{symbol}</span>
                        <span className="text-lg text-gray-500">Price</span>
                        <span className="text-lg bg-gray-100 rounded-md px-1 dark:bg-slate-800">#{market_cap_rank}</span>
                        <button onClick={() => handleFavoriteButton(name, id)}><Star strokeWidth={1} size={20} className={isFavorite ? 'fill-orange-400' : ''} /></button>
                    </div>
                </div>
                <div className="flex justify-center max-md:flex-col items-center">
                    <span className="text-4xl font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(price)}</span>
                    <RenderPercentage number={price_change} _class="flex items-center font-bold text-lg" />
                </div>
            </div>
            <div className="flex">
                <span className="text-sm text-gray-500 pr-1">{current_price_to_bitcoin} BTC</span>
                <RenderPercentage number={price_change_24h_to_bitcoin} _class="flex items-center text-sm" />
            </div>
            <div>
                {high_24h ? <Progress value={calculateRatio(price)} /> : <Progress value={0} />}
                <div className="flex items-center justify-between text-sm font-medium">
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(low_24h)}</span>
                    <span>24h Range</span>
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(high_24h)}</span>
                </div>
            </div>
        </div>
    )


}