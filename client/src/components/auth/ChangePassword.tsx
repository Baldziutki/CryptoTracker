'use client'

import { changePassword } from "@/utils/api/fetchFromServer";
import { AlertDialog, Button, Text, Flex } from "@radix-ui/themes"
import { useState } from "react";

interface ChangePasswordProps {
    isOpen: boolean;
    setIsOpen: (value: boolean | { (value: boolean): boolean }) => void;
}


export default function ChangePassword({ isOpen, setIsOpen }: ChangePasswordProps) {

    const [newPassword, setNewPassword] = useState<string>('');

    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmitButton = async () => {
        setError('');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const isValidPassword = passwordRegex.test(newPassword);
        if (!password.trim()) {
            setError('Password cant be empty!');
            return;
        }
        if (!isValidPassword) {
            setError('Invalid new password!');
            return;
        }
        if (error === '') {
            const response = await changePassword(password, newPassword);
            if (!response.ok) {
                setError(response.json.message);
            } else {
                setIsOpen(false);
            }
        }

    }

    return (
        <AlertDialog.Root open={isOpen}>
            <AlertDialog.Content maxWidth="450px">
                <div className="flex justify-between">
                    <AlertDialog.Title>Change password</AlertDialog.Title>
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" onClick={() => setIsOpen(false)}>
                            X
                        </Button>
                    </AlertDialog.Cancel>
                </div>
                <AlertDialog.Description size="2">
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                New password
                            </Text>
                            <input className="w-full h-8 border-2 text-sm focus:border-blue-400 outline-none rounded-md pl-2 dark:text-black"
                                placeholder="Enter your new password"
                                type='password'
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Password
                            </Text>
                            <input className="w-full h-8 border-2 text-sm focus:border-blue-400 outline-none rounded-md pl-2 dark:text-black"
                                placeholder="Enter your current password"
                                type='password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        {error.length > 0 ? <span className="text-red-500">{error}</span> : null}
                    </Flex>
                </AlertDialog.Description>
                <div className="flex justify-center pt-2">
                    <AlertDialog.Action>
                        <Button color="green" onClick={() => handleSubmitButton()}>
                            Submit
                        </Button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root >
    )
}