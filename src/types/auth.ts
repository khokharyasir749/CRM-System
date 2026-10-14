export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  department: string;
}

export const PRECONFIGURED_USERS: Record<UserRole, AuthUser & { password: string }> = {
  admin: {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@regularsalon.pk',
    password: 'admin123',
    role: 'admin',
    roleTitle: 'Administrator / Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Salon Management & Operations',
  },
  staff: {
    id: 'user-staff',
    name: 'Ayesha Khan',
    email: 'staff@regularsalon.pk',
    password: 'staff123',
    role: 'staff',
    roleTitle: 'Senior Stylist / Staff',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Hair Care & Bridal Suite',
  },
};
