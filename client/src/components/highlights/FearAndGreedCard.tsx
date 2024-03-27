
import { Progress, Flex } from '@radix-ui/themes';

export default function FearAndGreedCard({ value }: { value: number }) {
    const fngValue = [0, 0, 0, 0, 0];
    let value_classification = ''
    for (let i = 0; i < fngValue.length; i++) {
        if (value > 20 * i && value < 20 * (i + 1)) {
            fngValue[i] = (value - 20 * i) * 5
        } else if (value > 20 * i) {
            fngValue[i] = 100;
        }
    }

    if (value <= 20) {
        value_classification = 'Extreme Fear'
    } else if (value <= 40) {
        value_classification = 'Fear'
    } else if (value <= 60) {
        value_classification = 'Neutral'
    } else if (value <= 80) {
        value_classification = 'Greed'
    } else {
        value_classification = 'Extreme Greed'
    }

    return (
        <div className='flex flex-col border-2 rounded-xl drop-shadow-md py-2 px-2 dark:border-gray-800 '>
            <span className='font-medium text-lg'>Fear & Greed Index</span>
            <div className='flex flex-col justify-center pt-6'>
                <span className='font-bold text-3xl text-center'>{value}</span>
                <span className='pb-4 text-center font-light'>{value_classification}</span>
                <Flex maxWidth={'100%'} gap='2'>
                    <Progress value={fngValue[0]} color='red' />
                    <Progress value={fngValue[1]} color='orange' />
                    <Progress value={fngValue[2]} color='yellow' />
                    <Progress value={fngValue[3]} color='grass' />
                    <Progress value={fngValue[4]} color='green' />
                </Flex>
            </div>
        </div>
    )
}
