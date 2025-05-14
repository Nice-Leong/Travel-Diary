import React from 'react';
import TravelogList from '../components/TravelogList';
import { useAuth } from '../context/AuthContext';

const Travelogs = () => {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: 24 }}>
      <h2>游记审核管理</h2>
      <TravelogList userRole={user?.role} />
    </div>
  );
};

export default Travelogs;