'use client';

import { useState, useEffect } from 'react';
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    Star,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Award,
    BookOpen,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

// Types
interface StatCard {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

interface Activity {
    id: string;
    type: 'application' | 'evaluation' | 'deadline' | 'message' | 'report';
    title: string;
    description: string;
    timestamp: Date;
    status?: 'pending' | 'completed' | 'overdue';
    link?: string;
}

interface UpcomingDeadline {
    id: string;
    title: string;
    dueDate: Date;
    type: 'report' | 'evaluation' | 'timesheet' | 'milestone';
    priority: 'high' | 'medium' | 'low';
}

interface QuickAction {
    title: string;
    description: string;
    icon: React.ElementType;
    link: string;
    color: string;
}

// Mock data - Replace with actual API calls
const mockStats: StatCard[] = [
    {
        title: 'Active Internship',
        value: 'General Surgery',
        change: '85% Complete',
        icon: Briefcase,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Hours Completed',
        value: '128/160',
        change: '80%',
        icon: Clock,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        title: 'Tasks Completed',
        value: '24',
        change: '12 Remaining',
        icon: CheckCircle2,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        title: 'Overall Performance',
        value: '4.8/5.0',
        change: 'Excellent',
        icon: Star,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
    },
];

const mockRecentActivities: Activity[] = [
    {
        id: '1',
        type: 'evaluation',
        title: 'Mid-term Evaluation Received',
        description: 'Supervisor Dr. Smith has submitted your mid-term evaluation with excellent feedback.',
        timestamp: new Date(2024, 2, 15, 14, 30),
        status: 'completed',
        link: '/dashboard/evaluations',
    },
    {
        id: '2',
        type: 'report',
        title: 'Weekly Report Approved',
        description: 'Your weekly report for Week 8 has been approved by the coordinator.',
        timestamp: new Date(2024, 2, 14, 10, 15),
        status: 'completed',
        link: '/dashboard/reports',
    },
    {
        id: '3',
        type: 'deadline',
        title: 'Final Report Deadline Approaching',
        description: 'Your final internship report is due in 5 days.',
        timestamp: new Date(2024, 2, 20, 23, 59),
        status: 'pending',
        link: '/dashboard/reports',
    },
    {
        id: '4',
        type: 'message',
        title: 'New Message from Coordinator',
        description: 'Ms. Johnson has sent you important information about the upcoming presentation.',
        timestamp: new Date(2024, 2, 13, 9, 45),
        link: '/dashboard/messages',
    },
];

const mockUpcomingDeadlines: UpcomingDeadline[] = [
    {
        id: '1',
        title: 'Weekly Timesheet Submission',
        dueDate: new Date(2024, 2, 17, 17, 0),
        type: 'timesheet',
        priority: 'high',
    },
    {
        id: '2',
        title: 'Monthly Progress Report',
        dueDate: new Date(2024, 2, 20, 23, 59),
        type: 'report',
        priority: 'high',
    },
    {
        id: '3',
        title: 'Supervisor Meeting',
        dueDate: new Date(2024, 2, 18, 10, 0),
        type: 'milestone',
        priority: 'medium',
    },
    {
        id: '4',
        title: 'Final Evaluation',
        dueDate: new Date(2024, 2, 25, 17, 0),
        type: 'evaluation',
        priority: 'medium',
    },
];

const mockQuickActions: QuickAction[] = [
    {
        title: 'Log Hours',
        description: 'Record your daily activities',
        icon: Clock,
        link: '/dashboard/progress-tracking/log-activities',
        color: 'from-blue-500 to-blue-600',
    },
    {
        title: 'Submit Report',
        description: 'Upload weekly or monthly report',
        icon: FileText,
        link: '/dashboard/reports/submit-report',
        color: 'from-green-500 to-green-600',
    },
    {
        title: 'Check Messages',
        description: 'View supervisor feedback',
        icon: MessageSquare,
        link: '/dashboard/messages',
        color: 'from-purple-500 to-purple-600',
    },
    {
        title: 'View Evaluations',
        description: 'Check your performance',
        icon: TrendingUp,
        link: '/dashboard/evaluations',
        color: 'from-orange-500 to-orange-600',
    },
];

// Helper function to get deadline status color
const getDeadlinePriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'text-red-600 bg-red-50';
        case 'medium':
            return 'text-yellow-600 bg-yellow-50';
        default:
            return 'text-blue-600 bg-blue-50';
    }
};

// Helper function to get activity icon
const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
        case 'application':
            return Briefcase;
        case 'evaluation':
            return Star;
        case 'deadline':
            return AlertCircle;
        case 'message':
            return MessageSquare;
        case 'report':
            return FileText;
        default:
            return Clock;
    }
};

