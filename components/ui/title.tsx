'use client';

import { cn } from '@/lib/utils';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

const Title: FC<Props> = ({ className, children, ...props }) => {
  return (
    <h1 {...props} className={cn('text-2xl font-bold', className)}>
      {children}
    </h1>
  );
};

export default Title;
