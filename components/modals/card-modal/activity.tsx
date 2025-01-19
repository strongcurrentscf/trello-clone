"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

interface ActivityProps {
  items: AuditLog[];
}

export const Activity = ({ items }: ActivityProps) => {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="h-5 w-5 mt-0.5 texne700 " />
      <div className=""></div>
    </div>
  );
};

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200">
        <div className="w-full">
          <Skeleton className="w-24 h-6 mb-2 bg-neutral-200"></Skeleton>
          <Skeleton className="w-full h-10 bg-neutral-200"></Skeleton>
        </div>
      </Skeleton>
    </div>
  );
};
