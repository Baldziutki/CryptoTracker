'use client'

import { useState } from "react";
import SearchForm from "./searchForm/SearchForm"
import SearchButton from "./searchButton/SearchButton";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-row pt-2 px-60">
            <div className="flex flex-row items-center justify-center gap-6 ">
                <p>Cryptocurrencies</p>
                <p>Exchanges</p>
            </div>
            <div className="grow" />
            <SearchButton setIsOpen={setIsOpen}/>
            {isOpen ? <SearchForm isOpen={isOpen} setIsOpen={setIsOpen}/> : null}
        </div>
    )
}