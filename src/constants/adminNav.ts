import { LayoutDashboard, Users, MessageSquare, Calendar } from 'lucide-react';

export const adminSidebarNavItems = [
  { id: 'dashboard', name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'users',     name: 'Users',     path: '/admin/users', icon: Users },
  { id: 'bookings', name: 'Bookings', path: '/admin/bookings', icon: Calendar },
  { id: 'complaints',name: 'Support',   path: '/admin/complaints', icon: MessageSquare },
];
