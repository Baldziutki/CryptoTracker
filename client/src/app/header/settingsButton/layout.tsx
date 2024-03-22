'use client'

import React, { useContext, useState } from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import useTheme from "@/app/utils/hooks/useTheme";
import ThemeToggle from "./themeToggle/layout"
import CurrencyPicker from "./currencyPicker/layout";
import { GlobalDataContext } from "@/app/utils/context/GlobalDataContext";

export default function SettingsButton() {
    const [_, toggleTheme] = useTheme();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { selectedCurrency } = useContext(GlobalDataContext);
    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="solid" color="blue">
                        Settings
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content variant="solid">
                    <DropdownMenu.Item onClick={() => setIsOpen(true)}><div className="flex gap-10"><p>Currency</p><p>{selectedCurrency.toUpperCase()}</p></div></DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => { toggleTheme() }}>Dark Mode<ThemeToggle /></DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <CurrencyPicker isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )

}