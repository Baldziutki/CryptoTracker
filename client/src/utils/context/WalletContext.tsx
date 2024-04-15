'use client'
import React, { createContext, useEffect, useState } from "react";
import { getWalletCoins } from "../api/fetchFromServer";

interface WalletTransaction {
    coinId: string,
    coinName: string;
    coinAmount: number;
    coinAddDate: string;
    coinAddDateValue: number;
}

interface WalletContextType {
    walletTransactions: WalletTransaction[];
    setWalletTransactions: React.Dispatch<React.SetStateAction<WalletTransaction[]>>;
}

export const WalletContext = createContext<WalletContextType>(undefined as never);

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

    useEffect(() => {
        (async () => {
            const fetchedWalletTransactions = await getWalletCoins();
            console.log(fetchedWalletTransactions)
            setWalletTransactions(fetchedWalletTransactions);
        })();
    },[])

    return (
        <WalletContext.Provider value={{ walletTransactions, setWalletTransactions }}>
            {children}
        </WalletContext.Provider>
    );
}
