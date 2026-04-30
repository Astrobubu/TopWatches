"use client"

import { Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TrustSection() {
  return (
    <section className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Card className="text-center max-w-sm">
            <CardContent className="pt-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Shield className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-medium mb-1">Authenticated</h3>
              <p className="text-sm text-muted-foreground">Every watch is verified by certified watchmakers before listing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
