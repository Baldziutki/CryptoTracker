
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'


export const RenderPercentage = ({ number, _class='' }: { number: number, _class?: string }) => {
    if (number < 0) {
        return (
            <div className={_class}>
                <ChevronDownIcon color='red' />
                <span className='text-red-500'>{number?.toFixed(2)}%</span>
            </div>
        )
    } else {
        return (
            <div className={_class}>
                <ChevronUpIcon color='green' />
                <span className='text-green-500'>{number?.toFixed(2)}%</span>
            </div>
        )
    }
};