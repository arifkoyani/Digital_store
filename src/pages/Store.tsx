import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Store = () => {
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
      <div className="p-8">
        <h1 className="text-2xl font-bold">Store</h1>
        <p className="text-muted-foreground mt-2">Welcome to the store page</p>
      </div>
    </div>
  );
};

export default Store;