import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex">
      <div className="w-[50%] bg-orange-300 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold">EasiEats</h1>
          <p className="text-sm text-gray-600 mb-3">Login or register to get started.</p>
          <div className="space-y-3">
            <Button
              onClick={() => setActiveTab('login')}
              className={`w-full ${
                activeTab === 'login'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-white text-orange-500 hover:bg-neutral-100'
              }`}
            >
              Login
            </Button>
            <Button
              onClick={() => setActiveTab('register')}
              className={`w-full ${
                activeTab === 'register'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-white text-orange-500 hover:bg-neutral-100'
              }`}
            >
              Register
            </Button>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {activeTab === 'login' ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
                <p className="text-sm text-gray-500">Enter your email and password to login.</p>
              </div>
              <div className="space-y-3">
                <Input type="email" placeholder="Email" className="w-full" />
                <Input type="password" placeholder="Password" className="w-full" />
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Login
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">Register Your Restaurant</h2>
                <p className="text-sm text-gray-500">Enter your restaurant name, address, and description to register.</p>
              </div>
              <div className="space-y-3">
                <Input type="text" placeholder="Restaurant Name" className="w-full" />
                <Input type="text" placeholder="Address" className="w-full" />
                <Input type="text" placeholder="Restaurant Description" className="w-full" />
                <Input type="email" placeholder="Email" className="w-full" />
                <Input type="password" placeholder="Password" className="w-full" />
                <Input type="password" placeholder="Confirm Password" className="w-full" />
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Register
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}