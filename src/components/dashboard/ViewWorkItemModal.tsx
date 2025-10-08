"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, User, Clock, Tag } from 'lucide-react';

interface ViewWorkItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workItem: any;
}

export default function ViewWorkItemModal({ open, onOpenChange, workItem }: ViewWorkItemModalProps) {
    if (!workItem) return null;

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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {workItem.title}
                    </DialogTitle>
                    <DialogDescription>
                        Work Item Details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status and Priority */}
                    <div className="flex gap-2">
                        <Badge className={`${getStatusColor(workItem.status)} px-3 py-1`}>
                            {workItem.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={`${getPriorityColor(workItem.priority)} px-3 py-1`}>
                            {workItem.priority.toUpperCase()}
                        </Badge>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{workItem.description}</p>
                    </div>

                    {/* Tags */}
                    {workItem.tags && workItem.tags.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {workItem.tags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* People */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workItem.createdBy && (
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Created By</span>
                                </div>
                                <p className="text-gray-900 font-semibold">
                                    {workItem.createdBy.firstName} {workItem.createdBy.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{workItem.createdBy.email}</p>
                            </div>
                        )}

                        {workItem.assignedTo && (
                            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Assigned To</span>
                                </div>
                                <p className="text-gray-900 font-semibold">
                                    {workItem.assignedTo.firstName} {workItem.assignedTo.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{workItem.assignedTo.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="space-y-3">
                        {workItem.dueDate && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 w-32">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Due Date:</span>
                                </div>
                                <span className="text-gray-900">{formatDate(workItem.dueDate)}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 w-32">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">Created:</span>
                            </div>
                            <span className="text-gray-900">{formatDateTime(workItem.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 w-32">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">Updated:</span>
                            </div>
                            <span className="text-gray-900">{formatDateTime(workItem.updatedAt)}</span>
                        </div>

                        {workItem.completedAt && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 w-32">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">Completed:</span>
                                </div>
                                <span className="text-gray-900">{formatDateTime(workItem.completedAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* ID */}
                    <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500">
                            ID: {workItem.id}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}