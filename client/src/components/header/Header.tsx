'use client'
import { Button } from "@radix-ui/themes";
import HeaderStats from "./headerStats/HeaderStats";
import SettingsButton from "./settingsButton/SettingsButton";


export default function Header() {

    return (
        <div className="flex items-center justify-around">
            <HeaderStats />
            <div className="flex gap-3">
                <SettingsButton />
                <Button variant="outline" highContrast>Login</Button>
                <Button color="green">Sign up</Button>
            </div>
        </div>
    );
}