// app/(public)/layout.tsx
import Footer from "@/components/client-components/Footer";
import Navbar from "@/components/client-components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
