import UserManagement from "@/components/UserManagement";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Netflix = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/");
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
      <UserManagement />
      <Toaster />
    </div>
  );
};

export default Netflix;