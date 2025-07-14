// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-600">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
          <p className="text-lg">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  