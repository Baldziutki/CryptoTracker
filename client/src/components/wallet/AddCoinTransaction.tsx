'use client'

import { addCoinToWallet } from "@/utils/api/fetchFromServer";
import { WalletContext } from "@/utils/context/WalletContext";
import { AlertDialog, Button, SegmentedControl, TextField } from "@radix-ui/themes"
import { useContext, useState } from "react"

interface AddCoinTransactionProps {
    isOpen: boolean;
    coinPrice: number;
    coinName: string;
    coinId: string;
    coinImage: string;
    coinSymbol: string;
    onClose: (value: boolean | { (value: boolean): boolean }) => void;
}

interface transactionBuyData {
    price: number;
    amount: number;
    spent: number;
    date: string;
}
interface transactionSellData {
    price: number;
    amount: number;
    received: number;
    date: string;
}

export default function AddCoinTransaction({ isOpen, coinPrice, coinName, coinId, coinImage, coinSymbol, onClose }: AddCoinTransactionProps) {

    const { walletTransactions, setWalletTransactions } = useContext(WalletContext);
    const balance = walletTransactions.reduce((total: number, coin: any) => {
        if (coin.coinId === coinId) {
            total += coin.coinAmount;
        };
        return total
    }, 0);

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const [isBuy, setIsBuy] = useState<boolean>(true);
    const [transactionBuyData, setTransactionBuyData] = useState<transactionBuyData>({ price: coinPrice, amount: 1, spent: coinPrice, date: `${year}-${month}-${day}` });
    const [transactionSellData, setTransactionSellData] = useState<transactionSellData>({ price: coinPrice, amount: balance, received: coinPrice, date: `${year}-${month}-${day}` });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChangeBuy = (e: any) => {
        if (e.target.name === 'spent' && transactionBuyData.price) {
            setTransactionBuyData({ ...transactionBuyData, spent: e.target.value, amount: (Number(e.target.value)) / Number(transactionBuyData.price) })
        } else if (e.target.name === 'amount' && transactionBuyData.price) {
            setTransactionBuyData({ ...transactionBuyData, amount: e.target.value, spent: (Number(transactionBuyData.price) * Number(e.target.value)) })
        } else {
            setTransactionBuyData({
                ...transactionBuyData,
                [e.target.name]: e.target.value
            });
        }
    };
    const handleChangeSell = (e: any) => {
        if (e.target.name === 'received' && transactionSellData.price) {
            setTransactionSellData({ ...transactionSellData, received: e.target.value, amount: (Number(e.target.value)) / Number(transactionSellData.price) })
        } else if (e.target.name === 'amount' && transactionSellData.price) {
            setTransactionSellData({ ...transactionSellData, amount: e.target.value, received: (Number(transactionSellData.price) * Number(e.target.value)) })
        } else {
            setTransactionSellData({
                ...transactionSellData,
                [e.target.name]: e.target.value
            });
        }
    };

    const isValidDateFormat = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    };

    const handleBuySubmit = async () => {
        const newErrors: { [key: string]: string } = {};
        setErrors(newErrors);
        if (!transactionBuyData.price) {
            newErrors.price = "Price is required";
        }

        if (!transactionBuyData.amount) {
            newErrors.amount = "Amount is required";
        }

        if (!transactionBuyData.spent) {
            newErrors.spent = "Spent is required";
        }

        if (!transactionBuyData.date) {
            newErrors.date = "Date is required";
        }
        if(!isValidDateFormat(transactionBuyData.date)){
            newErrors.date = 'Date must be in format year-month-day'
        }
        if (Object.keys(newErrors).length === 0) {
            await addCoinToWallet(coinId, coinName, transactionBuyData.amount, transactionBuyData.date, transactionBuyData.price);
            const newWalletTransactions = [...walletTransactions,{coinId: coinId, coinName: coinName, coinAmount: transactionBuyData.amount, coinAddDate: transactionBuyData.date, coinAddDateValue: transactionBuyData.price}];
            setWalletTransactions(newWalletTransactions);
        } else {
            setErrors(newErrors);
        }
    }
    const handleSellSubmit = async () => {
        const newErrors: { [key: string]: string } = {};
        setErrors(newErrors);
        if (!transactionSellData.price) {
            newErrors.price = "Price is required";
        }

        if (!transactionSellData.amount) {
            newErrors.amount = "Amount is required";
        }
        if (transactionSellData.amount > balance) {
            newErrors.amount = "Amount is higher than your current balance";
        }
        if (!transactionSellData.received) {
            newErrors.spent = "Spent is required";
        }
        if (!transactionSellData.date) {
            newErrors.date = "Date is required";
        }
        if(!isValidDateFormat(transactionSellData.date)){
            newErrors.date = 'Date must be in format year-month-day'
        }
        if (Object.keys(newErrors).length === 0) {

        } else {
            setErrors(newErrors);
        }
    }

    return (
        <AlertDialog.Root open={isOpen}>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title className="text-center">Add Transaction to wallet</AlertDialog.Title>
                <div className="flex items-center justify-center">
                    <SegmentedControl.Root defaultValue="buy" size={'3'} className="w-full">
                        <SegmentedControl.Item value="buy" onClick={() => setIsBuy(true)}>Buy</SegmentedControl.Item>
                        <SegmentedControl.Item value="sell" onClick={() => setIsBuy(false)}>Sell</SegmentedControl.Item>
                    </SegmentedControl.Root>
                </div>
                {isBuy ? (
                    <AlertDialog.Description size="2">
                        <div className="flex items-center justify-center py-2 gap-x-2">
                            <img src={coinImage} className="w-12 h-12 rounded-full" />
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-medium text-gray-900 dark:text-white">{coinName}</span>
                                <span className="text-sm text-gray-500 uppercase">{coinSymbol}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2 pt-2">
                            <div>
                                <span className="text-base">Price per coin ($)</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Price per coin" name="price" value={transactionBuyData.price} onChange={handleChangeBuy} />
                            {errors.price && <span className="text-sm text-red-500">{errors.price}</span>}
                            <div>
                                <span className="text-base">Quantity</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Quantity" name="amount" value={transactionBuyData.amount} onChange={handleChangeBuy} />
                            {errors.amount && <span className="text-sm text-red-500">{errors.amount}</span>}
                            <div>
                                <span className="text-base">Total spent</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Total spent" name="spent" value={transactionBuyData.spent} onChange={handleChangeBuy} />
                            {errors.spent && <span className="text-sm text-red-500">{errors.spent}</span>}
                            <div>
                                <span className="text-base">Date</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Date" name="date" value={transactionBuyData.date} onChange={handleChangeBuy} />
                            {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                        </div>
                    </AlertDialog.Description>
                ) : (
                    <AlertDialog.Description size="2">
                        <div className="flex items-center justify-center py-2 gap-x-2">
                            <img src={coinImage} className="w-12 h-12 rounded-full" />
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-medium text-gray-900 dark:text-white">{coinName}</span>
                                <span className="text-sm text-gray-500 uppercase">{coinSymbol}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2 pt-2">
                            <div>
                                <span className="text-base">Price per coin ($)</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Price per coin" name="price" value={transactionSellData.price} onChange={handleChangeSell} />
                            {errors.price && <span className="text-sm text-red-500">{errors.price}</span>}
                            <div className="flex flex-row items-center justify-between">
                                <div>
                                    <span className="text-base">Quantity </span>
                                    <span className="text-lg text-red-500"> *</span>
                                </div>
                                <span className="text-base">Balance: {balance}</span>
                            </div>
                            <TextField.Root size="3" placeholder="Quantity" name="amount" value={transactionSellData.amount} onChange={handleChangeSell} />
                            {errors.amount && <span className="text-sm text-red-500">{errors.amount}</span>}
                            <div>
                                <span className="text-base">Total received</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Total received" name="recived" value={transactionSellData.received} onChange={handleChangeSell} />
                            {errors.spent && <span className="text-sm text-red-500">{errors.spent}</span>}
                            <div>
                                <span className="text-base">Date</span>
                                <span className="text-lg text-red-500"> *</span>
                            </div>
                            <TextField.Root size="3" placeholder="Date" name="date" value={transactionSellData.date} onChange={handleChangeSell} />
                            {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                        </div>
                    </AlertDialog.Description>
                )}
                <div className="flex justify-center pt-2 gap-2">
                    <AlertDialog.Cancel>
                        <Button variant="solid" color="red" size={'4'} onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="green" size={'4'} onClick={isBuy ? handleBuySubmit : handleSellSubmit}>
                            Submit
                        </Button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}