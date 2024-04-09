
import { logIn, register } from "@/utils/api/fetchFromServer";
import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { Dialog, Button, Text, Flex, SegmentedControl } from "@radix-ui/themes"
import { useContext, useState } from "react"

interface AuthFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean | { (value: boolean): boolean }) => void;
    whichForm: string
    setWhichForm: (value: string | { (value: string): string }) => void;
}

export default function AuthForm({ isOpen, setIsOpen, whichForm, setWhichForm }: AuthFormProps) {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const {setLoggedIn} = useContext(GlobalDataContext);

    const handleLoginButton = async () => {
        if (email.trim() === '') {
            setError('Invalid email');
            return;
        }
        if (password.trim() === '') {
            setError('Invalid password');
            return;
        }
        if (email.trim() !== '' && password.trim() !== '') {
            setError('');
            const loginResponse = await logIn(email, password);
            if (loginResponse.statusCode === 200) {
                setLoggedIn(true);
                setIsOpen(false);
            }
            else if (loginResponse.statusCode === 400) {
                setError('Invalid password or email!');
            } else if (loginResponse.statusCode === 404) {
                setError(loginResponse.message);
            }
        }

    }

    const handleRegisterButton = async () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const isValidPassword = passwordRegex.test(password);
        if (email.trim() === '') {
            setError('Invalid email');
            return;
        }
        if (!isValidPassword) {
            setError('Invalid password');
            return;
        }
        if (email.trim() !== '' && isValidPassword) {
            setError('');
            const loginResponse = await register(email, password);
            if (loginResponse.statusCode === 201) {
                setIsOpen(false);
                setWhichForm('login');
            } else if (loginResponse.statusCode === 409 || loginResponse.statusCode === 422) {
                setError(loginResponse.message);
            }
        }
    }

    return (
        <Dialog.Root open={isOpen}>
            {whichForm === 'login' ? (
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Login to track your favorite coin easily 🚀</Dialog.Title>
                    <div className="flex justify-center">
                        <SegmentedControl.Root defaultValue="login">
                            <SegmentedControl.Item value="login" onClick={() => setWhichForm('login')}>Login</SegmentedControl.Item>
                            <SegmentedControl.Item value="register" onClick={() => setWhichForm('register')}>Register</SegmentedControl.Item>
                        </SegmentedControl.Root>
                    </div>
                    {error !== '' ? <div className="flex justify-center"><span className="text-sm text-center text-red-500">{error}</span></div> : null}
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Email
                            </Text>
                            <input className="w-full h-8 border-2 text-sm focus:border-blue-400 outline-none rounded-md pl-2 dark:text-black"
                                placeholder="Enter your email"
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
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="green" onClick={() => handleLoginButton()}>Login</Button>
                    </Flex>
                </Dialog.Content>
            ) : (
                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>IT'S FREE! Track your favorite coin easily with CryptoTracker 🚀</Dialog.Title>
                    <div className="flex justify-center">
                        <SegmentedControl.Root defaultValue="register">
                            <SegmentedControl.Item value="login" onClick={() => setWhichForm('login')}>Login</SegmentedControl.Item>
                            <SegmentedControl.Item value="register" onClick={() => setWhichForm('register')}>Register</SegmentedControl.Item>
                        </SegmentedControl.Root>
                    </div>
                    {error !== '' ? <div className="flex justify-center"><span className="text-sm text-center text-red-500">{error}</span></div> : null}
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Email
                            </Text>
                            <input className="w-full h-8 border-2 text-sm focus:border-blue-400 outline-none rounded-md pl-2 dark:text-black"
                                placeholder="Enter your email"
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
                            <span className="text-xs">Password must contain at least 8 characters including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character</span>
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="green" onClick={() => handleRegisterButton()}>Register</Button>
                    </Flex>
                </Dialog.Content>
            )}

        </Dialog.Root>
    )
}