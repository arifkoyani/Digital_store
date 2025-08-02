import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountFormData {
  email: string;
  email_password: string;
  card_number: string;
  expire_date: string;
  cvc: string;
  bank_name: string;
  owner: string;
}

const AccountFormFields = ({ 
  formData, 
  setFormData, 
  isValid, 
  onSubmit, 
  submitText,
  onReset 
}: { 
  formData: AccountFormData; 
  setFormData: (data: AccountFormData) => void; 
  isValid: boolean;
  onSubmit: () => void;
  submitText: string;
  onReset: () => void;
}) => (
  <div className="grid gap-6 py-4">
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="account-email" className="text-right font-medium">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="account-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="col-span-3"
          placeholder="Enter email address"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email-password" className="text-right font-medium">
          Password <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email-password"
          type="password"
          value={formData.email_password}
          onChange={(e) => setFormData({ ...formData, email_password: e.target.value })}
          className="col-span-3"
          placeholder="Enter email password"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="card-number" className="text-right font-medium">
          Card Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="card-number"
          value={formData.card_number}
          onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
          className="col-span-3"
          placeholder="Enter card number"
          maxLength={20}
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="expire-date" className="text-right font-medium">
          Expire Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="expire-date"
          value={formData.expire_date}
          onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
          className="col-span-3"
          placeholder="MM/YY"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cvc" className="text-right font-medium">
          CVC <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cvc"
          value={formData.cvc}
          onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
          className="col-span-3"
          placeholder="Enter CVC"
          maxLength={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bank-name" className="text-right font-medium">
          Bank Name
        </Label>
        <Input
          id="bank-name"
          value={formData.bank_name}
          onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
          className="col-span-3"
          placeholder="Enter bank name (optional)"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="owner" className="text-right font-medium">
          Own <span className="text-destructive">*</span>
        </Label>
        <Input
          id="owner"
          value={formData.owner}
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          className="col-span-3"
          placeholder="Enter owner name"
          required
        />
      </div>
    </div>
    
    <div className="flex justify-end space-x-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onReset}>
        Reset
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={!isValid}
        className="min-w-[100px]"
      >
        {submitText}
      </Button>
    </div>
  </div>
);

const Store = () => {
  const navigate = useNavigate();
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [accountFormData, setAccountFormData] = useState<AccountFormData>({
    email: "",
    email_password: "",
    card_number: "",
    expire_date: "",
    cvc: "",
    bank_name: "",
    owner: "",
  });

  const handleDashboardClick = () => {
    navigate("/");
  };

  // Add new account
  const addAccount = async () => {
    try {
      if (!accountFormData.expire_date) {
        toast.error("Please enter an expiry date");
        return;
      }

      const { data, error } = await supabase
        .from('accounts' as any)
        .insert([
          {
            email: accountFormData.email,
            email_password: accountFormData.email_password,
            card_number: accountFormData.card_number,
            expire_date: accountFormData.expire_date,
            cvc: accountFormData.cvc,
            bank_name: accountFormData.bank_name || null,
            Owner: accountFormData.owner,
          },
        ])
        .select();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account added successfully");
      setIsAddAccountDialogOpen(false);
      resetAccountForm();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Reset account form
  const resetAccountForm = () => {
    setAccountFormData({
      email: "",
      email_password: "",
      card_number: "",
      expire_date: "",
      cvc: "",
      bank_name: "",
      owner: "",
    });
  };

  // Check if account form is valid
  const isAccountFormValid = () => {
    return accountFormData.email.trim() !== "" && 
           accountFormData.email_password.trim() !== "" && 
           accountFormData.card_number.trim() !== "" && 
           accountFormData.expire_date.trim() !== "" && 
           accountFormData.cvc.trim() !== "" &&
           accountFormData.owner.trim() !== "";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <Button 
          onClick={handleDashboardClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home size={16} />
          Dashboard
        </Button>
      </div>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Store</h1>
          <p className="text-muted-foreground mt-2">Manage your account information</p>
        </div>
        
        <div className="flex justify-center">
          <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
                <DialogDescription>
                  Create a new account with payment and authentication details.
                </DialogDescription>
              </DialogHeader>
              <AccountFormFields
                formData={accountFormData}
                setFormData={setAccountFormData}
                isValid={isAccountFormValid()}
                onSubmit={addAccount}
                submitText="Add Account"
                onReset={resetAccountForm}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Store;