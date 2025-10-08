"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useWorkItemStats, useMyAssignedWorkItems, useMyCreatedWorkItems } from '@/lib/hooks/useWorkItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreateWorkItemModal from './CreateWorkItemModal';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    ListTodo,
    UserCheck,
    FileText,
    Calendar,
    Plus,
    ArrowRight
} from 'lucide-react';

export default function DashboardComponent() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: stats, isLoading: statsLoading } = useWorkItemStats();
    const { data: assignedItems, isLoading: assignedLoading } = useMyAssignedWorkItems();
    const { data: createdItems, isLoading: createdLoading } = useMyCreatedWorkItems();

    const statsData = stats?.data || {};
    const assigned = assignedItems?.data || [];
    const created = createdItems?.data || [];

    const statCards = [
        {
            title: 'Total Work Items',
            value: statsData.total || 0,
            icon: ListTodo,
            gradient: 'from-purple-600 to-blue-600',
            bgGradient: 'from-purple-50 to-blue-50',
        },
        {
            title: 'Assigned to Me',
            value: statsData.assigned || 0,
            icon: UserCheck,
            gradient: 'from-blue-600 to-cyan-600',
            bgGradient: 'from-blue-50 to-cyan-50',
        },
        {
            title: 'Created by Me',
            value: statsData.created || 0,
            icon: FileText,
            gradient: 'from-cyan-600 to-teal-600',
            bgGradient: 'from-cyan-50 to-teal-50',
        },
        {
            title: 'Completed',
            value: statsData.completed || 0,
            icon: CheckCircle2,
            gradient: 'from-green-600 to-emerald-600',
            bgGradient: 'from-green-50 to-emerald-50',
        },
        {
            title: 'In Progress',
            value: statsData.inProgress || 0,
            icon: Clock,
            gradient: 'from-orange-600 to-amber-600',
            bgGradient: 'from-orange-50 to-amber-50',
        },
        {
            title: 'Overdue',
            value: statsData.overdue || 0,
            icon: AlertCircle,
            gradient: 'from-red-600 to-rose-600',
            bgGradient: 'from-red-50 to-rose-50',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (statsLoading || assignedLoading || createdLoading) {
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
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-purple-100 mt-1">Welcome back! Here&apos;s your work overview</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-white text-purple-600 hover:bg-purple-50"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Work Item
                            </Button>
                            <Link href="/work-items">
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-purple-600"
                                >
                                    View All Work Items
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className={`p-6 bg-gradient-to-br ${stat.bgGradient}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Completion Rate */}
                {statsData.completionRate !== undefined && (
                    <Card className="mb-8 border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                <CardTitle>Completion Rate</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                                            style={{ width: `${statsData.completionRate}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {statsData.completionRate}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Work Items Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Assigned to Me */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-purple-600" />
                                    <CardTitle>Assigned to Me</CardTitle>
                                </div>
                                <Link href="/work-items?filter=assigned">
                                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                                        View All
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                            <CardDescription>Work items you need to complete</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {assigned.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No items assigned to you</p>
                            ) : (
                                <div className="space-y-3">
                                    {assigned.slice(0, 5).map((item: any) => (
                                        <Link href={`/work-items?id=${item.id}`} key={item.id}>
                                            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                                                        {item.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                                                        {item.status.replace('_', ' ')}
                                                    </span>
                                                    {item.dueDate && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(item.dueDate)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Created by Me */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-purple-600" />
                                    <CardTitle>Created by Me</CardTitle>
                                </div>
                                <Link href="/work-items?filter=created">
                                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                                        View All
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                            <CardDescription>Work items you&apos;ve created</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {created.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No items created yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {created.slice(0, 5).map((item: any) => (
                                        <Link href={`/work-items?id=${item.id}`} key={item.id}>
                                            <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                                                        {item.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                                                        {item.status.replace('_', ' ')}
                                                    </span>
                                                    {item.assignedTo && (
                                                        <div className="text-xs text-gray-500">
                                                            Assigned to: {item.assignedTo.firstName} {item.assignedTo.lastName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats Footer Navigation */}
                <Card className="mt-8 border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Need to see more details?</h3>
                                <p className="text-sm text-gray-600 mt-1">Access the full work items management page</p>
                            </div>
                            <Link href="/work-items">
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    <ListTodo className="h-4 w-4 mr-2" />
                                    Go to Work Items
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href="/work-items">
                    <Button className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                        <ListTodo className="h-6 w-6" />
                    </Button>
                </Link>
            </div>

            {/* Create Work Item Modal */}
            <CreateWorkItemModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </div>
    );
}