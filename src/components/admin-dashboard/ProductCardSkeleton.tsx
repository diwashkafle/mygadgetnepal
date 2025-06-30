import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-xl border p-4 shadow bg-white">
      <Skeleton height={192} className="mb-4 rounded-lg" />
      <Skeleton height={20} width={"75%"} className="mb-2" />
      <Skeleton height={20} width={"50%"} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton height={40} width={96} />
        <Skeleton height={40} width={96} />
      </div>
    </div>
  );
}
