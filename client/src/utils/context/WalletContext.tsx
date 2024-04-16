'use client'
import React, { createContext, useEffect, useState } from "react";
import { getFavoriteCoins, getWalletCoins } from "../api/fetchFromServer";
import { getGivenCoinsMarketData } from "../api/fetchFromCoinGecko";

interface WalletTransaction {
    transactionId: string,
    coinId: string,
    coinName: string;
    coinAmount: number;
    coinAddDate: string;
    coinAddDateValue: number;
}

interface WalletContextType {
    walletTransactions: WalletTransaction[];
    setWalletTransactions: React.Dispatch<React.SetStateAction<WalletTransaction[]>>;
    portfolioCoins: PortfolioCoinsType[];
    favoriteCoins: any;
    setFavoriteCoins: React.Dispatch<React.SetStateAction<any>>;
}

interface PortfolioCoinsType {
    id: string,
    name: string,
    symbol: string,
    image: string,
    price: number,
    market_cap_rank: number,
    market_cap_value: number,
    total_volume: number,
    price_change_percentage_1h_in_currency: number,
    price_change_percentage_24h_in_currency: number,
    price_change_percentage_7d_in_currency: number,
    coinNumber: number,
}

interface FavoriteCoinType {
    id: string,
    name: string,
    symbol: string,
    image: string,
    price: number,
    market_cap_rank: number,
    market_cap_value: number,
    total_volume: number,
    price_change_percentage_1h_in_currency: number,
    price_change_percentage_24h_in_currency: number,
    price_change_percentage_7d_in_currency: number,
    coinNumber: number,
}

export const WalletContext = createContext<WalletContextType>(undefined as never);

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
    const [favoriteCoins, setFavoriteCoins] = useState<any>();
    const [portfolioCoins, setPortfolioCoins] = useState<PortfolioCoinsType[]>([]);

    const extractImageNumber = (imageString: string) => {
        const regex = /\/images\/(\d+)\/large\//;
        const match = imageString.match(regex);
        if (match && match[1]) {
            return parseInt(match[1]);
        } else {
            return 36501; //number of empty svg
        }
    }

    useEffect(() => {
        (async () => {
            const fetchedWalletTransactions = await getWalletCoins();
            setWalletTransactions(fetchedWalletTransactions);
            const fetchedFavoriteCoinsFromServer = await getFavoriteCoins();
            const fetchedPortfolioCoinsFromServer = await getWalletCoins();

            const portfolioCoinsId = fetchedPortfolioCoinsFromServer.map((item: any) => { return item.coinId });
            const favoriteCoinsId = fetchedFavoriteCoinsFromServer.map((item: any) => { return item.coinId });

            const favoriteCoinsIdString = favoriteCoinsId.toString();
            const portfolioCoinsIdString = portfolioCoinsId.toString();

            const coinsToFetch = favoriteCoinsIdString.concat(',', portfolioCoinsIdString);
            if (coinsToFetch !== ',') {
                const fetchedWalletCoins = await getGivenCoinsMarketData('usd', coinsToFetch);
                const filteredWalletCoins = fetchedWalletCoins.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    symbol: item.symbol,
                    image: item.image,
                    price: item.current_price,
                    market_cap_rank: item.market_cap_rank,
                    market_cap_value: item.market_cap,
                    total_volume: item.total_volume,
                    price_change_percentage_1h_in_currency: item.price_change_percentage_1h_in_currency,
                    price_change_percentage_24h_in_currency: item.price_change_percentage_24h_in_currency,
                    price_change_percentage_7d_in_currency: item.price_change_percentage_7d_in_currency,
                    coinNumber: extractImageNumber(item.image),
                }));
                const favoriteCoins = filteredWalletCoins.filter((item: any) => favoriteCoinsId.includes(item.id));
                const portfolioCoins = filteredWalletCoins.filter((item: any) => portfolioCoinsId.includes(item.id));
                const portfolioCoinsArray = Object.values(portfolioCoins);
                let currentBalance = 0;
                let previousBalance = 0;
                let totalProfitLoss = 0;
                fetchedPortfolioCoinsFromServer.forEach((item: any) => {
                    const data = filteredWalletCoins.find((coin: any) => coin.id === item.coinId)

                    if (data) {
                        const coinValue = data.price * item.coinAmount;
                        const coinValueBefore24h = data.price * item.coinAmount * ((100 - data.price_change_percentage_24h_in_currency) / 100);
                        const profitLossValue = item.coinAddDateValue * item.coinAmount;
                        currentBalance += coinValue;
                        previousBalance += coinValueBefore24h;
                        totalProfitLoss += profitLossValue;
                    }
                });
                setFavoriteCoins(favoriteCoins);
                setPortfolioCoins(portfolioCoinsArray);
            }

        })();
    }, [])

    return (
        <WalletContext.Provider value={{ walletTransactions, setWalletTransactions, favoriteCoins, setFavoriteCoins, portfolioCoins,  }}>
            {children}
        </WalletContext.Provider>
    );
}
