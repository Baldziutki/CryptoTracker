'use client'

import { RenderPercentage } from "../renderPercentage/RenderPercentage"
import { ChevronRightIcon } from "@radix-ui/react-icons"

export default function TrendingCard({ coins, selectedCurrency }: { coins: any, selectedCurrency: string }) {

    return (
        <div className='border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800'>
            <div className='grid grid-flow-col justify-between items-center'>
                <span>🔥Trending</span>
                <button className='flex flex-row justify-center items-center'>
                    <span>View more</span>
                    <ChevronRightIcon width={16} height={16} />
                </button>
            </div>
            <div className="grid" style={{gridTemplateColumns:'auto auto auto auto auto'}}>
                {coins.map((item: any) => (
                    <button className='grid grid-cols-subgrid col-start-1 col-end-[-1] py-2 items-center min-w-full gap-2 dark:hover:bg-gray-800 hover:bg-slate-200' key={item.item.id}>
                        <span className='font-ligh text-left'>#{item.item.market_cap_rank}</span>
                        <img src={item.item.thumb} className=' rounded-full' style={{ width: '24px', height: '24px', }} />
                        <div className="grid grid-flow-row" >
                            <span className='font-medium text-left'>{item.item.name}</span>
                            <span className='text-xs text-slate-400 text-left'>{item.item.symbol}</span>
                        </div>
                        <span className=' text-right'>${Number(item.item.data.price).toFixed(6)}</span>
                        <RenderPercentage number={item.item.data.price_change_percentage_24h[selectedCurrency]} _class='flex items-center justify-end' />
                    </button>
                ))}
            </div>
        </div>
    )

}
