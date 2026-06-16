'use client';

import { cn } from '@/lib/utils';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> {
  children: React.ReactNode;
  className?: string;
}

const Description: FC<Props> = ({ className, children, ...props }) => {
  return (
    <p {...props} className={cn('text-sm opacity-50', className)}>
      {children}
    </p>
  );
};

export default Description;
