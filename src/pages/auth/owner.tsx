import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [restaurantName, setRestaurantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');
  const [regError, setRegError] = useState('');

  // login submission handler
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn('credentials', { email: loginEmail, password: loginPassword, callbackUrl: '/admin' });
  };

  // registration submission handler
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegMessage('');
    setRegError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName,
          phoneNumber,
          description,
          address,
          city,
          state: stateValue,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || 'Registration failed');
      } else {
        signIn("credentials", { 
          email, 
          password, 
          callbackUrl: "/admin" 
        });
      }
    } catch (error: any) {
      setRegError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-[50%] bg-indigo-300 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-4xl font-bold mb-1">
            HUEY
          </Link>
          <p className="text-xs text-gray-500 mb-3">Login or register to get started.</p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setActiveTab('login');
                setRegisterStep(1);
              }}
              className={`w-full cursor-pointer transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-white text-indigo-500 hover:bg-neutral-100'
              }`}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setActiveTab('register');
                setRegisterStep(1);
              }}
              className={`w-full cursor-pointer transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-white text-indigo-500 hover:bg-neutral-100'
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
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
                <p className="text-xs text-gray-400">Enter your email and password to login.</p>
              </div>
              <div className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
                <Button type="submit" className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 transition-all duration-300">
                  Login
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Register Your Restaurant</h2>
                  <p className="text-xs text-gray-400">Enter your restaurant details to register.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${registerStep === 1 ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${registerStep === 2 ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                </div>
              </div>

              {registerStep === 1 ? (
                <div className="space-y-4">
                  <Input 
                    type="text" 
                    placeholder="Restaurant Name" 
                    className="w-full" 
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required 
                  />
                  <Input 
                    type="text" 
                    placeholder="Phone Number" 
                    className="w-full" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required 
                  />
                  <Textarea 
                    placeholder="Jot down hash tags for your restaurant (e.g. #Italian #Pizza #Pasta)" 
                    className="w-full" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                  />
                  <Button 
                    onClick={() => setRegisterStep(2)}
                    type="button"
                    className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 transition-all duration-300"
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input 
                    type="text" 
                    placeholder="Street Address" 
                    className="w-full" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                  />
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="City" 
                      className="w-full" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required 
                    />
                    <Input 
                      type="text" 
                      placeholder="State" 
                      className="w-full" 
                      value={stateValue}
                      onChange={(e) => setStateValue(e.target.value)}
                      required 
                    />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <Input 
                    type="password" 
                    placeholder="Confirm Password" 
                    className="w-full" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                  {regError && <p className="text-red-500 text-sm">{regError}</p>}
                  {regMessage && <p className="text-green-500 text-sm">{regMessage}</p>}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setRegisterStep(1)}
                      type="button"
                      className="flex-1 cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 cursor-pointer bg-indigo-500 hover:bg-indigo-600 transition-all duration-300">
                      Register
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
