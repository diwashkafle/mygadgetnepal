import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [orders, users] = await Promise.all([
    prisma.order.findMany(),
    prisma.user.findMany(),
  ]);

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalUsers = users.length;

  const metrics = [
    { title: "Total Orders", value: totalOrders.toString(), icon: "📦", link:"/admin/orders" },
    { title: "Total Revenue", value: `NPR ${totalRevenue}`, icon: "💰" },
    { title: "Page Views", value: "0", icon: "👀" },
    { title: "Cart Items", value: "0", icon: "🛒" },
    { title: "Total Users", value: totalUsers.toString(), icon: "👤", link: "/admin/users" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) =>
          metric.link ? (
            <Link className="cursor-pointer" href={metric.link} key={idx}>
              <Card className="shadow-sm border border-neutral-200">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
                    {metric.title}
                    <span className="text-lg">{metric.icon}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card key={idx} className="shadow-sm border border-neutral-200">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
                  {metric.title}
                  <span className="text-lg">{metric.icon}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
