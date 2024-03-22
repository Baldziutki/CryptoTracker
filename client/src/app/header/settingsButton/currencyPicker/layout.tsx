'use client'

import type React from "react";
import { useState, useEffect, useContext } from "react"
import { Button, AlertDialog } from "@radix-ui/themes"
import { getSupportedCurrencies } from "@/app/utils/api/fetchFromCoinGecko";
import { GlobalDataContext } from "@/app/utils/context/GlobalDataContext";

interface CurrencyPickerProps {
    isOpen: boolean;
    setIsOpen: (value: boolean | { (value: boolean): boolean }) => void;
}


export default function CurrencyPicker({ isOpen, setIsOpen }: CurrencyPickerProps) {

    const [currencies, setCurrencies] = useState<Array<string>>();
    const { selectCurrency } = useContext(GlobalDataContext);

    const changeCurrency = (currency: string) => {
        selectCurrency(currency);
    }

    useEffect(() => {
        (async () => {
            setCurrencies(await getSupportedCurrencies());
        })();
    }, [])

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Select Currency</AlertDialog.Title>
                <div className="grid grid-cols-5 gap-4 pb-3">
                    {
                        currencies?.map((currency, index) => (
                            <AlertDialog.Action key={index}>
                                <Button variant="soft" color="gray" onClick={() => changeCurrency(currency)}>
                                    {currency}
                                </Button>
                            </AlertDialog.Action>
                        ))
                    }
                </div>
                <div className="flex justify-center">
                    <AlertDialog.Cancel>
                        <Button variant="solid" color="red">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}