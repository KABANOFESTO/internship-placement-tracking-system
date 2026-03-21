// app/coordinator/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Calendar,
    MessageCircle,
    Star,
    Award,
    Building2,
    UserCheck,
    GraduationCap,
    FileCheck,
    Send,
    Eye,
    Download,
    Filter,
    Search,
    ChevronRight,
    MoreVertical,
    Activity,
    BarChart3,
    PieChart,
    Target,
    Zap,
    Shield,
    Bell,
    Mail,
    Settings,
    HelpCircle,
    Plus,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow, differenceInDays, subDays } from 'date-fns';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Types
interface StatCard {
    title: string;
    value: string | number;
    change: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    trend: 'up' | 'down';
}

interface PendingAction {
    id: string;
    type: 'application' | 'placement' | 'evaluation' | 'report' | 'message';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    deadline?: Date;
    count: number;
    actionUrl: string;
    actionLabel: string;
}

interface RecentActivity {
    id: string;
    type: 'application_submitted' | 'placement_made' | 'evaluation_completed' | 'report_submitted' | 'student_registered';
    title: string;
    description: string;
    timestamp: Date;
    user: {
        name: string;
        role: string;
        avatar?: string;
    };
    status?: 'pending' | 'completed' | 'approved';
}

interface ApplicationStatus {
    status: string;
    count: number;
    color: string;
}

interface PlacementMetrics {
    totalPlacements: number;
    completedPlacements: number;
    activePlacements: number;
    pendingPlacements: number;
    successRate: number;
}

// Mock data
const mockStats: StatCard[] = [
    {
        title: 'Total Applications',
        value: '247',
        change: 12.5,
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        trend: 'up'
    },
    {
        title: 'Pending Review',
        value: '42',
        change: -8.3,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        trend: 'down'
    },
    {
        title: 'Active Placements',
        value: '156',
        change: 15.2,
        icon: Briefcase,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        trend: 'up'
    },
    {
        title: 'Students Placed',
        value: '189',
        change: 10.8,
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        trend: 'up'
    }
];

const mockPendingActions: PendingAction[] = [
    {
        id: '1',
        type: 'application',
        title: 'Applications Pending Review',
        description: 'New internship applications waiting for initial review',
        priority: 'high',
        count: 24,
        actionUrl: '/coordinator/applications-management/review-applications',
        actionLabel: 'Review Now'
    },
    {
        id: '2',
        type: 'placement',
        title: 'Placement Decisions Needed',
        description: 'Students awaiting final placement decisions',
        priority: 'high',
        count: 18,
        actionUrl: '/coordinator/placement-management/placement-decisions',
        actionLabel: 'Make Decisions'
    },
    {
        id: '3',
        type: 'evaluation',
        title: 'Pending Evaluations',
        description: 'Supervisor evaluations awaiting review',
        priority: 'medium',
        count: 12,
        actionUrl: '/coordinator/reports-evaluations/evaluation-overview',
        actionLabel: 'Review'
    },
    {
        id: '4',
        type: 'report',
        title: 'Reports to Review',
        description: 'Student reports submitted for approval',
        priority: 'medium',
        count: 8,
        actionUrl: '/coordinator/reports-evaluations/monitor-submissions',
        actionLabel: 'Review Reports'
    }
];

const mockRecentActivities: RecentActivity[] = [
    {
        id: '1',
        type: 'application_submitted',
        title: 'New Application Submitted',
        description: 'Sarah Johnson applied for General Surgery Internship',
        timestamp: new Date(2024, 2, 18, 14, 30),
        user: {
            name: 'Sarah Johnson',
            role: 'Student',
            avatar: 'SJ'
        },
        status: 'pending'
    },
    {
        id: '2',
        type: 'placement_made',
        title: 'Placement Confirmed',
        description: 'Michael Chen placed at City General Hospital - Pediatrics',
        timestamp: new Date(2024, 2, 18, 11, 15),
        user: {
            name: 'Michael Chen',
            role: 'Student',
            avatar: 'MC'
        },
        status: 'completed'
    },
    {
        id: '3',
        type: 'evaluation_completed',
        title: 'Evaluation Submitted',
        description: 'Dr. Sarah Johnson completed mid-term evaluation for Emily Rodriguez',
        timestamp: new Date(2024, 2, 17, 16, 45),
        user: {
            name: 'Dr. Sarah Johnson',
            role: 'Supervisor',
            avatar: 'DJ'
        },
        status: 'completed'
    },
    {
        id: '4',
        type: 'report_submitted',
        title: 'Report Submitted',
        description: 'Weekly report submitted by Alex Thompson',
        timestamp: new Date(2024, 2, 17, 10, 20),
        user: {
            name: 'Alex Thompson',
            role: 'Student',
            avatar: 'AT'
        },
        status: 'pending'
    },
    {
        id: '5',
        type: 'student_registered',
        title: 'New Student Registered',
        description: 'Jessica Williams registered for the internship program',
        timestamp: new Date(2024, 2, 16, 9, 0),
        user: {
            name: 'Jessica Williams',
            role: 'Student',
            avatar: 'JW'
        },
        status: 'completed'
    }
];

