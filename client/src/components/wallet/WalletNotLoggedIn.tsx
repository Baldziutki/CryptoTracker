'use client'

import { useState } from "react";
import { Button } from "@radix-ui/themes";
import AuthForm from "../auth/AuthForm";



export default function WalletNotLoggedIn() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [whichForm, setWhichForm] = useState<string>('login');


    return (
        <div className="flex flex-col">

            <h1 className="text-4xl font-bold">Free & Powerful Crypto Portfolio Tracker</h1>
            <p className="text-xl">Track your crypto earnings like a pro, with a user-friendly and reliable portfolio tracker that you can rely on</p>
            <div className="flex gap-4">
                <Button color="green" size={"4"} onClick={() => {
                    setWhichForm('register')
                    setIsOpen(true)
                }}>Sign up</Button>
                <Button variant="outline" size={"4"} onClick={
                    () => {
                        setWhichForm('login')
                        setIsOpen(true)
                    }
                }>Login</Button>
                <AuthForm isOpen={isOpen} setIsOpen={setIsOpen} whichForm={whichForm} setWhichForm={setWhichForm} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <p className="text-lg font-medium">📈 Real-time Price Data (13,000+ coins)</p>
                    <p>From the world's largest independent cryptocurrency data aggregator</p>
                </div>
                <div>
                    <p className="text-lg font-medium">📲 Synced across Web & Mobile App</p>
                    <p>Portfolio tracking at your fingertips - anytime, anywhere</p>
                </div>
                <div>
                    <p className="text-lg font-medium">📊 Create Portfolio</p>
                    <p>Cover all strategies - conservative, risky, long term HODL, DeFi, low-cap gems, high risk positions and more!</p>
                </div>
            </div>
        </div>
    )
}