import { Suspense } from "react"
import UsersPageContent from "@/components/page-content"

export default function Home() {
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  )
}
