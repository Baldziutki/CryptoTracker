'use client'

import { Button } from "@radix-ui/themes"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

interface SearchButtonProps {
    setIsOpen: (value: boolean | { (value: boolean): boolean }) => void;
}

export default function SearchButton({ setIsOpen }: SearchButtonProps) {

    return (
        <Button
            variant="soft" color="gray" radius="large"
            style={{ width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
            onClick={() => { setIsOpen(true) }}>
            <MagnifyingGlassIcon height="16" width="16" />
            <span>Search</span>
        </Button>
    )
}