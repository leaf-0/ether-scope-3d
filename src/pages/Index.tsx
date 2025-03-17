
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically redirect to the dashboard
    // This is just a placeholder - in a real app, you might
    // want to check auth status first
    navigate('/dashboard');
  }, [navigate]);
  
  return <Dashboard />;
};

export default Index;
