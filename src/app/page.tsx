import { Marketplace } from "@/components/Marketplace";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Marketplace />
    </div>
  );
}
