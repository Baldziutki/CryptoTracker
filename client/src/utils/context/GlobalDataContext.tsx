'use client'
import type React from "react";
import { createContext, useState, useEffect } from "react";

export const GlobalDataContext = createContext<{
    selectedCurrency: string;
    selectCurrency: (value: string) => void;
    theme: string;
    toggleTheme: () => void;
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

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
        return 'light';
    });

    const toggleTheme = () => {
        setTheme((prevTheme) => prevTheme === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            localStorage.theme = theme;
        }
    }, [theme]);

    return (
        <GlobalDataContext.Provider value={{ selectedCurrency, selectCurrency, theme, toggleTheme }}>
            {children}
        </GlobalDataContext.Provider>
    )
}
