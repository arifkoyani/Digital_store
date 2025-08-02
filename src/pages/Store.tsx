import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, Plus, Minus } from "lucide-react";
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

interface Account {
  id: string;
  email: string;
  email_password: string;
  card_number: string;
  expire_date: string;
  cvc: string;
  bank_name: string | null;
  Owner: string | null;
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [accountFormData, setAccountFormData] = useState<AccountFormData>({
    email: "",
    email_password: "",
    card_number: "",
    expire_date: "",
    cvc: "",
    bank_name: "",
    owner: "",
  });

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts' as any)
        .select('*')
        .order('email');

      if (error) {
        toast.error("Failed to fetch accounts");
        return;
      }

      setAccounts((data as unknown as Account[]) || []);
    } catch (error) {
      toast.error("An error occurred while fetching accounts");
    }
  };

  const handleDashboardClick = () => {
    navigate("/");
  };

  const toggleAccountExpansion = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
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
      fetchAccounts(); // Refresh the accounts list
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
        
        <div className="flex justify-center mb-8">
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

        {/* Accounts Display Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Stored Accounts</h2>
          
          {accounts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No accounts found. Add your first account above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <Card key={account.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleAccountExpansion(account.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-primary">Email:</span>
                        <span className="font-normal">{account.email}</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAccountExpansion(account.id);
                        }}
                      >
                        {expandedAccounts.has(account.id) ? (
                          <Minus size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedAccounts.has(account.id) && (
                    <CardContent className="pt-0">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-muted-foreground">Password:</span>
                            <span className="font-mono bg-background px-2 py-1 rounded border">
                              {account.email_password}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-muted-foreground">Card Number:</span>
                            <span className="font-mono bg-background px-2 py-1 rounded border">
                              {account.card_number}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-muted-foreground">Expire Date:</span>
                            <span className="font-mono bg-background px-2 py-1 rounded border">
                              {account.expire_date}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-muted-foreground">CVC:</span>
                            <span className="font-mono bg-background px-2 py-1 rounded border">
                              {account.cvc}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-muted-foreground">Bank Name:</span>
                            <span className="font-mono bg-background px-2 py-1 rounded border">
                              {account.bank_name || "Not specified"}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-muted-foreground">Owner:</span>
                            <span className="font-mono bg-background px-2 py-1 rounded border">
                              {account.Owner || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;