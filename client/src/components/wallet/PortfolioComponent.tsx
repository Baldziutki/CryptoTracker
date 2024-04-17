'use client'

import { WalletContext } from "@/utils/context/WalletContext"
import { useContext, useEffect, useState } from "react"
import { Card } from "@radix-ui/themes";
import { FormatNumber } from "../numberFormaters/NumberFormaters";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";
import TransactionComponent from "./TransactionsComponent";
import EditTransaction from "./EditTransaction";

interface PortfolioComponentProps {
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

interface TransactionData {
    transactionId: string,
    coinId: string,
    coinName: string,
    coinAmount: number,
    coinAddDate: string,
    coinAddDateValue: number,
}

export default function PortfolioComponent({ portfolioCoins }: { portfolioCoins: PortfolioComponentProps[] }) {

    const { walletTransactions } = useContext(WalletContext);
    const coinsBalance = walletTransactions.reduce((sum, item: TransactionData) => {
        const key = `${item.coinId}`;
        sum[key] = (sum[key] || 0) + item.coinAmount;
        return sum;
    }, {} as Record<string, number>);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [coinIdToTransaction, setCoinIdToTransaction] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [transactionIdToEdit, setTransactionIdToEdit] = useState<string>('');

    const coinTransactionsHandler = (coinId: string) => {
        setCoinIdToTransaction(coinId);
        setIsOpen(true);
    }

    return (
        <>
            <div className="pt-6 grid grid-cols-3 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1">
                {portfolioCoins.length > 0 && portfolioCoins.map((item: PortfolioComponentProps, index: number) => {
                    const coinBalance = coinsBalance[item.id] || 0;
                    return (
                        <button onClick={() => coinTransactionsHandler(item.id)} key={item.id + index}>
                            <Card>
                                <div className="flex justify-between">
                                    <div className="flex gap-2">
                                        <img src={item.image} className="w-16 h-16 rounded-full" />
                                        <div className="flex flex-col">
                                            <span className="uppercase text-lg font-medium">{item.symbol}</span>
                                            <div className="flex flex-row">
                                                <span className="dark:text-slate-400"><FormatNumber currency="usd" number={item.price} /></span>
                                                <RenderPercentage number={item.price_change_percentage_24h_in_currency} _class="flex justify-center items-center" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-end text-lg font-medium">{coinBalance}</span>
                                        <span className="dark:text-slate-400 text-end"><FormatNumber currency="usd" number={item.price * coinBalance} /></span>
                                    </div>
                                </div>
                            </Card>
                        </button>
                    )
                })}
            </div>
            {isOpen ? <TransactionComponent isOpen={isOpen} setIsOpen={setIsOpen} coinId={coinIdToTransaction} setIsEdit={setIsEdit} setTransactionIdToEdit={setTransactionIdToEdit} /> : null}
            {isEdit ? <EditTransaction isOpen={isEdit} onClose={setIsEdit} transactionId={transactionIdToEdit} /> : null}
        </>
    )
}