const mockApplicationStatus: ApplicationStatus[] = [
    { status: 'Pending', count: 42, color: '#f59e0b' },
    { status: 'Under Review', count: 28, color: '#3b82f6' },
    { status: 'Shortlisted', count: 35, color: '#8b5cf6' },
    { status: 'Accepted', count: 89, color: '#10b981' },
    { status: 'Rejected', count: 53, color: '#ef4444' }
];

const mockPlacementMetrics: PlacementMetrics = {
    totalPlacements: 189,
    completedPlacements: 78,
    activePlacements: 111,
    pendingPlacements: 42,
    successRate: 86.5
};

const mockWeeklyApplications = [
    { week: 'Week 1', applications: 45, placements: 32 },
    { week: 'Week 2', applications: 52, placements: 38 },
    { week: 'Week 3', applications: 48, placements: 35 },
    { week: 'Week 4', applications: 61, placements: 42 },
    { week: 'Week 5', applications: 58, placements: 40 },
    { week: 'Week 6', applications: 63, placements: 45 }
];

const mockDepartmentDistribution = [
    { name: 'Surgery', value: 45, color: '#3b82f6' },
    { name: 'Pediatrics', value: 32, color: '#10b981' },
    { name: 'Cardiology', value: 28, color: '#f59e0b' },
    { name: 'Emergency', value: 24, color: '#ef4444' },
    { name: 'Radiology', value: 18, color: '#8b5cf6' },
    { name: 'Neurology', value: 15, color: '#ec489a' }
];

const mockUpcomingDeadlines = [
    {
        id: '1',
        title: 'Final Placement Decisions',
        date: new Date(2024, 2, 25),
        description: 'All pending placements must be finalized',
        priority: 'high'
    },
    {
        id: '2',
        title: 'Mid-term Evaluation Deadline',
        date: new Date(2024, 2, 28),
        description: 'Supervisors must complete mid-term evaluations',
        priority: 'high'
    },
    {
        id: '3',
        title: 'Report Submission Cutoff',
        date: new Date(2024, 2, 30),
        description: 'Weekly reports due for all active interns',
        priority: 'medium'
    },
    {
        id: '4',
        title: 'Partner Institution Review',
        date: new Date(2024, 3, 5),
        description: 'Review partnership agreements with institutions',
        priority: 'low'
    }
];

const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
        case 'application_submitted':
            return FileText;
        case 'placement_made':
            return CheckCircle2;
        case 'evaluation_completed':
            return Star;
        case 'report_submitted':
            return FileCheck;
        case 'student_registered':
            return Users;
        default:
            return Activity;
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
            return 'bg-blue-100 text-blue-800 border-blue-200';
    }
};

