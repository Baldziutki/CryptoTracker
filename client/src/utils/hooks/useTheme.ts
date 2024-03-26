'use client'

import {useState, useEffect} from 'react';

export default function useTheme() {
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
            if(theme === 'dark'){
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            localStorage.theme = theme;
        }
    }, [theme]);
    
    return [theme, toggleTheme] as const;
}