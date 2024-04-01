'use client'

import { GlobalDataContext } from "@/utils/context/GlobalDataContext"
import { useContext } from "react"

export default function TradingVolumeCard({dailyVolume}:{dailyVolume: number}) {

    const {selectedCurrency} = useContext(GlobalDataContext);

    return (
        <div className='grid grid-flow-col h-24 justify-between items-center border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800'>
            <div className='grid grid-flow-row'>
                <span className='font-extrabold'>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(dailyVolume)}</span>
                <span>24h Trading Volume</span>
            </div>
            <img src='https://www.coingecko.com/total_volume.svg' style={{ width: '180px', height: '60px' }} />
        </div>
    )
}
