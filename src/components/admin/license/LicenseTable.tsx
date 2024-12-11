import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaymentReceipt } from "./types";

interface LicenseTableProps {
  receipts: PaymentReceipt[];
  onViewReceipt: (filePath: string) => void;
  onUpdateStatus: (userId: string, status: "approved" | "rejected", receiptId: string) => void;
}

export const LicenseTable = ({ receipts, onViewReceipt, onUpdateStatus }: LicenseTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts?.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell>
              {receipt.profile?.email}
              <br />
              <span className="text-sm text-muted-foreground">
                {receipt.profile?.full_name}
              </span>
            </TableCell>
            <TableCell>${receipt.amount}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  receipt.status === "approved"
                    ? "bg-green-50 text-green-700"
                    : receipt.status === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {receipt.status}
              </span>
            </TableCell>
            <TableCell>
              {format(new Date(receipt.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewReceipt(receipt.file_path)}
                >
                  View Receipt
                </Button>
                {receipt.status === "pending" && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(receipt.user_id!, "approved", receipt.id)
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(receipt.user_id!, "rejected", receipt.id)
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};