import { useState } from 'react';

export default function useCurrency() {
    const [currency, setCurrency] = useState<string>(() => {
        const storredCurrency = localStorage.getItem('currency');
        return storredCurrency || 'usd';
    });

    const selectCurrency = (currency: string) => {
        setCurrency(currency);
        localStorage.setItem('currency', currency);
    }

    return [currency, selectCurrency] as const;
}