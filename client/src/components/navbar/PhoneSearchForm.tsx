'use client'

import { getSearchCoins, getTrendingCoins } from "@/utils/api/fetchFromServer";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { ChevronUpIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { AlertDialog, Button, ChevronDownIcon, ScrollArea, TextField } from "@radix-ui/themes"
import { useState, useContext, useMemo, useEffect } from "react";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";

export default function PhoneSearchForm() {

    const [coins, setCoins] = useState<any>([]);
    const [selectedCoin, setSelectedCoin] = useState<any>({});
    const [searchedCoins, setSearchedCoins] = useState<any>([]);
    const { selectedCurrency } = useContext(GlobalDataContext);

    const extractPrice = (priceString: string) => {
        console.log(priceString)
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

    const searchDebounce = useMemo(() => debounce(500), [])

    const searchCoin = (input: string) => {
        if (input !== '') {
            (async () => {
                const fetchedSearchCoins = await getSearchCoins(input);
                console.log(fetchedSearchCoins);
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
        <AlertDialog.Root>
            <AlertDialog.Trigger style={{ padding: '2' }}>
                <Button
                    variant="soft" color="gray" radius="large"
                    style={{ width: '82%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <MagnifyingGlassIcon height="16" width="16" />
                    <span>Search</span>
                </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="82%">
                <AlertDialog.Description size="2">
                    <div className='dark:bg-slate-800 bg-white'>
                        <div className="flex justify-between">
                            <AlertDialog.Cancel>
                                <Button variant="soft" color="gray">
                                    X
                                </Button>
                            </AlertDialog.Cancel>
                            <TextField.Root
                                placeholder="Search" variant="soft" color="gray" radius="large"
                                onChange={(e) => searchDebounce(() => searchCoin(e.target.value))}
                                style={{ width: '82%' }}>
                                <TextField.Slot>
                                    <MagnifyingGlassIcon height="16" width="16" />
                                </TextField.Slot>
                            </TextField.Root>
                        </div>
                        <ScrollArea type="always" scrollbars="vertical" style={{ height: 280 }}>
                            <div className='grid' style={{ gridTemplateColumns: 'auto auto auto auto auto auto' }}>
                                {searchedCoins.length ? (
                                    searchedCoins.map((item: any) => (
                                        <a className='grid grid-cols-subgrid col-start-1 col-end-[-1] px-4 py-2 gap-1 dark:hover:bg-gray-700 hover:bg-slate-200' href={`/coins/${item.id}`} key={item.id} onMouseOver={() => { setSelectedCoin(item) }}>
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
                                        <a className='grid grid-cols-subgrid col-start-1 col-end-[-1] px-4 py-2  gap-1 dark:hover:bg-gray-700 hover:bg-slate-200' href={`/coins/${item.item.id}`} key={item.item.id} onMouseOver={() => { setSelectedCoin(item.item) }}>
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
                    </div>
                </AlertDialog.Description>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}