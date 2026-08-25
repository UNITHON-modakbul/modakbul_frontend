import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn.ts'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-14 w-full rounded-xl border border-[#17332f]/15 bg-[#fffdf7] px-4 text-base font-semibold text-[#17332f] shadow-inner outline-none transition placeholder:font-normal placeholder:text-[#17332f]/30 focus:border-[#ec6b42] focus:ring-4 focus:ring-[#ec6b42]/10',
        className,
      )}
      {...props}
    />
  )
}
