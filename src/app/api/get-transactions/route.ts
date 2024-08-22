import { NextResponse } from 'next/server';
import transactionsData from '@/utils/myjsonfile.json';
import { Transaction } from '@/types';

// GET request handler
export async function GET() {
  const transactions: Transaction[] = transactionsData.transactions;
  return NextResponse.json(transactions);
}