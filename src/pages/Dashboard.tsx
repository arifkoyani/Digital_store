import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import netflixBg from "@/assets/netflix-bg.png";
import amazonPrimeBg from "@/assets/amazon-prime-bg.png";
import storeBg from "@/assets/store-bg.jpg";

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
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 relative overflow-hidden py-10"
            onClick={handleNetflixClick}
            style={{
              backgroundImage: `url(${netflixBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl text-center text-white">Netflix</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 relative overflow-hidden py-10"
            onClick={handleAmazonClick}
            style={{
              backgroundImage: `url(${amazonPrimeBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-xl text-center text-white">Amazon Prime</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 py-10 relative overflow-hidden"
            onClick={handleStoreClick}
            style={{
              backgroundImage: `url(${storeBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl text-center text-white">Store</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;