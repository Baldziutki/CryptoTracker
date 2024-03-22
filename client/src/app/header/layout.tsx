'use client'
import { Button } from "@radix-ui/themes";
import HeaderStats from "./headerStats/layout";
import SettingsButton from "./settingsButton/layout";


export default function HeaderLayout() {

    return (
        <div className="flex items-center justify-around">
            <HeaderStats />
            <div className="flex flex-row gap-3">
                <SettingsButton/>
                <Button variant="outline" highContrast>Login</Button>
                <Button color="green">Sign up</Button>
            </div>
        </div>

    );
}