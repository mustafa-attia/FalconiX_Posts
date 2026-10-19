import {Skeleton} from "@heroui/react";

export function PostSkeleton() {
  return (
    [0 , 1 , 2, 3 , 4 , 5 , 6 , 6 , 7 , 8 , 9].map((index) => (
      <div className="premium-card mx-auto my-4 w-full max-w-2xl space-y-5 bg-white p-4" key={index}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-[#e5e5e1]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-36 rounded-lg bg-[#e5e5e1]" />
            <Skeleton className="h-3 w-24 rounded-lg bg-[#e5e5e1]" />
          </div>
        </div>
        <Skeleton className="h-32 rounded-lg bg-[#e5e5e1]" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-3/5 rounded-lg bg-[#e5e5e1]" />
          <Skeleton className="h-3 w-4/5 rounded-lg bg-[#e5e5e1]" />
          <Skeleton className="h-3 w-2/5 rounded-lg bg-[#e5e5e1]" />
        </div>
      </div>
    ))
  );
}