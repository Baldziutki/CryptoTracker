'use client'

import { SegmentedControl } from "@radix-ui/themes"
import AddCoinButton from "./AddCoinButton"
import WalletOverview from "./WalletOverview"
import { useContext, useEffect, useState } from "react"
import { getFavoriteCoins, getWalletCoins } from "@/utils/api/fetchFromServer"
import { getGivenCoinsMarketData } from "@/utils/api/fetchFromCoinGecko"
import FavoritesCoins from "./FavoritesCoins"
import PortfolioComponent from "./PortfolioComponent"
import { WalletContext } from "@/utils/context/WalletContext"

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

export default function WalletLoggedIn() {

    const [selectedPortfolio, setSelectedPortfolio] = useState<boolean>(true);
    const [portfolioBalance, setPortfolioBalance] = useState<number>(0.00);
    const [portfolioChange, setPortfolioChange] = useState<{ amount: number, percentage: number }>({ amount: 0.00, percentage: 0.00 });
    const [portfolioProfit, setPortfolioProfit] = useState<{ amount: number, percentage: number }>({ amount: 0.00, percentage: 0.00 });
    const { walletTransactions, portfolioCoins, favoriteCoins, setFavoriteCoins } = useContext(WalletContext);

    useEffect(() => {
        let currentBalance = 0;
        let previousBalance = 0;
        let totalProfitLoss = 0;
        walletTransactions.forEach((item: any) => {

            const data = portfolioCoins.find((coin: any) => coin.id === item.coinId)

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
    }, [portfolioCoins])

    return (
        <div>
            <div className="flex flex-row justify-between pt-2 max-md:flex-col">
                <WalletOverview
                    balance={portfolioBalance}
                    portfolioChangeAmount={portfolioChange.amount} portfolioChangePercentage={portfolioChange.percentage}
                    totalProfitAmount={portfolioProfit.amount} totalProfitPercentage={portfolioProfit.percentage} />
                <SegmentedControl.Root defaultValue="portfolio" size={'3'}>
                    <SegmentedControl.Item value="portfolio" onClick={() => setSelectedPortfolio(true)}>Portfolio</SegmentedControl.Item>
                    <SegmentedControl.Item value="favorites" onClick={() => setSelectedPortfolio(false)}>Favorites</SegmentedControl.Item>
                </SegmentedControl.Root>
            </div>
            {selectedPortfolio ? <PortfolioComponent portfolioCoins={portfolioCoins} /> : <FavoritesCoins coins={favoriteCoins} setCoins={setFavoriteCoins} />}
        </div>
    )

}