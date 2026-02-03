import { Suspense } from "react"
import { PaymentClient } from "./payment-client"

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment…</div>}>
      <PaymentClient />
    </Suspense>
  )
}
