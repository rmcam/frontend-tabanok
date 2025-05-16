import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardTitle = () => {
  return (
    <Card className="bg-tabanok-violeta-claro">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-morado-oscuro">¡Bienvenido al Dashboard!</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default DashboardTitle;
