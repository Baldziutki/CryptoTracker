'use client'
import type React from "react";
import { createContext, useState, useEffect } from "react";
import { getSession } from "../api/fetchFromServer";

export const GlobalDataContext = createContext<{
    selectedCurrency: string;
    selectCurrency: (value: string) => void;
    theme: string;
    toggleTheme: () => void;
    loggedIn: boolean;
    setLoggedIn: (value: boolean | { (value: boolean): boolean }) => void;
}>(undefined as never);

export function GlobalDataContextProvider({ children }: { children: React.ReactNode }) {
    const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedCurrency = localStorage.getItem('currency');
            return storedCurrency || 'usd';
        }
        return 'usd';
    });

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
        return 'light';
    });

    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const selectCurrency = (currency: string) => {
        setSelectedCurrency(currency);
        if (typeof window !== 'undefined') {
            localStorage.setItem('currency', currency);
        }
    }

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

    useEffect(() => {
        (async () => {
            const authResponse = await getSession();
            if (!authResponse) {
                setLoggedIn(authResponse);
            } else {
                setLoggedIn(true);
            }
        })();
    }, [])

    return (
        <GlobalDataContext.Provider value={{ selectedCurrency, selectCurrency, theme, toggleTheme, loggedIn, setLoggedIn }}>
            {children}
        </GlobalDataContext.Provider>
    )
}
