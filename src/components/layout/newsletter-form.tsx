"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="email"
        placeholder="Your email"
        className="h-9 flex-1"
      />
      <Button type="submit" size="sm" className="shrink-0">
        Subscribe
      </Button>
    </form>
  );
}
