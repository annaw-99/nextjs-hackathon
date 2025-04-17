import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div
      className={`font-[family-name:var(--font-geist-sans)] grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen bg-gradient-to-r from-indigo-50 to-white p-2 pb-20 gap-16 sm:p-4`}
    >
      <main className="flex flex-col row-start-2 items-center justify-center sm:items-center">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        >
        <h1 className="text-6xl font-extrabold text-indigo-500 text-center mb-1">HUEY</h1>
        <p className="text-sm font-medium text-center mb-4">The easiest way to wait in line.</p>
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
        </motion.div>
      </main>
      <footer className="row-start-3 flex items-center justify-center">
        <p className="text-gray-500 text-[10px]">© 2025 HUEY. All Rights Reserved.</p>
      </footer>
    </div>
  )
}