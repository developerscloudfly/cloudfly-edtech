import { DollarSign, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-blue-deep">Payment Management</h1>
        <p className="text-slate text-sm mt-1">View all transactions and process refunds.</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search by payment ID or user..."
            className="w-full pl-9 pr-4 py-2.5 border border-ash rounded-lg text-sm bg-surface focus:outline-none focus:border-blue-primary"
          />
        </div>
        <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Success</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>
        <select className="border border-ash rounded-lg px-3 py-2.5 text-sm bg-surface text-slate">
          <option>All Gateways</option>
          <option>Stripe</option>
          <option>Razorpay</option>
        </select>
      </div>

      <Card>
        <CardHeader><CardTitle>All Transactions</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate">
            <DollarSign className="w-10 h-10 mx-auto mb-3 text-ash" />
            <p className="font-medium">No transactions yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
