"use client"

import { useState } from 'react';
import { useWorkItems, useDeleteWorkItem } from '@/lib/hooks/useWorkItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    MoreVertical,
    Trash2,
    Edit,
    Eye,
    Calendar,
    User,
    Filter
} from 'lucide-react';
import CreateWorkItemModal from './CreateWorkItemModal';
import EditWorkItemModal from './EditWorkItemModal';
import ViewWorkItemModal from './ViewWorkItemModal';
import { WorkItem, WorkItemFilters } from '@/types/workItem';

export default function WorkItemsListComponent() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

    const [filters, setFilters] = useState<WorkItemFilters>({
        search: '',
        status: '',
        priority: '',
    });

    const { data: workItemsData, isLoading } = useWorkItems(filters);
    const deleteWorkItem = useDeleteWorkItem();

    const workItems = workItemsData?.data?.workItems || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this work item?')) {
            try {
                await deleteWorkItem.mutateAsync(id);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleEdit = (item: WorkItem) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const handleView = (item: WorkItem) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">All Work Items</h1>
                            <p className="text-purple-100 mt-1">Manage and track all work items</p>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-white text-purple-600 hover:bg-purple-50"
                        >
                            Create New Item
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <Card className="mb-6 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-purple-600" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search work items..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="pl-10"
                                />
                            </div>

                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters({ ...filters, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.priority}
                                onValueChange={(value) => setFilters({ ...filters, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Priorities</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Work Items Grid */}
                {workItems.length === 0 ? (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="py-12">
                            <p className="text-center text-gray-500">No work items found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {workItems.map((item: WorkItem) => (
                            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {item.description}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleView(item)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        {/* Status and Priority */}
                                        <div className="flex gap-2">
                                            <Badge className={getStatusColor(item.status)}>
                                                {item.status.replace('_', ' ')}
                                            </Badge>
                                            <Badge className={getPriorityColor(item.priority)}>
                                                {item.priority}
                                            </Badge>
                                        </div>

                                        {/* Tags */}
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {item.tags.map((tag: string, index: number) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Creator and Assignee */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {item.createdBy && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Created by</p>
                                                        <p>{item.createdBy.firstName} {item.createdBy.lastName}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {item.assignedTo && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Assigned to</p>
                                                        <p>{item.assignedTo.firstName} {item.assignedTo.lastName}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Due Date */}
                                        {item.dueDate && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>Due: {formatDate(item.dueDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateWorkItemModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            {selectedItem && (
                <>
                    <EditWorkItemModal
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        workItem={selectedItem}
                    />
                    <ViewWorkItemModal
                        open={isViewModalOpen}
                        onOpenChange={setIsViewModalOpen}
                        workItem={selectedItem}
                    />
                </>
            )}
        </div>
    );
}