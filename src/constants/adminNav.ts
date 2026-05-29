import { LayoutDashboard, Users, MessageSquare } from 'lucide-react';

export const adminSidebarNavItems = [
  { id: 'dashboard', name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'users',     name: 'Users',     path: '/admin/users', icon: Users },
  { id: 'complaints',name: 'Support',   path: '/admin/complaints', icon: MessageSquare },
];
