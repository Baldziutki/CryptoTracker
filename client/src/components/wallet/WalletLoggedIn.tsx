'use client'

import { SegmentedControl } from "@radix-ui/themes"
import AddCoinButton from "./AddCoinButton"
import WalletOverview from "./WalletOverview"
import { useEffect, useState } from "react"
import { getFavoriteCoins, getWalletCoins } from "@/utils/api/fetchFromServer"
import { getGivenCoinsMarketData } from "@/utils/api/fetchFromCoinGecko"
import FavoritesCoins from "./FavoritesCoins"


export default function WalletLoggedIn() {

    const [selectedPortfolio, setSelectedPortfolio] = useState<boolean>(true);
    const [favoriteCoins, setFavoriteCoins] = useState<any>();
    const [portfolioCoins, setPortfolioCoins] = useState<any>();
    const [portfolioBalance, setPortfolioBalance] = useState<number>(0.00);
    const [portfolioChange, setPortfolioChange] = useState<{ amount: number, percentage: number }>({ amount: 0.00, percentage: 0.00 });
    const [portfolioProfit, setPortfolioProfit] = useState<{ amount: number, percentage: number }>({ amount: 0.00, percentage: 0.00 });

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
                let currentBalance = 0;
                let previousBalance = 0;
                let totalProfitLoss = 0;
                console.log(fetchedPortfolioCoinsFromServer)
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
                setPortfolioBalance(currentBalance);
                setPortfolioChange({ amount: (currentBalance - previousBalance), percentage: ((currentBalance / previousBalance) - 1) * 100 });
                setPortfolioProfit({ amount: (currentBalance - totalProfitLoss), percentage: ((currentBalance / totalProfitLoss) - 1) * 100 });
                setFavoriteCoins(favoriteCoins);
                setPortfolioCoins(portfolioCoins);
            }

        })();
    }, [])

    return (
        <div>
            <div className="flex flex-row justify-between pt-2">
                <WalletOverview 
                balance={portfolioBalance} 
                portfolioChangeAmount={portfolioChange.amount} portfolioChangePercentage={portfolioChange.percentage} 
                totalProfitAmount={portfolioProfit.amount} totalProfitPercentage={portfolioProfit.percentage}/>
                <SegmentedControl.Root defaultValue="portfolio" size={'3'}>
                    <SegmentedControl.Item value="portfolio" onClick={() => setSelectedPortfolio(true)}>Portfolio</SegmentedControl.Item>
                    <SegmentedControl.Item value="favorites" onClick={() => setSelectedPortfolio(false)}>Favorites</SegmentedControl.Item>
                </SegmentedControl.Root>
            </div>
            {selectedPortfolio ? null : <FavoritesCoins coins={favoriteCoins} setCoins={setFavoriteCoins} />}
        </div>
    )

}