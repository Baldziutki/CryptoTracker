import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { useContext } from "react";
import { RenderPercentage } from "../renderPercentage/RenderPercentage";



interface HistoricalPriceProps {
    price: number,
    low_24h: number,
    high_24h: number,
    ath: number,
    atl: number,
    ath_date: string,
    atl_date: string
}



export default function HistoricalPrice(props: HistoricalPriceProps) {
    const { selectedCurrency } = useContext(GlobalDataContext);
    const { low_24h, high_24h, ath, atl, ath_date, atl_date, price } = props;


    const renderDate = (dateString: string) => {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 to month since it's zero-based
        const day = ('0' + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }

    return (
        <div className="flex flex-col gap-y-5 pt-4 max-lg:max-w-full">
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>24h Range</span>
                <div className="gap-2">
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(low_24h)}</span>
                    <span>-</span>
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(high_24h)}</span>
                </div>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>All-Time High</span>
                <div className="flex flex-col">
                    <div className="flex">
                        <p className="text-end">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(ath)}</p>
                        <RenderPercentage number={((price / ath) - 1) * 100} _class="flex items-center text-sm" />
                    </div>
                    <span className="text-xs">{renderDate(ath_date)}</span>
                </div>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>All-Time Low</span>
                <div className="flex flex-col">
                    <div className="flex">
                        <p className="text-end">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(atl)}</p>
                        <RenderPercentage number={((price / atl) - 1) * 100} _class="flex items-center text-sm" />
                    </div>
                    <span className="text-xs">{renderDate(atl_date)}</span>
                </div>
            </div>
        </div>
    )
}