'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Order = {
  id: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  total: number;
  status: string;
  paymentType: string;
  paymentStatus: string;
  createdAt: string;
};

const statusOptions = ['All', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
const paymentOptions = ['All', 'COD', 'ESEWA', 'KHALTI', 'FONEPAY'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [searchEmail, setSearchEmail] = useState('');
  const [realUserEmails, setRealUserEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/order');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user');
        const users = await res.json();
        setRealUserEmails(new Set(users.map((u: { email: string }) => u.email)));
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const statusMatch = filterStatus === 'All' || order.status === filterStatus;
    const paymentMatch = filterPayment === 'All' || order.paymentType === filterPayment;
    const emailMatch = order.customer.email.toLowerCase().includes(searchEmail.toLowerCase());
    return statusMatch && paymentMatch && emailMatch;
  });

  if (loading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl mb-4">All Orders</CardTitle>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-[200px]">
            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-[200px]">
            <Select value={filterPayment} onValueChange={(val) => setFilterPayment(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentOptions.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-[300px]">
            <Input
              type="text"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-muted-foreground mt-6">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell className="text-sm">{order.customer.email}</TableCell>
                    <TableCell className="text-sm">
                      {realUserEmails.has(order.customer.email) ? "Logged In" : "Guest"}
                    </TableCell>
                    <TableCell className="text-sm">{order.customer.phone}</TableCell>
                    <TableCell className="text-sm">NPR {order.total}</TableCell>
                    <TableCell className="text-sm">{order.paymentType}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button size="sm" variant="secondary">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
