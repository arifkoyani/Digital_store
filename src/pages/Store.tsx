import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, Plus, Minus, Trash2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountFormData {
  email: string;
  email_password: string;
  card_number: string;
  expire_date: string;
  cvc: string;
  bank_name: string;
  owner: string;
  company: string;
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="company" className="text-right font-medium">
          Company
        </Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="col-span-3"
          placeholder="Enter company name"
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
  const [isNetflixExpanded, setIsNetflixExpanded] = useState(false);
  const [accountFormData, setAccountFormData] = useState<AccountFormData>({
    email: "",
    email_password: "",
    card_number: "",
    expire_date: "",
    cvc: "",
    bank_name: "",
    owner: "",
    company: "",
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

  // Delete account
  const deleteAccount = async (accountId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('accounts' as any)
        .delete()
        .eq('id', accountId);

      if (error) {
        toast.error("Failed to delete account");
        return;
      }

      toast.success(`Account ${email} deleted successfully`);
      fetchAccounts(); // Refresh the accounts list
      // Close the expanded view if it was open
      setExpandedAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(accountId);
        return newSet;
      });
    } catch (error) {
      toast.error("An error occurred while deleting account");
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
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
      company: "",
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
              <Button className="flex items-center gap-2 pl-[50px]">
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

        {/* Netflix Tab Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setIsNetflixExpanded(!isNetflixExpanded)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-primary">Netflix</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNetflixExpanded(!isNetflixExpanded);
                  }}
                >
                  {isNetflixExpanded ? (
                    <Minus size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {isNetflixExpanded && (
              <CardContent className="pt-0">
                {accounts.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No accounts found. Add your first account above.</p>
                  </div>
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-destructive hover:text-destructive hover:bg-destructive/10 mr-[150px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAccount(account.id, account.email);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
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
                          </div>
                        </CardHeader>
                        
                        {expandedAccounts.has(account.id) && (
                          <CardContent className="pt-0">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium text-muted-foreground">Password:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-background px-2 py-1 rounded border">
                                      {account.email_password}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-8 w-8"
                                      onClick={() => copyToClipboard(account.email_password, "Password")}
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium text-muted-foreground">Card Number:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-background px-2 py-1 rounded border">
                                      {account.card_number}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-8 w-8"
                                      onClick={() => copyToClipboard(account.card_number, "Card Number")}
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium text-muted-foreground">Expire Date:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-background px-2 py-1 rounded border">
                                      {account.expire_date}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-8 w-8"
                                      onClick={() => copyToClipboard(account.expire_date, "Expire Date")}
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium text-muted-foreground">CVC:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-background px-2 py-1 rounded border">
                                      {account.cvc}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-8 w-8"
                                      onClick={() => copyToClipboard(account.cvc, "CVC")}
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium text-muted-foreground">Bank Name:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-background px-2 py-1 rounded border">
                                      {account.bank_name || "Not specified"}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-8 w-8"
                                      onClick={() => copyToClipboard(account.bank_name || "", "Bank Name")}
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <span className="font-medium text-muted-foreground">Owner:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-background px-2 py-1 rounded border">
                                      {account.Owner || "Not specified"}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-8 w-8"
                                      onClick={() => copyToClipboard(account.Owner || "", "Owner")}
                                    >
                                      <Copy size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Store;