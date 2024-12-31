import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Subscription } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscriptionId: string) => void;
}

export function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-700/50">
          <TableHead className="text-zinc-400">Plan Name</TableHead>
          <TableHead className="text-zinc-400">Price</TableHead>
          <TableHead className="text-zinc-400">Duration</TableHead>
          <TableHead className="text-zinc-400">Description</TableHead>
          <TableHead className="text-zinc-400">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow key={subscription.id} className="border-zinc-700/50">
            <TableCell className="text-white font-medium">
              {subscription.name}
            </TableCell>
            <TableCell className="text-zinc-300">
              {formatCurrency(subscription.price)}/month
            </TableCell>
            <TableCell className="text-zinc-300">
              {subscription.duration_months} {subscription.duration_months === 1 ? 'month' : 'months'}
            </TableCell>
            <TableCell className="text-zinc-300">
              {subscription.description}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(subscription)}
                  className="h-8 w-8 text-zinc-400 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(subscription.id)}
                  className="h-8 w-8 text-zinc-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {subscriptions.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-zinc-400 py-8">
              No subscription plans found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}