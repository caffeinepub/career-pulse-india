import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Shield, User, Menu } from 'lucide-react';
import { UserType } from '../backend';
import { setIntendedUserType } from '../App';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function Header() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleLogoClick = () => {
    navigate({ to: '/' }).catch(() => {
      window.location.href = '/';
    });
  };

  const handleLogout = async () => {
    try {
      await clear();
      queryClient.clear();
      setIntendedUserType(null);
      router.invalidate();
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleDashboardClick = () => {
    navigate({ to: '/' }).catch(() => {
      window.location.href = '/';
    });
  };

  const handleAdminClick = () => {
    navigate({ to: '/admin' }).catch(() => {
      window.location.href = '/admin';
    });
  };

  const handleSmoothScroll = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserTypeLabel = (userType: UserType) => {
    return userType === UserType.candidate ? 'Candidate' : 'Employer';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#112629]/20 bg-[#112629] shadow-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
          aria-label="Go to Career Pulse India home page"
        >
          <img 
            src="/assets/CPI FINAL LOGO.png" 
            alt="Career Pulse India Logo" 
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain flex-shrink-0" 
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-bold leading-tight bg-gradient-to-r from-[#FF9800] to-[#FFA726] bg-clip-text text-transparent">
              Career Pulse India
            </h1>
            <p className="text-xs sm:text-sm leading-tight text-white font-medium">
              Bridging Talent to Top Jobs
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleSmoothScroll('home')}
            className="text-base font-bold text-white hover:text-[#FF9800] transition-colors tracking-wide"
          >
            Home
          </button>
          <button
            onClick={() => handleSmoothScroll('about')}
            className="text-base font-bold text-white hover:text-[#FF9800] transition-colors tracking-wide"
          >
            About
          </button>
          <button
            onClick={() => handleSmoothScroll('services')}
            className="text-base font-bold text-white hover:text-[#FF9800] transition-colors tracking-wide"
          >
            Services
          </button>
          <button
            onClick={() => handleSmoothScroll('contact')}
            className="text-base font-bold text-white hover:text-[#FF9800] transition-colors tracking-wide"
          >
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:text-[#FF9800] hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-[#112629] text-white border-[#112629]">
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => handleSmoothScroll('home')}
                  className="text-left text-lg font-bold text-white hover:text-[#FF9800] transition-colors py-2 tracking-wide"
                >
                  Home
                </button>
                <button
                  onClick={() => handleSmoothScroll('about')}
                  className="text-left text-lg font-bold text-white hover:text-[#FF9800] transition-colors py-2 tracking-wide"
                >
                  About
                </button>
                <button
                  onClick={() => handleSmoothScroll('services')}
                  className="text-left text-lg font-bold text-white hover:text-[#FF9800] transition-colors py-2 tracking-wide"
                >
                  Services
                </button>
                <button
                  onClick={() => handleSmoothScroll('contact')}
                  className="text-left text-lg font-bold text-white hover:text-[#FF9800] transition-colors py-2 tracking-wide"
                >
                  Contact
                </button>
                {isAuthenticated && userProfile && (
                  <>
                    <div className="border-t border-white/20 my-2" />
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleDashboardClick();
                      }}
                      className="text-left text-base font-semibold text-white hover:text-[#FF9800] transition-colors py-2"
                    >
                      Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleAdminClick();
                        }}
                        className="text-left text-base font-semibold text-[#FF9800] hover:text-[#FFA726] transition-colors py-2"
                      >
                        Admin Portal
                      </button>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {isAuthenticated && userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8 border-2 border-[#FF9800]/40">
                    <AvatarFallback className="bg-gradient-to-br from-[#FF9800] to-[#FFA726] text-white text-xs font-semibold">
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold leading-none text-white">{userProfile.name}</span>
                    <span className="text-xs text-white/70 font-medium">
                      {getUserTypeLabel(userProfile.userType)}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-[#112629]/20">
                <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleAdminClick} 
                      className="cursor-pointer text-[#FF9800]"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Portal</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
