"use client"

import { useState, useEffect } from 'react';
import { useUpdateWorkItem, useAvailableUsers } from '@/lib/hooks/useWorkItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface EditWorkItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workItem: any;
}

export default function EditWorkItemModal({ open, onOpenChange, workItem }: EditWorkItemModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        tags: '',
    });

    const updateWorkItem = useUpdateWorkItem();
    const { data: usersData } = useAvailableUsers();
    const users = usersData?.data || [];

    useEffect(() => {
        if (workItem && open) {
            setFormData({
                title: workItem.title || '',
                description: workItem.description || '',
                status: workItem.status || '',
                priority: workItem.priority || '',
                assignedTo: workItem.assignedTo?.email || '',
                dueDate: workItem.dueDate ? new Date(workItem.dueDate).toISOString().split('T')[0] : '',
                tags: workItem.tags?.join(', ') || '',
            });
        }
    }, [workItem, open]);

    const handleSubmit = async () => {
        const tagsArray = formData.tags
            ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
            : [];

        const payload: any = {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
        };

        if (formData.assignedTo) {
            payload.assignedTo = formData.assignedTo;
        }

        if (formData.dueDate) {
            payload.dueDate = formData.dueDate;
        }

        if (tagsArray.length > 0) {
            payload.tags = tagsArray;
        }

        try {
            await updateWorkItem.mutateAsync({ id: workItem.id, data: payload });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Edit Work Item
                    </DialogTitle>
                    <DialogDescription>
                        Update the work item details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                            id="edit-title"
                            placeholder="Enter work item title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description *</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Enter detailed description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-assignedTo">Assign To</Label>
                        <Select
                            value={formData.assignedTo}
                            onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select user (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user: any) => (
                                    <SelectItem key={user.email} value={user.email}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-dueDate">Due Date</Label>
                        <Input
                            id="edit-dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                        <Input
                            id="edit-tags"
                            placeholder="e.g. urgent, bug, feature"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={updateWorkItem.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.description || updateWorkItem.isPending}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {updateWorkItem.isPending ? (
                            <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
                        ) : (
                            'Update Work Item'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}