import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { title: "Total Orders", value: "0", icon: "📦" },
  { title: "Total Revenue", value: "NPR 0", icon: "💰" },
  { title: "Page Views", value: "0", icon: "👀" },
  { title: "Cart Items", value: "0", icon: "🛒" },
  { title: "Total Users", value: "0", icon: "👤" },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
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
        ))}
      </div>
    </div>
  );
}
