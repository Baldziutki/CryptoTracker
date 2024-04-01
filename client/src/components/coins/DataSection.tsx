import { GlobalDataContext } from "@/utils/context/GlobalDataContext";
import { useContext } from "react";



interface DataSectionProps {
    market_cap: number,
    fully_diluted_valuation: number,
    total_volume: number,
    total_supply: number,
    circulating_supply: number,
    max_supply: number | null,
}



export default function DataSection(props: DataSectionProps) {
    const { selectedCurrency } = useContext(GlobalDataContext);
    const { market_cap, fully_diluted_valuation, total_volume, total_supply, circulating_supply, max_supply } = props;

    return (
        <div className="flex flex-col max-w-96 gap-y-4 pt-4">
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>Market Cap</span>
                <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(market_cap)}</span>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>Fully Diluted Valuation</span>
                <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(fully_diluted_valuation)}</span>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>24 Hour Trading Vol</span>
                <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(total_volume)}</span>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>Circulating Supply</span>
                <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(total_supply)}</span>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>Total Supply</span>
                <span>{new Intl.NumberFormat().format(circulating_supply)}</span>
            </div>
            <div className="flex border-b-[1px] dark:border-slate-700 justify-between">
                <span>Max Supply</span>
                {max_supply === null ? <span>∞</span> : <span>{new Intl.NumberFormat().format(max_supply)}</span>}
            </div>
        </div>
    )
}