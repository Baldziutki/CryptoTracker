import dynamic from 'next/dynamic'

export const MarketCapDivider = dynamic(() => Promise.resolve(({ number, currency }: { number: number, currency: string }) => {
    const strNum = number.toFixed();
    const length = strNum.length;

    if (length > 12) {
        return <> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number / 1000000000000))} Trillion </>
    } else if (length <= 12 && length >= 9) {
        return <> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number / 1000000000))} Billion </>
    } else {
        return <> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number))} Thousand </>
    }
}), { ssr: false });


export const FormatNumber = dynamic(() => Promise.resolve(({ number, currency }: { number: number, currency: string }) => {
    return <>{new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency }).format((number))}</>
}), { ssr: false });