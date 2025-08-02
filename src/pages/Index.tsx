import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserManagement from "@/components/UserManagement";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>
      <UserManagement />
      <Toaster />
    </div>
  );
};

export default Index;
