import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const cancelReasons = [
  "Changed my mind",
  "Found a better deal elsewhere",
  "Ordered by mistake",
  "Shipping time is too long",
  "Other"
];

const CancelOrderModal = ({ isOpen, onClose, onConfirm, isItem }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel {isItem ? 'Item' : 'Order'}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="cancel-reason">Reason for cancellation</Label>
          <Select onValueChange={setReason} value={reason}>
            <SelectTrigger id="cancel-reason">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {cancelReasons.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!reason}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;

