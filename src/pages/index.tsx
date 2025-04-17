import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from "next/image"
import { motion } from "framer-motion"
export default function Home() {
  return (
    <div
      className={`font-[family-name:var(--font-geist-sans)] grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen bg-gradient-to-r from-indigo-100 to-white p-2 pb-20 gap-16 sm:p-4`}
    >
      <main className="flex flex-col row-start-2 items-center justify-center sm:items-center">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        >
        <div className="flex justify-center mb-2">
          <Image src="/images/logo.png" alt="HUEY" width={250} height={250}  />
        </div>
        <p className="text-sm font-bold text-indigo-500 text-center">Have u eaten yet?</p>
        <p className="text-sm font-bold text-indigo-500 text-center mb-4">Not yet? We'll hold your spot.</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link href="/restaurants">
            <Button variant="outline" className="bg-indigo-500 text-white hover:bg-indigo-700 hover:text-white font-bold cursor-pointer">
              I'm a foodie
            </Button>
          </Link>
          <Link href="/auth/owner">
            <Button className="bg-indigo-500 text-white hover:bg-indigo-700 font-bold cursor-pointer">
              I run the kitchen
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