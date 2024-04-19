'use client'

import { AlertDialog, Button } from "@radix-ui/themes"
import { BitcoinFill, Coin, ArrowRightLeft, Wallet } from "akar-icons"
import SearchButton from "./SearchButton"
import SearchForm from "./SearchForm"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import AccountMenu from "../account/AccountMenu"
import AuthForm from "../auth/AuthForm"
import SettingsButton from "../header/settingsButton/SettingsButton"
import { GlobalDataContext } from "@/utils/context/GlobalDataContext"
import { useState, useContext } from "react"
import PhoneSearchForm from "./PhoneSearchForm"

export default function PhoneNavbar() {

    const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
    const [whichForm, setWhichForm] = useState<string>('login');
    const { loggedIn } = useContext(GlobalDataContext);

    return (
        <div className="md:hidden pl-2 flex gap-2 items-center justify-center">
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <Button color="blue" variant="soft" size={"3"}><HamburgerMenuIcon /></Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="450px">
                    <div className="flex justify-between">
                        <AlertDialog.Title>Navigation</AlertDialog.Title>
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                X
                            </Button>
                        </AlertDialog.Cancel>
                    </div>
                    <AlertDialog.Description size="2">
                        <div className="flex flex-col gap-6 pt-2 max-xl:overflow-x-auto max-md:px-2">
                            <a href="/" >
                                <div className="flex flex-row items-center gap-1">
                                    <BitcoinFill strokeWidth={2} size={24} color="orange" />
                                    <span>Cryptocurrencies</span>
                                </div>
                            </a>
                            <a href="/exchanges">
                                <div className="flex flex-row items-center gap-1">
                                    <div className="flex flex-row">
                                        <Coin strokeWidth={2} size={24} color="green" className="text-white" />
                                        <ArrowRightLeft strokeWidth={2} size={24} />
                                        <BitcoinFill strokeWidth={2} size={24} color="orange" />
                                    </div>
                                    Exchanges
                                </div>
                            </a>
                            <a href="/wallet" >
                                <div className="flex flex-row items-center gap-1">
                                    <Wallet strokeWidth={2} size={24} color="blue" />
                                    <span>Wallet</span>
                                </div>
                            </a>
                            <SettingsButton />
                            {loggedIn ? (
                                <>
                                    <AccountMenu />
                                </>) : (
                                <>
                                    <Button variant="outline" onClick={
                                        () => {
                                            setWhichForm('login')
                                            setIsAuthOpen(true)
                                        }
                                    }>Login</Button>
                                    <Button color="green" onClick={() => {
                                        setWhichForm('register')
                                        setIsAuthOpen(true)
                                    }}>Sign up</Button>
                                    <AuthForm isOpen={isAuthOpen} setIsOpen={setIsAuthOpen} whichForm={whichForm} setWhichForm={setWhichForm} />
                                </>)}
                        </div>
                    </AlertDialog.Description>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <PhoneSearchForm />
        </div>
    )
}