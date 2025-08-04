import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNetflixClick = () => {
    navigate("/netflix");
  };

  const handleAmazonClick = () => {
    navigate("/amazon");
  };

  const handleStoreClick = () => {
    navigate("/store");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">User Management System</h1>
          <p className="text-muted-foreground">Manage your users efficiently</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={handleNetflixClick}
          >
            <CardHeader>
              <CardTitle className="text-xl text-center">Netflix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-20">
                <p className="text-muted-foreground">Click to manage Netflix users</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={handleAmazonClick}
          >
            <CardHeader>
              <CardTitle className="text-xl text-center">Amazon Prime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-20">
                <p className="text-muted-foreground">Click to manage Amazon Prime users</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={handleStoreClick}
          >
            <CardHeader>
              <CardTitle className="text-xl text-center">Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-20">
                <p className="text-muted-foreground">Click to access store</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;