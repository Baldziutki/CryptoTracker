

import { DropdownMenu, Button } from "@radix-ui/themes"
import { PersonIcon } from "@radix-ui/react-icons"
import { logOut } from "@/utils/api/fetchFromServer"
import { useContext, useState } from "react"
import { GlobalDataContext } from "@/utils/context/GlobalDataContext"
import ChangeEmail from "../auth/ChangeEmail"
import ChangePassword from "../auth/ChangePassword"


export default function AccountMenu() {

    const { setLoggedIn } = useContext(GlobalDataContext);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState<boolean>(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

    const handleLogOutButton = async () => {
        await logOut();
        setLoggedIn(false);
    }

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="soft">
                        <PersonIcon />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item onClick={() => setIsChangeEmailOpen(true)}>Change Email</DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => setIsChangePasswordOpen(true)}>Change Password</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red" onClick={() => handleLogOutButton()}>
                        Log out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            {isChangeEmailOpen ? <ChangeEmail isOpen={isChangeEmailOpen} setIsOpen={setIsChangeEmailOpen} /> : null}
            {isChangePasswordOpen ? <ChangePassword isOpen={isChangePasswordOpen} setIsOpen={setIsChangePasswordOpen} /> : null}
        </>
    )
}