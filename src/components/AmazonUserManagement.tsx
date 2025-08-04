import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Trash2, Users, Calendar as CalendarIcon, Timer, Mail, User, Copy, Plus, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscription_start: string;
  subscription_end: string;
  total_days: number;
  used_days: number;
  status: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  subscription_start: Date | undefined;
  subscription_end: Date | undefined;
  stored_email: string;
}


const UserFormFields = ({ 
  formData, 
  setFormData, 
  isValid, 
  onSubmit, 
  submitText,
  onReset,
  accounts 
}: { 
  formData: UserFormData; 
  setFormData: (data: UserFormData) => void; 
  isValid: boolean;
  onSubmit: () => void;
  submitText: string;
  onReset: () => void;
  accounts: any[];
}) => (
  <div className="grid gap-6 py-4">
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-medium">
          Select Stored Email
        </Label>
        <div className="col-span-3">
          <Select 
            value={formData.stored_email} 
            onValueChange={(value) => setFormData({...formData, stored_email: value})}
          >
            <SelectTrigger className="w-full bg-background border-input">
              <SelectValue placeholder="Select a stored email" />
            </SelectTrigger>
            <SelectContent className="bg-background border-input shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {accounts.length > 0 ? (
                accounts.map((account, index) => (
                  <SelectItem key={account.id || index} value={account.email} className="cursor-pointer hover:bg-accent">
                    {account.email}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled className="text-muted-foreground">
                  No stored emails available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right font-medium">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="col-span-3"
          placeholder="Enter full name"
          required
        />
      </div>
      
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right font-medium">
          Phone <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="col-span-3"
          placeholder="Enter phone number"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-medium">
          Start Date <span className="text-destructive">*</span>
        </Label>
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.subscription_start && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.subscription_start ? format(formData.subscription_start, "PPP") : <span>Pick start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.subscription_start}
                onSelect={(date) => setFormData({ ...formData, subscription_start: date })}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-medium">
          End Date <span className="text-destructive">*</span>
        </Label>
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.subscription_end && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.subscription_end ? format(formData.subscription_end, "PPP") : <span>Pick end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.subscription_end}
                onSelect={(date) => setFormData({ ...formData, subscription_end: date })}
                initialFocus
                disabled={(date) => formData.subscription_start ? date < formData.subscription_start : false}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
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


const AmazonUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPassword, setEditingPassword] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [addFormData, setAddFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    subscription_start: undefined,
    subscription_end: undefined,
    stored_email: "",
  });
  const [editFormData, setEditFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    subscription_start: undefined,
    subscription_end: undefined,
    stored_email: "",
  });

  // Calculate days between two dates
  const calculateDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate used days from start date to current date
  const calculateUsedDays = (startDate: string | Date): number => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const current = new Date();
    const diffTime = current.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Calculate status based on used_days and total_days
  const calculateStatus = (usedDays: number, totalDays: number): string => {
    return usedDays > totalDays ? "expired" : "active";
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        toast.error("Failed to fetch users");
        return;
      }

      // Update days and status for each user based on dates
      const usersWithCalculatedData = data.map(user => {
        const totalDays = calculateDaysBetween(user.subscription_start, user.subscription_end);
        const usedDays = calculateUsedDays(user.subscription_start);
        const status = calculateStatus(usedDays, totalDays);
        
        return {
          ...user,
          total_days: totalDays,
          used_days: usedDays,
          status: status
        };
      });

      setUsers(usersWithCalculatedData || []);
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all accounts from amazon table
  const fetchAccounts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('amazon')
        .select('*')
        .order('email');
      
      if (error) {
        toast.error("Failed to fetch Amazon accounts");
        return;
      }
      
      setAccounts(data || []);
    } catch (error) {
      toast.error("An unexpected error occurred while fetching Amazon accounts");
    }
  };

  // Add new user
  const addUser = async () => {
    try {
      if (!addFormData.subscription_start || !addFormData.subscription_end) {
        toast.error("Please select both start and end dates");
        return;
      }

      // Check if stored email is selected and validate usage count
      if (addFormData.stored_email) {
        const selectedAccount = accounts.find(account => account.email === addFormData.stored_email);
        if (selectedAccount) {
          const currentUsage = selectedAccount.count_usage || 0;
          if (currentUsage >= 10) {
            toast.error("Email usage is full");
            return;
          }
        }
      }

      const totalDays = calculateDaysBetween(addFormData.subscription_start, addFormData.subscription_end);
      const usedDays = calculateUsedDays(addFormData.subscription_start);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: addFormData.name,
            email: addFormData.stored_email,
            phone: addFormData.phone,
            subscription_start: format(addFormData.subscription_start, 'yyyy-MM-dd'),
            subscription_end: format(addFormData.subscription_end, 'yyyy-MM-dd'),
            total_days: totalDays,
            used_days: usedDays,
          },
        ])
        .select();

      if (error) {
        toast.error(error.message);
        return;
      }

      // If user was added successfully and stored email was selected, increment usage count
      if (addFormData.stored_email) {
        const selectedAccount = accounts.find(account => account.email === addFormData.stored_email);
        if (selectedAccount) {
          const newUsageCount = (selectedAccount.count_usage || 0) + 1;
          
          const { error: updateError } = await (supabase as any)
            .from('amazon')
            .update({ count_usage: newUsageCount })
            .eq('email', addFormData.stored_email);

          if (updateError) {
            console.error("Failed to update usage count:", updateError);
          } else {
            // Refresh accounts data to reflect updated usage count
            fetchAccounts();
          }
        }
      }

      toast.success("User added successfully");
      setIsAddDialogOpen(false);
      resetAddForm();
      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Update user
  const updateUser = async () => {
    if (!editingUser) return;

    try {
      if (!editFormData.subscription_start || !editFormData.subscription_end) {
        toast.error("Please select both start and end dates");
        return;
      }

      const totalDays = calculateDaysBetween(editFormData.subscription_start, editFormData.subscription_end);
      const usedDays = calculateUsedDays(editFormData.subscription_start);

      const { error } = await supabase
        .from('users')
        .update({
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          subscription_start: format(editFormData.subscription_start, 'yyyy-MM-dd'),
          subscription_end: format(editFormData.subscription_end, 'yyyy-MM-dd'),
          total_days: totalDays,
          used_days: usedDays,
        })
        .eq('id', editingUser.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetEditForm();
      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      // First, get the user data to find the associated email
      const { data: userData, error: getUserError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (getUserError) {
        toast.error("Failed to get user data");
        return;
      }

      // Delete the user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        toast.error(error.message);
        return;
      }

      // If user was deleted successfully and has an associated email, decrease usage count
      if (userData?.email) {
        const associatedAccount = accounts.find(account => account.email === userData.email);
        if (associatedAccount && associatedAccount.count_usage > 0) {
          const newUsageCount = (associatedAccount.count_usage || 1) - 1;
          
          const { error: updateError } = await (supabase as any)
            .from('amazon')
            .update({ count_usage: newUsageCount })
            .eq('email', userData.email);

          if (updateError) {
            console.error("Failed to update usage count:", updateError);
          } else {
            // Refresh accounts data to reflect updated usage count
            fetchAccounts();
          }
        }
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Update account password
  const updateAccountPassword = async (email: string, newPassword: string) => {
    try {
      const { error } = await supabase
        .from('amazon')
        .update({ email_password: newPassword })
        .eq('email', email);

      if (error) {
        toast.error("Failed to update password");
        return;
      }

      // Update local state
      const updatedAccounts = accounts.map(acc => 
        acc.email === email 
          ? { ...acc, email_password: newPassword }
          : acc
      );
      setAccounts(updatedAccounts);

      toast.success("Password updated successfully");
      setEditingPassword(null);
      setTempPassword("");
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Reset add form
  const resetAddForm = () => {
    setAddFormData({
      name: "",
      email: "",
      phone: "",
      subscription_start: undefined,
      subscription_end: undefined,
      stored_email: "",
    });
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      subscription_start: undefined,
      subscription_end: undefined,
      stored_email: "",
    });
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      subscription_start: user.subscription_start ? new Date(user.subscription_start) : undefined,
      subscription_end: user.subscription_end ? new Date(user.subscription_end) : undefined,
      stored_email: "",
    });
    setIsEditDialogOpen(true);
  };

  // Check if add form is valid
  const isAddFormValid = () => {
    return addFormData.name.trim() !== "" &&
           addFormData.phone.trim() !== "" &&
           addFormData.subscription_start !== undefined &&
           addFormData.subscription_end !== undefined &&
           addFormData.stored_email.trim() !== "";
  };

  // Check if edit form is valid
  const isEditFormValid = () => {
    return editFormData.name.trim() !== "" &&
           editFormData.email.trim() !== "" &&
           editFormData.phone.trim() !== "" &&
           editFormData.subscription_start !== undefined &&
           editFormData.subscription_end !== undefined;
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    } else {
      return <Badge variant="destructive">Expired</Badge>;
    }
  };

  // Group users by email
  const groupedUsers = users.reduce((groups, user) => {
    const email = user.email || "No Email";
    if (!groups[email]) {
      groups[email] = [];
    }
    groups[email].push(user);
    return groups;
  }, {} as Record<string, User[]>);

  useEffect(() => {
    fetchUsers();
    fetchAccounts();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Amazon Prime Management</h1>
        <p className="text-muted-foreground mt-2">Manage Amazon Prime users and their subscriptions</p>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new Amazon Prime user. Total days and used days will be calculated automatically based on subscription dates.
            </DialogDescription>
          </DialogHeader>
          <UserFormFields
            formData={addFormData}
            setFormData={setAddFormData}
            isValid={isAddFormValid()}
            onSubmit={addUser}
            submitText="Add User"
            onReset={resetAddForm}
            accounts={accounts}
          />
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {users.filter(user => user.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Users</CardTitle>
            <Timer className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {users.filter(user => user.status === "expired").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Status Bar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stored Emails</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{accounts.length}</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <div key={account.id || index} className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                  {account.email}: usage: {account.count_usage || 0}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No emails stored</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? `Update information for ${editingUser.name}. Total days and used days will be calculated automatically.`
                : "Select a user from the table below to edit their information."
              }
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserFormFields
              formData={editFormData}
              setFormData={setEditFormData}
              isValid={isEditFormValid()}
              onSubmit={updateUser}
              submitText="Update User"
              onReset={resetEditForm}
              accounts={accounts}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Users List - Grouped by Email */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            All registered Amazon Prime users with their subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">No users found</div>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedUsers).map(([email, emailUsers]) => (
                <AccordionItem key={email} value={email} className="border rounded-lg mb-2">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{email}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant="default" className="bg-success text-success-foreground">
                          {emailUsers.filter(user => user.status === "active").length} active
                        </Badge>
                        {emailUsers.filter(user => user.status === "expired").length > 0 && (
                          <Badge variant="destructive">
                            {emailUsers.filter(user => user.status === "expired").length} expired
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {/* Password Section - Compact View */}
                    <div className="mb-4 p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <Label className="font-medium min-w-[80px]">
                          Password:
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentPassword = accounts.find(acc => acc.email === email)?.email_password || '';
                            setTempPassword(currentPassword);
                            setEditingPassword(email);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border flex-1">
                            {accounts.find(acc => acc.email === email)?.email_password || 'No password'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(accounts.find(acc => acc.email === email)?.email_password || '')}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Password Edit Modal */}
                    <Dialog open={editingPassword === email} onOpenChange={(open) => !open && setEditingPassword(null)}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Password</DialogTitle>
                          <DialogDescription>
                            Update the password for {email}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="password-input">Password</Label>
                            <Input
                              id="password-input"
                              type="text"
                              value={tempPassword}
                              onChange={(e) => setTempPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingPassword(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => updateAccountPassword(email, tempPassword)}
                            disabled={!tempPassword.trim()}
                          >
                            Update Password
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Total Days</TableHead>
                            <TableHead>Used Days</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {emailUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  {user.name || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(user.phone)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  {user.phone || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>{user.subscription_start || "N/A"}</TableCell>
                              <TableCell>{user.subscription_end || "N/A"}</TableCell>
                              <TableCell>{user.total_days || 0}</TableCell>
                              <TableCell>{user.used_days || 0}</TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModal(user)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete the user "{user.name}" and all associated data.
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteUser(user.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmazonUserManagement;