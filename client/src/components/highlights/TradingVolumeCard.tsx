'use client'

export default function TradingVolumeCard({dailyVolume}:{dailyVolume: number}) {

    return (
        <div className='flex flex-row h-24 justify-between items-center gap-4 border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800'>
            <div className='flex flex-col'>
                <span className='font-extrabold'>${dailyVolume.toFixed()}</span>
                <span>24h Trading Volume</span>
            </div>
            <img src='https://www.coingecko.com/total_volume.svg' style={{ width: '157px', height: '58px' }} />
        </div>
    )
}
