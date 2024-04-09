'use client'

import { useState, useEffect, useMemo } from "react"
import { AlertDialog, Button, ScrollArea, TextField } from "@radix-ui/themes"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getTrendingCoins, getSearchCoins } from "@/utils/api/fetchFromServer";

interface CoinInterface {
    name: string;
    symbol: string;
    image: string;
}

export default function AddCoinButton() {

    const [coins, setCoins] = useState<CoinInterface[]>([]);
    const [searchedCoins, setSearchedCoins] = useState<any>([]);

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
                setSearchedCoins(fetchedSearchCoins);
            })();
        } else {
            setSearchedCoins([]);
        }
    }

    useEffect(() => {
        (async () => {
            const fetchedCoins = await getTrendingCoins();
            const filteredCoins: CoinInterface[] = fetchedCoins.map((item: any) => ({ name: item.item.name, image: item.item.small, symbol: item.item.symbol }));
            setCoins(filteredCoins);
        })();
    }, [])

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button color="grass">+ Add New Coin</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Search your favorite coin</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    <TextField.Root placeholder="Enter Coin Name" size={'3'}
                        onChange={(e) => searchDebounce(() => searchCoin(e.target.value))}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                    <ScrollArea type="always" scrollbars="vertical" style={{ height: 480 }}>
                        <div className="grid grid-rows-2 gap-2 pt-2">
                            {searchedCoins.length ? (
                                searchedCoins.map((coin:any) => (
                                    <button className="hover:bg-green-200 dark:hover:bg-slate-800">
                                        <div className="flex flex-row items-center gap-2">
                                            <img src={coin.thumb} className="rounded-full h-12 w-12" />
                                            <span>{coin.name}</span>
                                            <span>{`(${coin.symbol})`}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                coins.map((coin) => (
                                    <button className="hover:bg-green-200 dark:hover:bg-slate-800">
                                        <div className="flex flex-row items-center gap-2">
                                            <img src={coin.image} className="rounded-full h-12 w-12" />
                                            <span>{coin.name}</span>
                                            <span>{`(${coin.symbol})`}</span>
                                        </div>
                                    </button>
                                ))
                            )

                            }
                        </div>
                    </ScrollArea>
                </AlertDialog.Description>
                <div className="flex justify-center">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" size={'3'}>
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )

}