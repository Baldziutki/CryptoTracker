'use client'


import React from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import useTheme from "@/app/utils/hooks/useTheme";
import ThemeToggle from "../themeToggle/layout"


export default function SettingsButton() {
    const [theme, toggleTheme] = useTheme();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="solid" color="blue">
                    Settings
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant="solid">
                <DropdownMenu.Item shortcut="Usd">Currency</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => {toggleTheme()}}>Dark Mode<ThemeToggle/></DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )

}