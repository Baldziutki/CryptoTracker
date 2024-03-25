'use client'
import type React from "react";
import { createContext, useState } from "react";

export const GlobalDataContext = createContext<{
    selectedCurrency: string;
    selectCurrency: (value: string) => void;
}>(undefined as never);

export function GlobalDataContextProvider({ children }: { children: React.ReactNode }) {
    const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedCurrency = localStorage.getItem('currency');
            return storedCurrency || 'usd';
        }
        return 'usd';
    });
    
    const selectCurrency = (currency: string) => {
        setSelectedCurrency(currency);
        if (typeof window !== 'undefined') {
            localStorage.setItem('currency', currency);
        }
    }

    return (
        <GlobalDataContext.Provider value={{ selectedCurrency, selectCurrency }}>
            {children}
        </GlobalDataContext.Provider>
    )
}
