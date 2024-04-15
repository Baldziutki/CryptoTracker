'use client'

import { useState, useEffect, useMemo } from "react"
import { AlertDialog, Button, ScrollArea, TextField } from "@radix-ui/themes"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getTrendingCoins, getSearchCoins } from "@/utils/api/fetchFromServer";
import AddCoinTransaction from "./AddCoinTransaction";

interface CoinInterface {
    name: string;
    symbol: string;
    image: string;
    id: string,
    price: number,
}
interface CoinTransactionData {
    coinPrice: number;
    coinName: string;
    coinId: string;
    coinImage: string;
    coinSymbol: string;
}

export default function AddCoinButton() {

    const [coins, setCoins] = useState<CoinInterface[]>([]);
    const [searchedCoins, setSearchedCoins] = useState<any>([]);
    const [coinTransactionData, setCoinTransactionData] = useState<CoinTransactionData>({ coinPrice: 0, coinName: '', coinId: '', coinImage: '', coinSymbol: '' });
    const [isAddTransactionOpen, setIsTransactionOpen] = useState<boolean>(false);

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

    const selectCoinClick = (price: number, name: string, id: string, image: string, symbol: string) => {
        setCoinTransactionData({ coinPrice: price, coinName: name, coinId: id, coinImage: image, coinSymbol: symbol });
        setIsTransactionOpen(true);
        setSearchedCoins([]);
    };

    useEffect(() => {
        (async () => {
            const fetchedCoins = await getTrendingCoins();
            const filteredCoins: CoinInterface[] = fetchedCoins.map((item: any) => ({ name: item.item.name, image: item.item.small, symbol: item.item.symbol, price: item.item.data.price, id: item.item.id, data: item.item.data }));
            setCoins(filteredCoins);
        })();
    }, [])

    return (
        <div>
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <Button color="grass" size={'3'}>+ Add New Coin</Button>
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
                                    searchedCoins.map((coin: any, index: number) => (
                                        <AlertDialog.Cancel key={`${coin.name}` + `${index}`}>
                                            <button className="hover:bg-green-200 dark:hover:bg-slate-800" onClick={() => {
                                                const fixedPrice = parseFloat(coin.data.price.replace(/[$,]/g, ""));
                                                selectCoinClick(fixedPrice, coin.name, coin.id, coin.thumb, coin.symbol)
                                            }}>
                                                <div className="flex flex-row items-center gap-2">
                                                    <img src={coin.thumb} className="rounded-full h-12 w-12" />
                                                    <span>{coin.name}</span>
                                                    <span>{`(${coin.symbol})`}</span>
                                                </div>
                                            </button>
                                        </AlertDialog.Cancel>
                                    ))
                                ) : (
                                    coins.map((coin: any, index: number) => (
                                        <AlertDialog.Cancel key={`${coin.name}` + `${index}`}>
                                            <button className="hover:bg-green-200 dark:hover:bg-slate-800" onClick={() => selectCoinClick(Number(coin.data.price), coin.name, coin.id, coin.image, coin.symbol)}>
                                                <div className="flex flex-row items-center gap-2">
                                                    <img src={coin.image} className="rounded-full h-12 w-12" />
                                                    <span>{coin.name}</span>
                                                    <span>{`(${coin.symbol})`}</span>
                                                </div>
                                            </button>
                                        </AlertDialog.Cancel>
                                    ))
                                )

                                }
                            </div>
                        </ScrollArea>
                    </AlertDialog.Description>
                    <div className="flex justify-center">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray" size={'3'} onClick={() => setSearchedCoins([])}>
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Root>
            {isAddTransactionOpen ? <AddCoinTransaction {...coinTransactionData} isOpen={isAddTransactionOpen} onClose={setIsTransactionOpen} /> : null}
        </div>
    )

}