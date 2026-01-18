'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthModal from '../AuthModal';
import { toast } from 'react-toastify';
import { useRouter, usePathname } from 'next/navigation';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'SELLER' | 'BUYER';
  createdAt: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      setIsLoggedIn(!!token);

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logout successfully');
    router.push('/');
  };

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsMobileMenuOpen(false), 300);
    }
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  const isActive = (path: string) => pathname === path;

  const showBuyerDashboard = isLoggedIn && user?.role === 'BUYER';
  const showSellerDashboard = isLoggedIn && user?.role === 'SELLER';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Trade Pilot
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-0`}
              >
                Home
              </Link>

              {!isLoggedIn && (
                <>
                  <Link href="/about" 
                  className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-0`}
                  >About Us</Link>
                  <Link href="/contact" className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-0`}>Contact Us</Link>
                </>
              )}

              {showBuyerDashboard && (
                <Link href="/dashboard/buyer" className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-0`}>
                  Buyer Dashboard
                </Link>
              )}

              {showSellerDashboard && (
                <Link href="/dashboard/seller" className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-0`}>
                  Seller Dashboard
                </Link>
              )}

              {isLoggedIn && (
                <Link href="/Profile" className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-0`}>
                  Profile
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isLoggedIn && user && (
              <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
            )}

            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-indigo-600 cursor-pointer">
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthType('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-indigo-600 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthType('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </div>

          <div className="sm:hidden flex items-center text-gray-700">
            <button onClick={toggleMobileMenu}>☰</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/50" onClick={closeMobileMenu}>
          <div
            className="bg-white w-4/5 h-full p-4 text-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
  <button
    onClick={closeMobileMenu}
    className="cursor-pointer text-gray-400 hover:text-gray-600"
    aria-label="Close menu"
  >
    ✕
  </button>
</div>

            <div className="space-y-4 flex flex-col items-start">
              <Link href="/" onClick={closeMobileMenu}>Home</Link>

              {!isLoggedIn && (
                <>
                  <Link href="/about" onClick={closeMobileMenu}>About Us</Link>
                  <Link href="/contact" onClick={closeMobileMenu}>Contact Us</Link>
                </>
              )}

              {showBuyerDashboard && (
                <Link href="/dashboard/buyer" onClick={closeMobileMenu}>
                  Buyer Dashboard
                </Link>
              )}

              {showSellerDashboard && (
                <Link href="/dashboard/seller" onClick={closeMobileMenu}>
                  Seller Dashboard
                </Link>
              )}

              {isLoggedIn && (
                <Link href="/Profile" onClick={closeMobileMenu}>
                  Profile
                </Link>
              )}
            </div>

            <div className="mt-6">
              {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <button onClick={() => { setAuthType('login'); setIsAuthModalOpen(true); }}>
                    Login
                  </button>
                  <button onClick={() => { setAuthType('register'); setIsAuthModalOpen(true); }}>
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        onTypeChange={setAuthType}
      />
    </nav>
  );
}
