'use client'

import { FormatNumber } from "../numberFormaters/NumberFormaters";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";

interface WalletOverviewProps {
    balance: number,
    portfolioChangeAmount: number,
    portfolioChangePercentage: number,
    totalProfitAmount: number,
    totalProfitPercentage: number
}

export default function WalletOverview({ balance, portfolioChangeAmount, portfolioChangePercentage, totalProfitAmount, totalProfitPercentage }: WalletOverviewProps) {

    return (
        <div className="flex flex-row gap-2 max-md:flex-col max-md:pb-4">
            <div className="flex flex-col shadow-xl dark:bg-slate-800 p-6 rounded-md">
                <FormatNumber number={balance} currency={'usd'} />
                <span>Total Balance</span>
            </div>
            <div className="flex flex-col shadow-xl dark:bg-slate-800 p-6 rounded-md">
                <span className={portfolioChangeAmount < 0 ? 'text-red-400' : 'text-green-500'}><FormatNumber number={portfolioChangeAmount} currency={'usd'} /></span>
                <div className="flex">
                    <span>24h Portfolio Change </span>
                    <RenderPercentage number={portfolioChangePercentage} _class="flex items-center justify-end" />
                </div>
            </div>
            <div className="flex flex-col shadow-xl dark:bg-slate-800 p-6 rounded-md">
                <span className={totalProfitAmount < 0 ? 'text-red-400' : 'text-green-500'}><FormatNumber number={totalProfitAmount} currency='usd'/></span>
                <div className="flex">
                    <span>Total Profit / Loss</span>
                    <RenderPercentage number={totalProfitPercentage} _class="flex items-center justify-end" />
                </div>
            </div>
        </div>
    )
}