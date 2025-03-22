
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto py-12 animate-fade-in">
        <Card className="glass overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-neon-purple mb-6" />
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-400 mb-6">Oops! Page not found</p>
            <p className="text-gray-400 mb-8 max-w-md text-center">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex gap-4">
              <Button variant="default" asChild>
                <Link to="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotFound;
