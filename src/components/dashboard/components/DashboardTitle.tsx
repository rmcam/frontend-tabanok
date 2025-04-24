import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardTitle = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800">¡Bienvenido al Dashboard!</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default DashboardTitle;
