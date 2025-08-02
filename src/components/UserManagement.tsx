import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users, Calendar, Timer, Mail, Phone, User } from "lucide-react";

interface User {
  id: number;
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
  subscription_start: string;
  subscription_end: string;
  total_days: string;
  used_days: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    subscription_start: "",
    subscription_end: "",
    total_days: "",
    used_days: "0",
  });

  // Calculate days between two dates
  const calculateDaysBetween = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate used days from start date to current date
  const calculateUsedDays = (startDate: string): number => {
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
        const status = calculateStatus(usedDays, user.total_days || totalDays);
        
        return {
          ...user,
          total_days: user.total_days || totalDays, // Use custom total_days if set, otherwise calculated
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

  // Add new user
  const addUser = async () => {
    try {
      const calculatedTotalDays = calculateDaysBetween(formData.subscription_start, formData.subscription_end);
      const totalDaysToStore = parseInt(formData.total_days) || calculatedTotalDays;
      const usedDaysToStore = calculateUsedDays(formData.subscription_start);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subscription_start: formData.subscription_start,
            subscription_end: formData.subscription_end,
            total_days: totalDaysToStore,
            used_days: usedDaysToStore,
          },
        ])
        .select();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("User added successfully");

      setIsAddDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Update user
  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const calculatedTotalDays = calculateDaysBetween(formData.subscription_start, formData.subscription_end);
      const totalDaysToStore = parseInt(formData.total_days) || calculatedTotalDays;
      const usedDaysToStore = calculateUsedDays(formData.subscription_start);

      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subscription_start: formData.subscription_start,
          subscription_end: formData.subscription_end,
          total_days: totalDaysToStore,
          used_days: usedDaysToStore,
        })
        .eq('id', editingUser.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("User updated successfully");

      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Delete user
  const deleteUser = async (userId: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("User deleted successfully");

      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subscription_start: "",
      subscription_end: "",
      total_days: "",
      used_days: "0",
    });
  };

  // Open edit dialog
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      subscription_start: user.subscription_start || "",
      subscription_end: user.subscription_end || "",
      total_days: user.total_days?.toString() || "",
      used_days: user.used_days?.toString() || "0",
    });
    setIsEditDialogOpen(true);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>;
    } else {
      return <Badge variant="destructive">Expired</Badge>;
    }
  };

  const UserForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="col-span-3"
          placeholder="Enter full name"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="col-span-3"
          placeholder="Enter email address"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="col-span-3"
          placeholder="Enter phone number"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subscription_start" className="text-right">
          Start Date
        </Label>
        <Input
          id="subscription_start"
          type="date"
          value={formData.subscription_start}
          onChange={(e) => setFormData({ ...formData, subscription_start: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subscription_end" className="text-right">
          End Date
        </Label>
        <Input
          id="subscription_end"
          type="date"
          value={formData.subscription_end}
          onChange={(e) => setFormData({ ...formData, subscription_end: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total_days" className="text-right">
          Total Days
        </Label>
        <Input
          id="total_days"
          type="number"
          value={formData.total_days}
          onChange={(e) => setFormData({ ...formData, total_days: e.target.value })}
          className="col-span-3"
          placeholder="Enter total subscription days"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="used_days" className="text-right">
          Used Days
        </Label>
        <Input
          id="used_days"
          type="number"
          value={formData.used_days}
          onChange={(e) => setFormData({ ...formData, used_days: e.target.value })}
          className="col-span-3"
          placeholder="Enter used days"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitText}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user subscriptions and track their status
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user with subscription details.
              </DialogDescription>
            </DialogHeader>
            <UserForm onSubmit={addUser} submitText="Add User" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            All registered users with their subscription details
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {user.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
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
                            onClick={() => openEditDialog(user)}
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
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and subscription details.
            </DialogDescription>
          </DialogHeader>
          <UserForm onSubmit={updateUser} submitText="Update User" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;