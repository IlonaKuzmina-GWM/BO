import DashPageTitle from "@/components/shared/DashPageTitle";
import TransactionsWrapper from "@/components/shared/Transactions/TransactionsWrapper";

export default function TransactionsPage() {
  return (
    <div className="flex w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Transaction"
        description="Comprehensive transaction history: track and manage all your payments"
      />

      <TransactionsWrapper />
    </div>
  );
}
