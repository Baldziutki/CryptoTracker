'use client'
import WalletNotLoggedIn from "@/components/wallet/WalletNotLoggedIn";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { useContext } from "react";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { WalletContextProvider } from "@/utils/context/WalletContext";
import WalletLoggedIn from "@/components/wallet/WalletLoggedIn";
import AddCoinButton from "@/components/wallet/AddCoinButton";

export default function Wallet() {

    const { loggedIn } = useContext(GlobalDataContext)


    return (
        <WalletContextProvider>
            <div>
                <main className="container mx-auto 2xl:max-w-screen-xl">
                    <div className="flex justify-between pt-2">
                        <Breadcrumbs.Root>
                            <Breadcrumbs.Item name="Cryptocurrencies" link="/" className="font-medium hover:text-green-400" />
                            <Breadcrumbs.Item name="Wallet" className="text-slate-400" />
                        </Breadcrumbs.Root>
                        {loggedIn ? <AddCoinButton /> : null}
                    </div>
                    {loggedIn ? <WalletLoggedIn /> : <WalletNotLoggedIn />}
                </main>
            </div>
        </WalletContextProvider>
    )
}