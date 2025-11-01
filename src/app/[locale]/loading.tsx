import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={cn('text-primary h-8 w-8 animate-spin')} />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
