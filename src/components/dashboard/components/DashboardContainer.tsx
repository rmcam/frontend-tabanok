import React from 'react';

interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-br from-blue-200 to-green-100 rounded-lg shadow-xl p-8">
      {children}
    </div>
  );
};

export default DashboardContainer;
