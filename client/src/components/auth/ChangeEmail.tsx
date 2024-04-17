'use client'

import { changeEmail } from "@/utils/api/fetchFromServer";
import { AlertDialog, Button, Text, Flex } from "@radix-ui/themes"
import { useState } from "react";

interface ChangeEmailProps {
    isOpen: boolean;
    setIsOpen: (value: boolean | { (value: boolean): boolean }) => void;
}


export default function ChangeEmail({ isOpen, setIsOpen }: ChangeEmailProps) {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmitButton = async () => {
        setError('');
        if (!password.trim()) {
            setError('Password cant be empty!')
            return;
        }
        if (!email.trim()) {
            setError('New email cant be empty!');
            return;
        }
        if (error === '') {
            const response = await changeEmail(email, password);
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
                    <AlertDialog.Title>Change email</AlertDialog.Title>
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
                                New email
                            </Text>
                            <input className="w-full h-8 border-2 text-sm focus:border-blue-400 outline-none rounded-md pl-2 dark:text-black"
                                placeholder="Enter your new email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Password
                            </Text>
                            <input className="w-full h-8 border-2 text-sm focus:border-blue-400 outline-none rounded-md pl-2 dark:text-black"
                                placeholder="Enter your password"
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