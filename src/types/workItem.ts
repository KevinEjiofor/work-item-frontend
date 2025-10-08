export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface WorkItem {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
    dueDate?: string;
    createdBy?: User;
    assignedTo?: User;
    createdAt: string;
    updatedAt: string;
}

export interface WorkItemFilters {
    search: string;
    status: string;
    priority: string;
}

export interface CreateWorkItemData {
    title: string;
    description: string;
    status: WorkItem['status'];
    priority: WorkItem['priority'];
    tags?: string[];
    dueDate?: string;
    assignedToId?: string;
}

export interface WorkItemsResponse {
    data: {
        workItems: WorkItem[];
        total: number;
        page: number;
        limit: number;
    };
}

export interface WorkItemStats {
    total: number;
    assigned: number;
    created: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
}