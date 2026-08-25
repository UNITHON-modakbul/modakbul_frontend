import type { ComponentProps } from 'react'
import { cn } from '../../utils/cn.ts'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-36 w-full resize-none rounded-2xl border border-[#17332f]/15 bg-[#fffdf7] px-5 py-4 text-base leading-7 text-[#17332f] shadow-inner outline-none transition placeholder:text-[#17332f]/30 focus:border-[#ec6b42] focus:ring-4 focus:ring-[#ec6b42]/10',
        className,
      )}
      {...props}
    />
  )
}
