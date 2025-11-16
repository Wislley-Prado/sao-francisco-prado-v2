import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const RichTextEditorLazy = React.lazy(() =>
  import('./RichTextEditor').then((module) => ({ default: module.RichTextEditor }))
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EditorSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-muted border-b p-2 flex gap-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-8" />
      ))}
    </div>
    <Skeleton className="h-[300px] m-4" />
  </div>
);

export const RichTextEditor = (props: RichTextEditorProps) => {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <RichTextEditorLazy {...props} />
    </Suspense>
  );
};
