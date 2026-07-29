import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-primary">GearUp 🏋️</h1>
      <p className="text-muted-foreground">Rent Sports & Outdoor Gear Instantly</p>
      <Button>Get Started</Button>
      <Button variant="outline">Browse Gear</Button>
    </main>
  );
}