export default function StudentDashboard() {
    const [greeting, setGreeting] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Set greeting based on time of day
        const hour = new Date().getHours();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Format current date
        setCurrentDate(format(new Date(), 'EEEE, MMMM do, yyyy'));
    }, []);

    // Calculate progress percentage
    const progressPercentage = 85; // This should come from actual data

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content */}
            <div className="p-6 lg:p-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {greeting}, Sarah! 👋
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {currentDate}
                            </p>
                            <p className="mt-2 text-gray-600">
                                Welcome back to your internship dashboard. Here&apos;s what&apos;s happening with your internship today.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Award className="h-5 w-5" />
                                <span>Intern ID: INT-2024-001</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {mockStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                                        <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
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

                {/* Progress Overview Section */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Overall Progress */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Internship Progress</h2>
                                <Link
                                    href="/dashboard/progress-tracking"
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View Details
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">Overall Completion</span>
                                        <span className="text-gray-600">{progressPercentage}%</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Hours</span>
                                            <span className="font-medium text-gray-900">128/160</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                            <div className="h-full w-4/5 rounded-full bg-green-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Tasks</span>
                                            <span className="font-medium text-gray-900">24/36</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                            <div className="h-full w-2/3 rounded-full bg-purple-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Milestone Tracker */}
                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-medium text-gray-700">Key Milestones</h3>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Orientation', completed: true, date: 'Jan 15, 2024' },
                                        { name: 'Mid-term Evaluation', completed: true, date: 'Feb 28, 2024' },
                                        { name: 'Final Report', completed: false, date: 'Mar 25, 2024' },
                                        { name: 'Final Presentation', completed: false, date: 'Mar 30, 2024' },
                                    ].map((milestone, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {milestone.completed ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                            <div className="ml-3 flex flex-1 items-center justify-between">
                                                <span className={`text-sm ${milestone.completed ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {milestone.name}
                                                </span>
                                                <span className="text-xs text-gray-500">{milestone.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                    <div className="flex-shrink-0">
                                        <div className={`rounded-lg p-2 ${getDeadlinePriorityColor(deadline.priority)}`}>
                                            <Clock className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                                        <p className="text-xs text-gray-500">
                                            Due {formatDistanceToNow(deadline.dueDate, { addSuffix: true })}
                                        </p>
                                        <p className="mt-1 text-xs capitalize text-gray-500">
                                            {deadline.type}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/dashboard/progress-tracking"
                            className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700"
                        >
                            View All Deadlines
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {mockQuickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={index}
                                    href={action.link}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r p-px transition-all duration-300 hover:shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${action.color.split(' ')[0]}, ${action.color.split(' ')[2]})` }}
                                >
                                    <div className="relative h-full rounded-xl bg-white p-5 transition-all duration-300 group-hover:bg-opacity-95">
                                        <div className="mb-3 inline-flex rounded-lg bg-gradient-to-br p-2 text-white" style={{ background: `linear-gradient(135deg, ${action.color.split(' ')[0]}, ${action.color.split(' ')[2]})` }}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-1 font-semibold text-gray-900">{action.title}</h3>
                                        <p className="text-sm text-gray-500">{action.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                            <Link
                                href="/dashboard/notifications"
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {mockRecentActivities.map((activity) => {
                                const Icon = getActivityIcon(activity.type);
                                return (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className={`rounded-lg p-2 ${activity.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-600'
                                                }`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                    <p className="mt-1 text-xs text-gray-500">{activity.description}</p>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            {activity.link && (
                                                <Link
                                                    href={activity.link}
                                                    className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                                                >
                                                    View Details
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tips & Resources */}
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Tips & Resources</h2>
                            <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-lg bg-white p-4">
                                <h3 className="mb-2 font-medium text-gray-900">Internship Success Tips</h3>
                                <p className="text-sm text-gray-600">
                                    • Maintain regular communication with your supervisor<br />
                                    • Document your daily activities consistently<br />
                                    • Seek feedback actively to improve your performance<br />
                                    • Network with professionals in your field
                                </p>
                            </div>
                            <div className="rounded-lg bg-white p-4">
                                <h3 className="mb-2 font-medium text-gray-900">Upcoming Training</h3>
                                <p className="text-sm text-gray-600">
                                    • Professional Communication Skills - March 20th, 2:00 PM<br />
                                    • Medical Ethics Workshop - March 22nd, 10:00 AM
                                </p>
                                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                                    Register Now →
                                </button>
                            </div>
                            <div className="rounded-lg bg-white p-4">
                                <h3 className="mb-2 font-medium text-gray-900">Need Help?</h3>
                                <p className="text-sm text-gray-600">
                                    Contact your coordinator: Ms. Johnson<br />
                                    Email: coordinator@hospital.edu<br />
                                    Extension: 1234
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}