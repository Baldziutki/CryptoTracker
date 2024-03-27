'use client'

import { RenderPercentage } from "../renderPercentage/RenderPercentage"
import { ChevronRightIcon } from "@radix-ui/react-icons"

export default function TrendingCard({ coins, selectedCurrency }: { coins: any, selectedCurrency: string }) {

    return (
        <div className='flex flex-col border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800 w-4/12'>
            <div className='flex flex-row justify-between'>
                <span>🔥Trending</span>
                <button className='flex flex-row justify-center items-center'>
                    <span>View more</span>
                    <ChevronRightIcon width={16} height={16} />
                </button>
            </div>
            {coins.map((item: any) => (
                <button className='grid grid-flow-col py-2 items-center justify-between gap-2 dark:hover:bg-gray-800 hover:bg-slate-200' key={item.item.id}>
                    <span className='font-light'>#{item.item.market_cap_rank}</span>
                    <img src={item.item.thumb} style={{ width: '24px', height: '24px' }} />
                    <span className='font-medium'> {item.item.name}</span>
                    <span className='text-xs text-slate-400'>{item.item.symbol}</span>
                    <span className='tabular-nums'>${Number(item.item.data.price).toFixed(6)}</span>
                    <RenderPercentage number={item.item.data.price_change_percentage_24h[selectedCurrency]} _class='flex items-center' />
                </button>
            ))}
        </div>
    )
}
