import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function OwnerPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const formatted = [match[1], match[2], match[3]].filter(Boolean).join('-');
      return formatted;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

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

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 to-white p-4 overflow-hidden">
          <div className="mb-6 flex">
            <Image src="/images/logo.png" alt="HUEY" width={150} height={150} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Desktop Access Required</h1>
          <p className="text-gray-600 mb-6 text-center">
            The restaurant management dashboard is optimized for desktop use. Please access this page from a desktop or laptop computer.
          </p>
          <Link href="/">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold">
              Return to Home
            </Button>
          </Link>
      </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[50%] bg-indigo-500 flex flex-col items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <Link href="/" className="text-4xl font-bold mb-1 text-white">
            <Image src="/images/logo-white.png" alt="HUEY" width={100} height={100} className="mb-2" />
          </Link>
          <p className="text-xs text-indigo-100 mb-3">Login or register to get started.</p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setActiveTab('login');
                setRegisterStep(1);
              }}
              className={`w-full cursor-pointer transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-500 hover:bg-gray-200'
                  : 'bg-indigo-400 text-white hover:bg-indigo-600'
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
                  ? 'bg-white text-indigo-500 hover:bg-gray-200'
                  : 'bg-indigo-400 text-white hover:bg-indigo-600'
              }`}
            >
              Register
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[50%] flex items-center justify-center p-8 bg-white"
      >
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
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
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
                    placeholder="Phone Number (Please use a fake number)" 
                    className="w-full" 
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    maxLength={12}
                    required 
                  />
                  <Textarea 
                    placeholder="Jot down hash tags for your restaurant (e.g. #italian #pizza #pasta)" 
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
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
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
                </motion.div>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
