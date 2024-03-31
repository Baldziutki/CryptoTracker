import { ChevronRightIcon } from "@radix-ui/react-icons"
import { ReactElement, Fragment } from "react"

export const Breadcrumbs = {
    Item: function Item({ name, link, className }: { name: string, link?: string, className?: string }) {
        if (!link) {
            return <span>{name}</span>
        }
        return <a href={link} className={className}>{name}</a>
    },
    Separator: function Separator({ className }: { className?: string }) {
        return <ChevronRightIcon className={className} />
    },
    Root: function Root({ children }: { children: ReactElement[] }) {
        const items: ReturnType<typeof Breadcrumbs.Item>[] = children?.filter(child => child.type === Breadcrumbs.Item);

        return <div className="flex items-center">
            {items.map((item, index) => {
                return (
                    <Fragment key={item.props.name + '-' + item.props.link}>
                        {item}
                        {index !== items.length - 1 && <Breadcrumbs.Separator />}
                    </Fragment>)
            })}
        </div>
    }
}