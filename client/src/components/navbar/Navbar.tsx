'use client'

import { useState } from "react";
import SearchForm from "./searchForm/SearchForm"
import SearchButton from "./searchButton/SearchButton";
import { Wallet, BitcoinFill, Coin, ArrowRightLeft } from "akar-icons";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-row pt-2">
            <div className="flex flex-row items-center justify-center gap-6">
                <a href="/">
                    <div className="flex flex-row items-center gap-1">
                        <BitcoinFill strokeWidth={2} size={24} color="orange"/>
                        <span>Cryptocurrencies</span>
                    </div>
                </a>
                <a href="/exchanges">
                    <div className="flex flex-row items-center gap-1">
                        <div className="flex flex-row">
                            <Coin strokeWidth={2} size={24} color="green" className="text-white"/>
                            <ArrowRightLeft strokeWidth={2} size={24} />
                            <BitcoinFill strokeWidth={2} size={24} color="orange"/>
                        </div>
                        Exchanges
                    </div>
                </a>
                <a href="/wallet">
                    <div className="flex flex-row items-center gap-1">
                        <Wallet strokeWidth={2} size={24} color="blue" />
                        <span>Wallet</span>
                    </div>
                </a>
            </div>
            <div className="grow" />
            <SearchButton setIsOpen={setIsOpen} />
            {isOpen ? <SearchForm isOpen={isOpen} setIsOpen={setIsOpen} /> : null}
        </div>
    )
}