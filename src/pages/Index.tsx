import UserManagement from "@/components/UserManagement";
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <UserManagement />
      <Toaster />
    </div>
  );
};

export default Index;
