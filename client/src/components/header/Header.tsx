'use client'
import { Button } from "@radix-ui/themes";
import HeaderStats from "./headerStats/HeaderStats";
import SettingsButton from "./settingsButton/SettingsButton";
import AuthForm from "../auth/AuthForm";
import { useContext, useState } from "react";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import AccountMenu from "../account/AccountMenu";


export default function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [whichForm, setWhichForm] = useState<string>('login');
    const { loggedIn } = useContext(GlobalDataContext);
    return (
        <div className="flex items-center max-xl:overflow-x-auto max-md:px-2">
            <HeaderStats />
            <div className="grow max-md:pl-2" />
            <div className="flex gap-3 max-md:hidden">
                <SettingsButton />
                {loggedIn ? (
                    <>
                        <AccountMenu />
                    </>) : (
                    <>
                        <Button variant="outline" onClick={
                            () => {
                                setWhichForm('login')
                                setIsOpen(true)
                            }
                        }>Login</Button>
                        <Button color="green" onClick={() => {
                            setWhichForm('register')
                            setIsOpen(true)
                        }}>Sign up</Button>
                        <AuthForm isOpen={isOpen} setIsOpen={setIsOpen} whichForm={whichForm} setWhichForm={setWhichForm} />
                    </>)}
            </div>
        </div >
    );
}