export default function CoordinatorDashboard() {
    const [greeting, setGreeting] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [stats] = useState<StatCard[]>(mockStats);
    const [pendingActions] = useState<PendingAction[]>(mockPendingActions);
    const [recentActivities] = useState<RecentActivity[]>(mockRecentActivities);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

    useEffect(() => {
        const hour = new Date().getHours();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        setCurrentDate(format(new Date(), 'EEEE, MMMM do, yyyy'));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {greeting}, Dr. Anderson! 👋
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {currentDate} • Coordinator Dashboard
                            </p>
                            <p className="mt-2 text-gray-600">
                                Welcome to your coordinator dashboard. Here&apos;s an overview of your internship program.
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <button className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                                <Download className="mr-2 h-4 w-4" />
                                Export Report
                            </button>
                            <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                                        <div className="mt-2 flex items-center space-x-1">
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                                            )}
                                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.abs(stat.change)}%
                                            </span>
                                            <span className="text-xs text-gray-500">vs last month</span>
                                        </div>
                                    </div>
                                    <div className={`rounded-xl ${stat.bgColor} p-3`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Pending Actions & Recent Activity */}
                    <div className="lg:col-span-2">
                        {/* Pending Actions */}
                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Pending Actions</h2>
                                <Link
                                    href="/coordinator/applications-management"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View All
                                    <ChevronRight className="ml-1 inline h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {pendingActions.map((action) => (
                                    <Link
                                        key={action.id}
                                        href={action.actionUrl}
                                        className="group rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-200 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(action.priority)}`}>
                                                        {action.priority}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-blue-600">{action.count}</span>
                                                    <span className="text-sm text-blue-600 group-hover:underline">
                                                        {action.actionLabel} →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                                <button className="text-sm text-blue-600 hover:text-blue-700">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => {
                                    const ActivityIcon = getActivityIcon(activity.type);
                                    return (
                                        <div key={activity.id} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="rounded-lg bg-gray-100 p-2">
                                                    <ActivityIcon className="h-4 w-4 text-gray-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{activity.description}</p>
                                                <div className="mt-1 flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">by {activity.user.name}</span>
                                                    {activity.status === 'pending' && (
                                                        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Stats & Deadlines */}
                    <div className="space-y-6">
                        {/* Placement Metrics */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Placement Metrics</h2>
                                <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Success Rate</span>
                                    <span className="text-2xl font-bold text-green-600">{mockPlacementMetrics.successRate}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Total Placements</p>
                                        <p className="text-xl font-bold text-gray-900">{mockPlacementMetrics.totalPlacements}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Active</p>
                                        <p className="text-xl font-bold text-green-600">{mockPlacementMetrics.activePlacements}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Completed</p>
                                        <p className="text-xl font-bold text-blue-600">{mockPlacementMetrics.completedPlacements}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Pending</p>
                                        <p className="text-xl font-bold text-yellow-600">{mockPlacementMetrics.pendingPlacements}</p>
                                    </div>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full bg-green-500"
                                        style={{ width: `${mockPlacementMetrics.successRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                {mockUpcomingDeadlines.map((deadline) => (
                                    <div key={deadline.id} className="flex items-start space-x-3">
                                        <div className={`mt-0.5 h-2 w-2 rounded-full ${deadline.priority === 'high' ? 'bg-red-500' :
                                            deadline.priority === 'medium' ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                                            <p className="text-xs text-gray-500">{deadline.description}</p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Due: {format(deadline.date, 'MMM dd, yyyy')}
                                                {differenceInDays(deadline.date, new Date()) <= 3 && (
                                                    <span className="ml-2 text-red-600">Soon!</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                View Calendar
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-100">Quick Stats</p>
                                    <p className="mt-2 text-2xl font-bold">87%</p>
                                    <p className="text-xs text-blue-100">Student Satisfaction Rate</p>
                                </div>
                                <div className="rounded-full bg-white/20 p-3">
                                    <Star className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                                <div>
                                    <p className="text-xs text-blue-100">Avg. Response Time</p>
                                    <p className="text-lg font-semibold">2.4 hrs</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100">Partner Institutions</p>
                                    <p className="text-lg font-semibold">24</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Applications Trend */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Applications & Placements Trend</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedTimeframe('week')}
                                    className={`rounded-lg px-3 py-1 text-sm ${selectedTimeframe === 'week'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setSelectedTimeframe('month')}
                                    className={`rounded-lg px-3 py-1 text-sm ${selectedTimeframe === 'month'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockWeeklyApplications}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="applications"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="placements"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Department Distribution */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Department Distribution</h2>
                            <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <RePieChart>
                                <Pie
                                    data={mockDepartmentDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {mockDepartmentDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Application Status Overview */}
                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Application Status Overview</h2>
                        <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                        {mockApplicationStatus.map((status, index) => (
                            <div key={index} className="text-center">
                                <div className="relative">
                                    <div className="mb-2 text-2xl font-bold text-gray-900">{status.count}</div>
                                    <div className="text-sm font-medium text-gray-600">{status.status}</div>
                                    <div
                                        className="mt-2 h-1 rounded-full"
                                        style={{ backgroundColor: status.color, width: `${(status.count / 247) * 100}%`, margin: '0 auto' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}