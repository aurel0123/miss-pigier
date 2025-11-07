"use client"
import React from 'react'
import { ArrowRight, } from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { ScrollArea } from './ui/scroll-area'
import { useRouter } from 'next/navigation';
import { dataNavigation } from '@/constantes/index'

export function CommandMenu() {
    const route = useRouter()
    const { open, setOpen } = useSearch()

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false)
            command()
        },
        [setOpen]
    )

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder='Type a command or search...' />
            <CommandList>
                <ScrollArea type='hover' className='h-72 pe-1'>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {dataNavigation.nav_admin.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem, i) => {
                                if (navItem.url)
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => route.push(navItem.url))
                                            }}
                                        >
                                            <div className='flex size-4 items-center justify-center'>
                                                <ArrowRight className='text-muted-foreground/80 size-2' />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    )
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    )
}