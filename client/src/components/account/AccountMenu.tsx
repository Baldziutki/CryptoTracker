

import { DropdownMenu, Button } from "@radix-ui/themes"
import { PersonIcon } from "@radix-ui/react-icons"
import { logOut } from "@/utils/api/fetchFromServer"
import { useContext } from "react"
import { GlobalDataContext } from "@/utils/context/GlobalDataContext"


export default function AccountMenu() {

    const {setLoggedIn} = useContext(GlobalDataContext);

    const handleLogOutButton = async () => {
        await logOut();
        setLoggedIn(false);
    }


    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft">
                    <PersonIcon />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item>Change Email</DropdownMenu.Item>
                <DropdownMenu.Item>Change Password</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={() => handleLogOutButton()}>
                    Log out
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}