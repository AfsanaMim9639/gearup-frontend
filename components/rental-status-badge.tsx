import { Badge } from "@/components/ui/badge";
import { RentalStatus } from "@/types/rental";

const statusStyles: Record<RentalStatus, string> = {
  PLACED: "bg-yellow-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  PAID: "bg-purple-500 text-white",
  PICKED_UP: "bg-green-500 text-white",
  RETURNED: "bg-gray-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}