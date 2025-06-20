import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
           <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold font-headline text-primary">
            Crypto Gazer
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
