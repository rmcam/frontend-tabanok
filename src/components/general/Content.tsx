import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

const Content: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-4">Content</h2>
      <Tabs defaultValue="overview" className="w-[800px]">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Active users this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Sales</CardTitle>
                <CardDescription>Total sales this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$50,000</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>New orders this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,678</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Chart</CardTitle>
                <CardDescription>Monthly Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for chart */}
                <div className="h-32 bg-gray-100 rounded-md"></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-10-26</TableCell>
                <TableCell>Subscription payment</TableCell>
                <TableCell>$10.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-10-25</TableCell>
                <TableCell>Product purchase</TableCell>
                <TableCell>$20.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-10-24</TableCell>
                <TableCell>Ad revenue</TableCell>
                <TableCell>$30.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Content;
