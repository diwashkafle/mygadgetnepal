import { createApiClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileForm from "@/components/client-components/EditProfileForm";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createApiClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  if (params.id !== session.user.id) {
    notFound();
  }

  const user = session.user;
  const fullName = user.user_metadata?.full_name || "";
  const phone = user.user_metadata?.phone || "";
  const isProfileIncomplete = !fullName || !phone;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
          My Profile
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* 🚨 Incomplete profile notice */}
      {isProfileIncomplete && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg p-4 text-sm">
          <strong className="block mb-1">Complete your profile</strong>
          Please add your full name and phone number to continue.
        </div>
      )}

    {/* Account Info Section */}
<div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-medium text-neutral-800">Account Info</h2>
    <EditProfileForm fullName={fullName} phone={phone} />
  </div>

  <div className="text-sm text-neutral-600 space-y-1">
    <p><span className="font-medium text-neutral-700">Email:</span> {user.email}</p>
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


      {/* Tabs: Orders + Favorites */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Products</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <p className="text-sm text-neutral-500">You haven’t placed any orders yet.</p>
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            <p className="text-sm text-neutral-500">You haven’t added any favorites yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
