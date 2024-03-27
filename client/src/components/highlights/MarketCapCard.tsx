'use client'

import { RenderPercentage } from '../renderPercentage/RenderPercentage';

export default function MarketCapCard({ marketCap, percentage }: { marketCap: number, percentage: number }) {


    return (
        <div className='flex flex-row h-24 justify-between items-center gap-4 border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800'>
            <div className='flex flex-col'>
                <span className='font-extrabold'>${marketCap.toFixed()}</span>
                <div className='flex flex-row'>
                    <span>Market Cap </span>
                    <RenderPercentage number={percentage} _class='flex items-center' />
                </div>
            </div>
            <img src='https://www.coingecko.com/total_market_cap.svg' style={{ width: '157px', height: '58px' }} />
        </div>
    )
}