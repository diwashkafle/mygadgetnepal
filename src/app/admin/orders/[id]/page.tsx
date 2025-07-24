'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
import Image from 'next/image';

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string; // 👈 optional image field
  }[];
  total: number;
  status: string;
  paymentType: string;
  paymentStatus: string;
  createdAt: string;
};

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${id}`);
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
      } catch (err) {
        toast.error('Failed to load order.'+err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status || !order) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/order/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');

      toast.success('Order status updated!');
    } catch (err) {
      toast.error('Failed to update status.'+err);
    } finally {
      setSaving(false);
    }
  };

  // Handler for deleting the order
  const handleDelete = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/order/${order.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Order deleted!');
      // Optionally redirect or reload
      window.location.href = '/admin/orders';
    } catch (err) {
      toast.error('Failed to delete order.' + err);
    }
  };

  if (loading || !order) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order ID: {order.id}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold">Customer</p>
            <p>{order.customer.name}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.address}</p>
          </div>
          <div>
            <p className="font-semibold">Payment</p>
            <p>Type: {order.paymentType}</p>
            <p>Amount: NPR {order.total}</p>
            <p>Date: {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
            <p>Order Status: <Badge variant="outline">{order.status}</Badge></p>
            <p>Payment Status: <Badge variant="outline">{order.paymentStatus}</Badge></p>
            <div className="mt-2">
              <label className="text-sm font-medium">Order Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select value={paymentStatus || "Unpaid"} onValueChange={(val) => setPaymentStatus(val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={saving}
                className="mt-2"
                variant="secondary"
              >
                {saving ? 'Updating...' : 'Save Status'}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="mt-2 ml-2">
                    Delete Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Are you sure you want to permanently delete this order?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-red-600"
                      onClick={handleDelete}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordered Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-cover border"
                          height={50}
                          width={50}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>NPR {item.price}</TableCell>
                  <TableCell>NPR {item.quantity * item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
