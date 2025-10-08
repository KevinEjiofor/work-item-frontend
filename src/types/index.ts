export interface User {
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
  role?: string;
  isEmailVerified?: boolean;
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  dueDate?: string;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isActive: boolean;
}

export interface WorkItemStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  assigned?: number;
  created?: number;
  completionRate?: number;
  overdueRate?: number;
}

export interface CreateWorkItemData {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  tags?: string[];
  dueDate?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
