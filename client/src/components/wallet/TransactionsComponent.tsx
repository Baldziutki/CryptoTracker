'use client'

import { deleteCoinFromWallet } from "@/utils/api/fetchFromServer";
import { WalletContext } from "@/utils/context/WalletContext";
import { AlertDialog, Button } from "@radix-ui/themes"
import { Edit, TrashCan } from "akar-icons";
import { useContext, useEffect, useState } from "react";

interface TransactionType {
    transactionId: string,
    coinId: string,
    coinName: string,
    coinAmount: number,
    coinAddDate: string,
    coinAddDateValue: number,
}

export default function TransactionComponent({ isOpen, setIsOpen, coinId, setIsEdit, setTransactionIdToEdit }: {
    isOpen: boolean, setIsOpen: (value: boolean | { (value: boolean): boolean }) => void, coinId: string,
    setIsEdit: (value: boolean | { (value: boolean): boolean }) => void, setTransactionIdToEdit: (value: string | { (value: string): string }) => void
}) {

    const { walletTransactions, setWalletTransactions } = useContext(WalletContext);

    const [coinName, setCoinName] = useState<string>("");

    const handleDeleteTransactionButton = async (transactionId: string) => {
        await deleteCoinFromWallet(transactionId);
        const transactionsAfterDelete = walletTransactions.filter((transaction: TransactionType) => transaction.transactionId !== transactionId);
        setWalletTransactions(transactionsAfterDelete);
    }

    const handleEditTransactionButton = async (transactionId: string) => {
        setTransactionIdToEdit(transactionId);
        setIsEdit(true);
        setIsOpen(false);
    }

    useEffect(() => {
        const transaction = walletTransactions.find((transaction: TransactionType) => transaction.coinId === coinId);
        if (transaction) {
            setCoinName(transaction.coinName);
        }
    }, [walletTransactions, coinId]);

    return (
        <AlertDialog.Root open={isOpen}>
            <AlertDialog.Content maxWidth="650px">
                <AlertDialog.Title>Your transaction data about {coinName}</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    <div className="grid pb-4 text-right gap-y-2 text-base" style={{ gridTemplateColumns: 'auto auto auto auto auto auto' }}>
                        <span className="text-left pl-2">Type</span>
                        <span className="text-left pl-2">Price</span>
                        <span>Quantity</span>
                        <span>Date</span>
                        <span>Cost</span>
                        <span>Actions</span>
                        {walletTransactions.map((transaction: TransactionType, index: number) => {
                            if (coinId === transaction.coinId) {
                                return (
                                    <div key={transaction.coinId + index} className="grid grid-cols-subgrid col-start-1 col-end-[-1] min-w-full dark:bg-slate-800 shadow-md h-8 rounded items-center">
                                        {transaction.coinAmount > 0 ? (<span className="text-green-400 text-left pl-2">Buy</span>) : (<span className="text-red-500 text-left pl-2">Sell</span>)}
                                        <span className="text-left pl-2">{transaction.coinAddDateValue}$</span>
                                        {transaction.coinAmount > 0 ? (<span className="text-green-400">+{transaction.coinAmount}</span>) : (<span className="text-red-500">{transaction.coinAmount}</span>)}
                                        <span>{transaction.coinAddDate}</span>
                                        <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'usd' }).format(transaction.coinAddDateValue * transaction.coinAmount)}</span>
                                        <div className="flex justify-end pr-1">
                                            <button onClick={() => handleEditTransactionButton(transaction.transactionId)}><Edit strokeWidth={2} size={20} className="hover:fill-orange-400" /></button>
                                            <button onClick={() => handleDeleteTransactionButton(transaction.transactionId)}><TrashCan strokeWidth={2} size={20} className="hover:fill-red-400" /></button>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </AlertDialog.Description>
                <AlertDialog.Cancel>
                    <div className="flex justify-center">
                        <Button variant="soft" color="gray" onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </AlertDialog.Cancel>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}