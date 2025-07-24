import { notFound, redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileForm from "@/components/client-components/EditProfileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // 🔐 Get user session (server-side)
  const session = await getServerSession(authOptions);

  // 🔐 Redirect if not logged in
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 🔐 Prevent accessing another user's profile
  if (params.id !== session.user.id) {
    notFound();
  }

  // 📦 Fetch user info from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    notFound();
  }

  const fullName = user.name || "";
  const phone = user.phone || "";
  const isProfileIncomplete = !fullName || !phone;

  // 📦 Fetch user's orders (manually filter by customer email in JSON field)
  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  const orders = allOrders.filter((order) => {
    try {
      const parsed = order.customer as { email?: string };
      return parsed?.email === session.user.email;
    } catch {
      return false;
    }
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* ✅ Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
          My Profile
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* ⚠️ Profile Incomplete Notice */}
      {isProfileIncomplete && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg p-4 text-sm">
          <strong className="block mb-1">Complete your profile</strong>
          Please add your full name and phone number to continue.
        </div>
      )}

      {/* 👤 Account Info */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-neutral-800">Account Info</h2>
          <EditProfileForm fullName={fullName} phone={phone} />
        </div>

        <div className="text-sm text-neutral-600 space-y-1">
          <p>
            <span className="font-medium text-neutral-700">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-neutral-700">Full Name:</span>{" "}
            {fullName || <span className="text-red-500">Not provided</span>}
          </p>
          <p>
            <span className="font-medium text-neutral-700">Phone Number:</span>{" "}
            {phone || <span className="text-red-500">Not provided</span>}
          </p>
        </div>
      </div>

      {/* 📦 Tabs for orders/favorites */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Products</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4 space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-neutral-500">You haven’t placed any orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-neutral-200 rounded-lg p-5 bg-neutral-50 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-neutral-700 space-y-1">
                      <p>
                        <span className="font-semibold">Order Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">Total Cost:</span> NPR {order.total}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : order.status === "Paid"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-neutral-100 text-neutral-700 border-neutral-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(() => {
                      try {
                        type ParsedOrder = { items?: { name?: string; image?: string }[] };
                        const items: { image?: string; name?: string }[] =
                          Array.isArray(order.items) ? order.items :
                          typeof order.items === "string" ? JSON.parse(order.items) :
                          Array.isArray((order.items as ParsedOrder)?.items)
                            ? (order.items as ParsedOrder).items
                            : [];
                        return items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-2 rounded shadow-sm">
                            <Image
                              height={50}
                              width={50}
                              src={item?.image || "/placeholder.png"}
                              alt={item?.name || "Product image"}
                              className="w-14 h-14 object-cover rounded"
                            />
                            <p className="text-sm text-neutral-800 font-medium">{item?.name || "Unnamed product"}</p>
                          </div>
                        ));
                      } catch (err) {
                        console.log(err)
                        return <p className="text-red-500">Error loading items for this order.</p>;
                      }
                    })()}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            <p className="text-sm text-neutral-500">
              You haven’t added any favorites yet.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
