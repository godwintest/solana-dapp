
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onAuthenticate: () => void;
}

export function AuthDialog({ open, loading, onCancel, onAuthenticate }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to authenticate with your passkey to perform this action.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <Wallet className="h-12 w-12 text-solana-purple" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-gradient-to-r from-solana-purple to-solana-mint hover:opacity-90 transition-opacity"
            onClick={onAuthenticate}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
