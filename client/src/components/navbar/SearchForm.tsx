'use client'
import { useState, useEffect, useContext, useMemo } from 'react';
import { TextField, ScrollArea, DropdownMenu } from '@radix-ui/themes'
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { getSearchCoins, getTrendingCoins } from '@/utils/api/fetchFromServer';
import { GlobalDataContext } from '@/utils/context/GlobalDataContext';

interface SearchFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean | { (value: boolean): boolean }) => void;
}

export default function SearchForm({ isOpen, setIsOpen }: SearchFormProps) {

    const [coins, setCoins] = useState<any>([]);
    const [selectedCoin, setSelectedCoin] = useState<any>({});
    const [searchedCoins, setSearchedCoins] = useState<any>([]);
    const { selectedCurrency } = useContext(GlobalDataContext);

    const RenderPercentage = ({ number, _class }: { number: number, _class: string }) => {
        if (number < 0) {
            return (
                <div className={_class}>
                    <ChevronDownIcon color='red' />
                    <span className='text-red-500'>{number?.toFixed(2)}%</span>
                </div>
            )
        } else {
            return (
                <div className={_class}>
                    <ChevronUpIcon color='green' />
                    <span className='text-green-500'>{number?.toFixed(2)}%</span>
                </div>
            )
        }
    };

    const extractPrice = (priceString: string) => {
        const match = priceString?.match(/<sub title="([^"]*)">/);
        if (match && match.length > 1) {
            const titleContent = match[1];
            return `$${titleContent}`;
        } else {
            return `$${priceString}`
        }
    }

    const debounce = (delay: number) => {
        let timerId: number;
        return function (fn: Function) {
            clearTimeout(timerId);
            timerId = setTimeout(fn, delay)
        }
    };

    const searchDebounce = useMemo(() => debounce(500), []);
    const closeDebounce = useMemo(() => debounce(100), []);

    const searchCoin = (input: string) => {
        if (input !== '') {
            (async () => {
                const fetchedSearchCoins = await getSearchCoins(input);
                setSearchedCoins(fetchedSearchCoins);
                setSelectedCoin(fetchedSearchCoins[0])
            })();
        } else {
            setSelectedCoin(coins[0].item);
            setSearchedCoins([]);
        }
    }


    useEffect(() => {
        (async () => {
            const fetchedTrendingData = await getTrendingCoins();
            setCoins(fetchedTrendingData);
            setSelectedCoin(fetchedTrendingData[0].item);
        })();
    }, [])

    return (
        <div className='relative flex flex-col'>
            <div className='dark:bg-slate-800 bg-white absolute right-0 rounded drop-shadow-lg' style={{ zIndex: 999, height: 440, width: 450 }}>
                <DropdownMenu.Root>
                    <TextField.Root
                        placeholder="Search" variant="soft" color="gray" radius="large"
                        onChange={(e) => searchDebounce(() => searchCoin(e.target.value))}
                        onBlur={() => closeDebounce(() => setIsOpen(false))}
                        autoFocus={isOpen}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                    <ScrollArea type="always" scrollbars="vertical" style={{ height: 280 }}>
                        <div className='grid' style={{ gridTemplateColumns: 'auto auto auto auto auto auto' }}>
                            {searchedCoins.length ? (
                                searchedCoins.map((item: any) => (
                                    <a className='grid grid-cols-subgrid col-start-1 col-end-[-1] px-4 py-2 items-center gap-1 dark:hover:bg-gray-700 hover:bg-slate-200' href={`/coins/${item.id}`} key={item.id} onMouseOver={() => { setSelectedCoin(item) }}>
                                        <img src={item.thumb} style={{ width: '24px', height: '24px' }} className='rounded-full' />
                                        <span className='font-medium'> {item.name}</span>
                                        <span className='text-xs text-slate-400'>{item.symbol}</span>
                                        <RenderPercentage number={item.data.price_change_percentage_24h[selectedCurrency]} _class='flex items-center' />
                                        <div className='grow' />
                                        <img src={item.data.sparkline} width={100} height={100} />
                                    </a>
                                ))
                            ) : (
                                coins.map((item: any) => (
                                    <a className='grid grid-cols-subgrid col-start-1 col-end-[-1] px-4 py-2 items-center gap-1 dark:hover:bg-gray-700 hover:bg-slate-200' href={`/coins/${item.item.id}`} key={item.item.id} onMouseOver={() => { setSelectedCoin(item.item) }}>
                                        <img src={item.item.thumb} style={{ width: '24px', height: '24px' }} className='rounded-full' />
                                        <span className='font-medium'> {item.item.name}</span>
                                        <span className='text-xs text-slate-400'>{item.item.symbol}</span>
                                        <RenderPercentage number={item.item.data.price_change_percentage_24h[selectedCurrency]} _class='flex items-center' />
                                        <div className='grow' />
                                        <img src={item.item.data.sparkline} width={100} height={100} />
                                    </a>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                    {selectedCoin ? (
                        <>
                            <div className='flex flex-row border-b justify-between px-2 dark:border-gray-600'>
                                <span className='font-medium'>Name:</span>
                                <span className=''>{selectedCoin.name}</span>
                            </div>
                            <div className='flex flex-row border-b justify-between px-2 dark:border-gray-600'>
                                <span className='font-medium'>Rank: </span>
                                <span>{selectedCoin.market_cap_rank}</span>
                            </div>
                            <div className='flex flex-row border-b justify-between px-2 dark:border-gray-600'>
                                <span className='font-medium'>Price: </span>
                                <span>{extractPrice(selectedCoin.data?.price)}</span>
                            </div>

                            <div className='flex flex-row border-b items-center justify-between px-2 dark:border-gray-600'>
                                <span className='font-medium'>24h%: </span>
                                <RenderPercentage number={selectedCoin.data?.price_change_percentage_24h[selectedCurrency]} _class='flex items-center' />
                            </div>
                            <div className='flex flex-row justify-between px-2 dark:border-gray-600'>
                                <span className='font-medium'>24h trading volume: </span>
                                <span>{selectedCoin.data?.total_volume}</span>
                            </div>
                        </>
                    ) : (<p className='font-semibold text-center pt-12'>Your search didn't match any records</p>)}
                </DropdownMenu.Root>
            </div>
        </div>
    )
}
