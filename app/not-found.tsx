import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <CompassIcon className="h-14 w-14 text-muted-foreground" />
      <h1 className="mt-4 text-4xl font-extrabold">404</h1>
      <p className="mt-2 text-lg font-semibold">Page not found</p>
      <p className="mt-1 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          Go Home
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/gear" />}
        >
          Browse Gear
        </Button>
      </div>
    </div>
  );
}