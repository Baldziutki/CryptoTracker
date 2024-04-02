import { TextField } from "@radix-ui/themes";
import { useState } from "react";






export default function CoinCalculator({ coinName, currency, price }: { coinName: string, currency: string, price: number }) {

    const [coinsAmount, setCoinsAmount] = useState<number>();
    const [currencyAmount, setCurrencyAmount] = useState<number>();

    return (
        <div className="flex flex-col gap-2 pt-4">
            <div>
                <input className="border-2 rounded h-10 w-full capitalize dark:text-black"  placeholder={coinName} value={coinsAmount} onChange={(e) => {
                    setCoinsAmount(Number(e.target.value))
                    setCurrencyAmount(Number(e.target.value) * price)
                }}></input>
            </div>
            <div>
                <input className="border-2 rounded h-10 w-full dark:text-black" placeholder={currency} value={currencyAmount} onChange={(e) => {
                    setCurrencyAmount(Number(e.target.value))
                    setCoinsAmount(Number(e.target.value) / price)
                }}></input>
            </div>
        </div>
    )
}