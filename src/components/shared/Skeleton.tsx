import { Skeleton } from "../ui/Skeleton";

export function TransactionRowSkeleton() {
    return (
      <tr className="w-full border-b   last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
        {/* Customer Name and Image */}
        <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
        </td>
        {/* Email */}
        <td className="whitespace-nowrap px-3 py-3">
          <Skeleton className="h-6 w-32" />
        </td>
        {/* Amount */}
        <td className="whitespace-nowrap px-3 py-3">
          <Skeleton className="h-6 w-16" />
        </td>
        {/* Date */}
        <td className="whitespace-nowrap px-3 py-3">
          <Skeleton className="h-6 w-16" />
        </td>
        {/* Status */}
        <td className="whitespace-nowrap px-3 py-3">
          <Skeleton className="h-6 w-16" />
        </td>
        {/* Actions */}
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex justify-end gap-3">
            <Skeleton className="h-[38px] w-[38px]" />
            <Skeleton className="h-[38px] w-[38px]" />
          </div>
        </td>
      </tr>
    )
  }