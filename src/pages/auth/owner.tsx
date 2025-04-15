import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  return (
    <div className="min-h-screen flex">
      <div className="w-[50%] bg-orange-300 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold">EasiEats</h1>
          <p className="text-xs text-gray-500 mb-3">Login or register to get started.</p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setActiveTab('login');
                setRegisterStep(1);
              }}
              className={`w-full ${
                activeTab === 'login'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-white text-orange-500 hover:bg-neutral-100'
              }`}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setActiveTab('register');
                setRegisterStep(1);
              }}
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

      <div className="w-[50%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {activeTab === 'login' ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
                <p className="text-xs text-gray-400">Enter your email and password to login.</p>
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Register Your Restaurant</h2>
                  <p className="text-xs text-gray-400">Enter your restaurant details to register.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${registerStep === 1 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${registerStep === 2 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                </div>
              </div>

              {registerStep === 1 ? (
                <div className="space-y-4">
                  <Input type="text" placeholder="Restaurant Name" className="w-full" />
                  <Input type="text" placeholder="Phone Number" className="w-full" />
                  <Textarea placeholder="Restaurant Description" className="w-full" />
                  <Button onClick={() => setRegisterStep(2)}
                    className="w-full bg-orange-500 hover:bg-orange-600">
                    Next
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input type="text" placeholder="Street Address" className="w-full" />
                  <div className="flex gap-2">
                    <Input type="text" placeholder="City" className="w-full" />
                    <Input type="text" placeholder="State" className="w-full" />
                  </div>
                  <Input type="email" placeholder="Email" className="w-full" />
                  <Input type="password" placeholder="Password" className="w-full" />
                  <Input type="password" placeholder="Confirm Password" className="w-full" />
                  <div className="flex gap-2">
                    <Button onClick={() => setRegisterStep(1)}
                      className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300">
                      Back
                    </Button>
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                      Register
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}