import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useLogin } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, useNavigate, useRouter, useLocation } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import CandidatePortal from './pages/CandidatePortal';
import EmployerPortal from './pages/EmployerPortal';
import AdminPortal from './pages/AdminPortal';
import LandingPage from './pages/LandingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import WhatsAppButton from './components/WhatsAppButton';
import { UserType } from './backend';

// Global state for intended user type during login flow
let intendedUserType: UserType | null = null;

export function setIntendedUserType(type: UserType | null) {
  intendedUserType = type;
}

export function getIntendedUserType(): UserType | null {
  return intendedUserType;
}

function Layout() {
  const location = useLocation();
  const showFooter = location.pathname !== '/';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}

function HomePage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: loginResult, isLoading: loginLoading } = useLogin();
  const { data: isAdmin } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState<'jobs' | 'employers' | 'chat' | 'profile'>('jobs');
  const [setupUserType, setSetupUserType] = useState<UserType | null>(null);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Determine setup user type from login result or intended type
  useEffect(() => {
    if (loginResult && loginResult.needsSetup) {
      // Use intended user type if set, otherwise use login result
      const typeToUse = intendedUserType || loginResult.userType || null;
      setSetupUserType(typeToUse);
    } else if (loginResult && !loginResult.needsSetup && loginResult.success) {
      setSetupUserType(null);
      intendedUserType = null; // Clear intended type after successful setup
    }
  }, [loginResult]);

  // Reset to jobs tab when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab('jobs');
      setSetupUserType(null);
      intendedUserType = null; // Clear intended type on logout
    }
  }, [isAuthenticated]);

  if (isInitializing || (isAuthenticated && (profileLoading || loginLoading))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Career Pulse India...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show profile setup modal if needed
  if (showProfileSetup) {
    return <ProfileSetupModal initialUserType={setupUserType} />;
  }

  // Determine which portal to show based on user type
  if (!userProfile) return null;

  if (userProfile.userType === UserType.candidate) {
    return <CandidatePortal activeTab={activeTab} setActiveTab={setActiveTab} />;
  } else if (userProfile.userType === UserType.employer) {
    return <EmployerPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
  }

  return null;
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsOfServicePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPortal,
});

const routeTree = rootRoute.addChildren([indexRoute, privacyRoute, termsRoute, adminRoute]);

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingMs: 0,
  defaultPendingMinMs: 0,
});

// Declare the router type for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
