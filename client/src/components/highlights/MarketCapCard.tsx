'use client'

import { useContext } from 'react';
import { RenderPercentage } from '../renderPercentage/RenderPercentage';
import { GlobalDataContext } from '@/utils/context/GlobalDataContext';

export default function MarketCapCard({ marketCap, percentage }: { marketCap: number, percentage: number }) {

    const {selectedCurrency} = useContext(GlobalDataContext);

    return (
        <div className='grid grid-flow-col h-24 justify-between items-center border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800'>
            <div className='grid grid-flow-row'>
                <span className='font-extrabold'>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(marketCap)}</span>
                <div className='flex flex-row'>
                    <span>Market Cap </span>
                    <RenderPercentage number={percentage} _class='flex items-center' />
                </div>
            </div>
            <img src='https://www.coingecko.com/total_market_cap.svg' style={{ width: '180px', height: '60px' }} />
        </div>
    )
}