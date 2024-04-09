'use client'
import WalletNotLoggedIn from "@/components/wallet/WalletNotLoggedIn";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { useContext } from "react";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import WalletLoggedIn from "@/components/wallet/WalletLoggedIn";

export default function Wallet() {

    const { loggedIn } = useContext(GlobalDataContext)


    return (
        <div>
            <main className="container mx-auto 2xl:max-w-screen-xl">
                <Breadcrumbs.Root>
                    <Breadcrumbs.Item name="Home" link="/" className="font-medium hover:text-green-400" />
                    <Breadcrumbs.Item name="Wallet" className="text-slate-400" />
                </Breadcrumbs.Root>
                {loggedIn ? <WalletLoggedIn /> : <WalletNotLoggedIn />}
            </main>
        </div>
    )
}