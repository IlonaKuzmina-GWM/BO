import DashPageTitle from "@/components/shared/DashPageTitle";
import TransactionRow from "@/components/shared/TransactionRow/TransactionRow";
import Image from "next/image";

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6">
      <DashPageTitle title="Transaction" />

      <div className="w-full">
        <TransactionRow />
      </div>
    </div>
  );
}
