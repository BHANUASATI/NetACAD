import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthPage } from '../components/auth/AuthPage';
import { StudentDashboard } from './StudentDashboard';
import AdminDashboard from '../components/AdminDashboard';
import FacultyDashboardNew from '../components/FacultyDashboardNew';
import RegistrarDashboard from '../components/RegistrarDashboard';
import FacultyLogin from '../components/FacultyLogin';

export const AppRoutes: React.FC = () => {
  const { state } = useApp();
  const { isAuthenticated, isFaculty, currentUser, isInitializing } = state;
  const [userType, setUserType] = useState<'faculty' | 'registrar' | null>(null);

  // Show loading screen while initializing authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Check if user is admin (for demo, we'll check email)
  const isAdmin = currentUser?.email?.includes('admin') || (currentUser && 'role' in currentUser && currentUser.role === 'admin') || false;
  
  // Check if user is faculty or registrar based on email or role
  const isRegistrar = currentUser?.email?.toLowerCase().includes('registrar') || false;
  const isStaff = currentUser?.email?.toLowerCase().includes('staff') || (currentUser && 'role' in currentUser && currentUser.role === 'faculty') || false;

  // Show appropriate dashboard based on user role
  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isRegistrar) {
    return <RegistrarDashboard />;
  }

  if (isStaff && isFaculty) {
    return <FacultyDashboardNew />;
  }

  return <StudentDashboard />;
};
