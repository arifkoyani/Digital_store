import UserManagement from "@/components/UserManagement";
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">User Management System</h1>
          <p className="text-muted-foreground">Manage your users efficiently</p>
        </div>
      </div>
      <UserManagement />
      <Toaster />
    </div>
  );
};

export default Index;
