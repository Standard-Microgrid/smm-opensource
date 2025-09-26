"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { Currency } from "@/components/currency";

interface TransactionDetailsDialogProps {
  transaction: {
    id: string;
    customerId: string;
    customerName: string;
    type: string;
    amount: number;
    timestamp: string;
    status: string;
  };
}

export function TransactionDetailsDialog({ transaction }: TransactionDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 font-medium text-blue-600 hover:text-blue-800">
          {transaction.id}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-lg z-[99999]"
        style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          minWidth: '400px',
          maxWidth: '500px'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
              <p className="text-sm font-mono">{transaction.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <p className="text-lg font-semibold">
                <Currency amount={transaction.amount} />
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-sm capitalize">{transaction.type.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
              <p className="text-sm font-mono">{transaction.customerId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
              <p className="text-sm">{transaction.customerName}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
              <p className="text-sm">{transaction.timestamp}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
