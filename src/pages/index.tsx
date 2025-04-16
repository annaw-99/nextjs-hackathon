import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Home() {
  return (
    <div
      className={`font-[family-name:var(--font-geist-sans)] grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-4`}
    >
      <main className="flex flex-col row-start-2 items-center justify-center sm:items-center">
        <h1 className="text-5xl font-bold text-indigo-500 text-center mb-1">HUEY</h1>
        <p className="text-sm text-center mb-4">The easiest way to wait in line.</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link href="/auth/owner">
            <Button className="bg-indigo-400 hover:bg-indigo-500 font-bold cursor-pointer">
              I'm a Restaurant Owner
            </Button>
          </Link>
          <Link href="/restaurants">
            <Button variant="outline" className="font-bold cursor-pointer">
              I'm a Customer
            </Button>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex items-center justify-center">
        <p className="text-[10px]">© 2025 EasiEats. All rights reserved.</p>
      </footer>
    </div>
  )
}