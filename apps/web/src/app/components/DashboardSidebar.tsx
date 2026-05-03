'use client';

import { Button } from '@heroui/react';
import { UserTypeEnum } from '@repo/definitions';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useState } from 'react';
import { BiChart, BiBuilding, BiChevronDown, BiCompass, BiHeart, BiLogOut, BiMapPin, BiMessageSquare, BiPackage, BiShield, BiStar, BiTrendingUp } from 'react-icons/bi';
import { FaUser, FaUsers } from 'react-icons/fa';
import { useAuth } from '../lib/auth-context';
import { FaCartShopping } from "react-icons/fa6";
import { FiCompass } from 'react-icons/fi';

export function DashboardSidebar() {

  const { user, userType, logout } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  // console.log("user",user)
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isTraveller = user?.userType === UserTypeEnum.TRAVELLER;
  const isAdmin = user?.userType === UserTypeEnum.ADMIN;

  const travelllerLinks = [
    { href: '/traveller/browse', label: 'Browse Trips', icon: BiCompass },
    { href: '/traveller/bookings', label: 'My Bookings', icon: BiMapPin },
    { href: '/traveller/wishlist', label: 'Wishlist', icon: BiHeart },
    { href: '/traveller/reviews', label: 'My Reviews', icon: BiStar },
     { href: '/traveller/cart', label: 'Cart', icon: FaCartShopping },
    { href: '/traveller/profile', label: 'Profile', icon: FaUser },
  ];

  const agentLinks = [
    { href: '/agent/packages', label: 'Trip Packages', icon: BiPackage },
    { href: '/agent/bookings', label: 'Bookings', icon: BiMapPin },
    { href: '/agent/analytics', label: 'Analytics', icon: BiChart },
    { href: '/agent/reviews', label: 'Reviews', icon: BiMessageSquare },
    { href: '/agent/earnings', label: 'Earnings', icon: BiTrendingUp },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BiShield },
    { href: '/admin/agents', label: 'Agents', icon: BiBuilding },
    { href: '/admin/travellers', label: 'Travellers', icon: FaUsers },
  ];

  const links = isAdmin ? adminLinks : isTraveller ? travelllerLinks : agentLinks;

  return (
    <aside className="hidden bg-(--primary) lg:flex flex-col fixed left-0 top-0 h-screen w-50 bg-card border-r border-(--border) shadow-sm rounded-tr-4xl rounded-br-3xl">
      {/* Logo */}
      <div className="p-4 border-b border-(--border)">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-(--primary) flex items-center justify-center group-hover:scale-105 transition-transform">
            <FiCompass className="text-(--primary-foreground) w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-white">Travel</span>
            <span className="text-xs text-(--primary-foreground)">Junction</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <button
                className={`w-full flex items-center gap-3 my-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-(--primary-foreground) text-(--primary) shadow-sm'
                    : 'text-(--primary-foreground) hover:bg-(--muted)/60'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-(--border)">
        <Button
          onPress={handleLogout}  
        //   variant="outline"
          className="w-full text-(--primary-foreground) flex font-medium justify-center item-center gap-2 hover:bg-(--destructive)/10 hover:text-(--destructive)"
        >
          <BiLogOut className="w-6 h-6" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export function DashboardMobileHeader() {
  const { user, userType, logout } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isTraveller = userType === UserTypeEnum.TRAVELLER;

  const travelllerLinks = [
    { href: '/dashboard/traveller/browse', label: 'Browse Trips', icon: BiCompass },
    { href: '/dashboard/traveller/bookings', label: 'My Bookings', icon: BiMapPin },
    { href: '/dashboard/traveller/wishlist', label: 'Wishlist', icon: BiHeart },
    { href: '/dashboard/traveller/reviews', label: 'My Reviews', icon: BiStar },
    { href: '/dashboard/traveller/profile', label: 'Profile', icon: FaUser },
  ];

  const agentLinks = [
    { href: '/dashboard/agent/packages', label: 'Trip Packages', icon: BiPackage },
    { href: '/dashboard/agent/bookings', label: 'Bookings', icon: BiMapPin },
    { href: '/dashboard/agent/analytics', label: 'Analytics', icon: BiChart },
    { href: '/dashboard/agent/reviews', label: 'Reviews', icon: BiMessageSquare },
    { href: '/dashboard/agent/earnings', label: 'Earnings', icon: BiTrendingUp },
  ];

  const links = isTraveller ? travelllerLinks : agentLinks;

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-(--card) border-b border-(--border) shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BiMapPin className="text-(--primary-foreground) w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-sm text-(--foreground)">Travel</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-(--muted) rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          <BiChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-(--border) bg-(--card) animate-in slide-in-from-top-2">
          <nav className="p-4 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} onClick={() => setIsOpen(false)}>
                  <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-(--primary) text-(--primary-foreground)'
                      : 'text-(--foreground) hover:bg-(--muted)'
                  }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{label}</span>
                  </button>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-(--border)">
              <Button
                onPress={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                // variant="outline"
                className="w-full justify-start gap-2 text-sm"
              >
                <BiLogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
