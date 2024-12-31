import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignInPage } from '@/pages/auth/SignIn';
import { SignUpPage } from '@/pages/auth/SignUp';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHome } from '@/pages/dashboard/Home';
import { MembersPage } from '@/pages/dashboard/Members';
import { SubscriptionsPage } from '@/pages/dashboard/Subscriptions';
import { CheckInsPage } from '@/pages/dashboard/CheckIns';
import { useAuth } from '@/lib/auth';
import { Toaster } from "@/components/ui/toaster";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default function App() {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="checkins" element={<CheckInsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}