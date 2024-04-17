
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Component } from 'react';


export const RenderPercentage = ({ number, _class = '' }: { number: number, _class?: string }) => {
    const styles = ({
        true: {
            className: 'text-red-500',
            color: 'red',
            Component: ChevronDownIcon
        },
        false: {
            className: 'text-green-500',
            color: 'green',
            Component: ChevronUpIcon
        },
    } as const)[String(number < 0) as 'true' | 'false'];

    return (
        <span className={styles.className + ' ' + _class}><styles.Component color={styles.color} className='inline' /> {number?.toFixed(2)}%</span>
    );
};