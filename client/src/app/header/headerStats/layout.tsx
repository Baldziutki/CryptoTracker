'use Server'
export default function HeaderStats() {

    return (
        <div>
            <div className="flex flex-row gap-6">
                <p>Coins:</p>
                <p>Exchanges:</p>
                <p>Market Cap:</p>
                <p>24h Vol:</p>
                <p>Dominance:</p>
                <p>ETH Gas:</p>
            </div>
        </div>
    )
}