import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-pulse">
        <Logo className="text-4xl" />
      </div>
    </div>
  );
}
