import TransactionRow from "@/components/TransactionRow/TransactionRow";
import Image from "next/image";

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <TransactionRow />

      </div>
    </div>
  );
}
