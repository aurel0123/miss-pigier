"use clent"
import { cn } from '@/lib/utils';
import { Lock, LockOpen } from 'lucide-react';
import React, { forwardRef, useState } from 'react'
import { Button } from './ui/button';
import { Input } from './ui/input';

const PasswordInput = forwardRef<HTMLInputElement , React.InputHTMLAttributes<HTMLInputElement>>((props , ref) => {
    const {className , disabled , ...rest } = props ;
    const [showPassword , setShowPassword] = useState(false) ;

    return (
        <div className={cn('relative', className)}>
            <Input
                type={showPassword ? 'text' : 'password'}
                ref={ref}
                disabled = {disabled}
                className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-4 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
                {...rest}
            />
            <Button
                type="button"
                size="icon"
                variant='ghost'
                className='text-muted-foreground absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 '
                onClick={()=>setShowPassword(!showPassword)}
            >
                {showPassword ? <LockOpen/>  : <Lock/>}
            </Button>
        </div>
    )
})

PasswordInput.displayName = 'PasswordInput'
export default PasswordInput 