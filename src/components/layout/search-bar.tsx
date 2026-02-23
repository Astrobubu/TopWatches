"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-[400px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search 600+ luxury watches..."
        className="h-9 w-full rounded-full border border-input bg-muted/50 pl-9 pr-16 text-sm placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
        readOnly
      />
      <Badge
        variant="outline"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono px-1.5 py-0 h-5 pointer-events-none"
      >
        Ctrl+K
      </Badge>
    </div>
  );
}
