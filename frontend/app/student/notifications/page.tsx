// app/dashboard/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Info,
    MessageCircle,
    Calendar,
    FileText,
    Star,
    Award,
    Clock,
    Trash2,
    Check,
    X,
    Settings,
    Filter,
    Search,
    MoreVertical,
    ChevronDown,
    ChevronUp,
    Eye,
    BookOpen,
    Briefcase,
    User,
    Mail,
    Link2,
    ExternalLink,
    Flag,
    Heart,
    ThumbsUp,
    RefreshCw,
    Archive,
    Download,
    Share2,
    BellOff,
    BellRing
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
import Link from 'next/link';

// Types
interface Notification {
    id: string;
    type: 'application' | 'placement' | 'evaluation' | 'report' | 'message' | 'deadline' | 'system' | 'achievement';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    isArchived: boolean;
    priority: 'high' | 'medium' | 'low';
    actionUrl?: string;
    actionLabel?: string;
    sender?: {
        name: string;
        role: string;
        avatar?: string;
    };
    metadata?: {
        applicationId?: string;
        reportId?: string;
        evaluationId?: string;
        deadline?: Date;
        score?: number;
    };
    attachments?: {
        name: string;
        url: string;
        type: string;
    }[];
}

// Mock data
const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'evaluation',
        title: 'Mid-term Evaluation Completed',
        message: 'Dr. Sarah Johnson has submitted your mid-term evaluation. Your overall score is 88%. Click to view detailed feedback.',
        timestamp: new Date(2024, 2, 18, 14, 30),
        isRead: false,
        isArchived: false,
        priority: 'high',
        actionUrl: '/dashboard/evaluations',
        actionLabel: 'View Evaluation',
        sender: {
            name: 'Dr. Sarah Johnson',
            role: 'Supervisor'
        },
        metadata: {
            evaluationId: 'eval-123',
            score: 88
        }
    },
    {
        id: '2',
        type: 'report',
        title: 'Weekly Report Approved',
        message: 'Your Week 4 report has been approved by the coordinator. Great work!',
        timestamp: new Date(2024, 2, 18, 10, 15),
        isRead: false,
        isArchived: false,
        priority: 'medium',
        actionUrl: '/dashboard/reports',
        actionLabel: 'View Report',
        sender: {
            name: 'Dr. Michael Chen',
            role: 'Coordinator'
        },
        metadata: {
            reportId: 'report-456'
        }
    },
    {
        id: '3',
        type: 'deadline',
        title: 'Upcoming Deadline: Final Report',
        message: 'Your final internship report is due in 5 days. Please ensure all sections are complete.',
        timestamp: new Date(2024, 2, 18, 9, 0),
        isRead: true,
        isArchived: false,
        priority: 'high',
        actionUrl: '/dashboard/reports/submit-report',
        actionLabel: 'Submit Report',
        metadata: {
            deadline: new Date(2024, 2, 23)
        }
    },
    {
        id: '4',
        type: 'placement',
        title: 'Placement Confirmed',
        message: 'Congratulations! Your internship placement at City General Hospital has been confirmed.',
        timestamp: new Date(2024, 2, 17, 16, 45),
        isRead: true,
        isArchived: false,
        priority: 'high',
        actionUrl: '/dashboard/placement-status',
        actionLabel: 'View Details',
        sender: {
            name: 'Placement Committee',
            role: 'Administration'
        }
    },
    {
        id: '5',
        type: 'message',
        title: 'New Message from Supervisor',
        message: 'Dr. Johnson has sent you feedback on your recent surgical observation. Check your messages.',
        timestamp: new Date(2024, 2, 17, 11, 20),
        isRead: false,
        isArchived: false,
        priority: 'medium',
        actionUrl: '/dashboard/messages',
        actionLabel: 'Read Message',
        sender: {
            name: 'Dr. Sarah Johnson',
            role: 'Supervisor'
        }
    },
    {
        id: '6',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You have completed 100 clinical hours! You\'re making excellent progress.',
        timestamp: new Date(2024, 2, 16, 15, 30),
        isRead: true,
        isArchived: false,
        priority: 'low',
        actionUrl: '/dashboard/progress-tracking',
        actionLabel: 'Track Progress',
        metadata: {
            score: 100
        }
    },
    {
        id: '7',
        type: 'application',
        title: 'Application Update',
        message: 'Your application for Cardiology Internship is now under review.',
        timestamp: new Date(2024, 2, 16, 10, 0),
        isRead: true,
        isArchived: false,
        priority: 'medium',
        actionUrl: '/dashboard/internship-applications',
        actionLabel: 'Check Status',
        metadata: {
            applicationId: 'app-789'
        }
    },
    {
        id: '8',
        type: 'system',
        title: 'System Maintenance',
        message: 'The system will undergo maintenance on March 20th from 2-4 AM. Please save your work.',
        timestamp: new Date(2024, 2, 15, 8, 0),
        isRead: true,
        isArchived: true,
        priority: 'low'
    },
    {
        id: '9',
        type: 'evaluation',
        title: 'Monthly Review Scheduled',
        message: 'Your monthly performance review has been scheduled for March 25th at 10:00 AM.',
        timestamp: new Date(2024, 2, 15, 14, 30),
        isRead: false,
        isArchived: false,
        priority: 'medium',
        actionUrl: '/dashboard/evaluations',
        actionLabel: 'Add to Calendar',
        sender: {
            name: 'Dr. Sarah Johnson',
            role: 'Supervisor'
        },
        metadata: {
            evaluationId: 'eval-456'
        }
    },
    {
        id: '10',
        type: 'report',
        title: 'Report Requires Revision',
        message: 'Your monthly report needs some revisions. Please check the feedback and resubmit.',
        timestamp: new Date(2024, 2, 14, 9, 45),
        isRead: true,
        isArchived: false,
        priority: 'high',
        actionUrl: '/dashboard/reports',
        actionLabel: 'View Feedback',
        sender: {
            name: 'Dr. Michael Chen',
            role: 'Coordinator'
        }
    }
];

const notificationTypeConfig = {
    application: { icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Application' },
    placement: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Placement' },
    evaluation: { icon: Star, color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Evaluation' },
    report: { icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Report' },
    message: { icon: MessageCircle, color: 'text-indigo-600', bgColor: 'bg-indigo-50', label: 'Message' },
    deadline: { icon: Calendar, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Deadline' },
    system: { icon: Info, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'System' },
    achievement: { icon: Award, color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: 'Achievement' }
};

const priorityConfig = {
    high: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'High Priority' },
    medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Medium Priority' },
    low: { color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Low Priority' }
};

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'archived'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [groupByDate, setGroupByDate] = useState(true);

    const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

    const filteredNotifications = notifications
        .filter(n => {
            if (activeFilter === 'unread') return !n.isRead && !n.isArchived;
            if (activeFilter === 'archived') return n.isArchived;
            return !n.isArchived;
        })
        .filter(n => {
            const matchesType = typeFilter === 'all' || n.type === typeFilter;
            const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const groupedNotifications = groupByDate
        ? filteredNotifications.reduce((groups, notification) => {
            let groupKey;
            if (isToday(notification.timestamp)) {
                groupKey = 'Today';
            } else if (isYesterday(notification.timestamp)) {
                groupKey = 'Yesterday';
            } else if (isThisWeek(notification.timestamp)) {
                groupKey = 'This Week';
            } else {
                groupKey = 'Earlier';
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(notification);
            return groups;
        }, {} as Record<string, Notification[]>)
        : null;

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n =>
            !n.isArchived ? { ...n, isRead: true } : n
        ));
    };

    const handleArchive = (notificationId: string) => {
        setNotifications(notifications.map(n =>
            n.id === notificationId ? { ...n, isArchived: true, isRead: true } : n
        ));
    };

    const handleDelete = (notificationId: string) => {
        if (confirm('Are you sure you want to delete this notification?')) {
            setNotifications(notifications.filter(n => n.id !== notificationId));
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const NotificationDetailsModal = ({ notification }: { notification: Notification }) => {
        const TypeIcon = notificationTypeConfig[notification.type].icon;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                    <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Notification Details</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start space-x-4">
                            <div className={`rounded-xl p-3 ${notificationTypeConfig[notification.type].bgColor}`}>
                                <TypeIcon className={`h-6 w-6 ${notificationTypeConfig[notification.type].color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${priorityConfig[notification.priority].bgColor} ${priorityConfig[notification.priority].color}`}>
                                        {priorityConfig[notification.priority].label}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    {format(notification.timestamp, 'MMMM dd, yyyy \'at\' h:mm a')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-gray-700">{notification.message}</p>
                        </div>

                        {notification.sender && (
                            <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-700">From:</p>
                                <div className="mt-1 flex items-center">
                                    <User className="mr-2 h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{notification.sender.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">({notification.sender.role})</span>
                                </div>
                            </div>
                        )}

                        {notification.metadata && (
                            <div className="mt-4 rounded-lg bg-blue-50 p-4">
                                <p className="text-sm font-medium text-blue-900">Additional Information:</p>
                                <div className="mt-2 space-y-1 text-sm text-blue-800">
                                    {notification.metadata.score && (
                                        <p>Score: {notification.metadata.score}%</p>
                                    )}
                                    {notification.metadata.deadline && (
                                        <p>Deadline: {format(notification.metadata.deadline, 'MMMM dd, yyyy')}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {notification.attachments && notification.attachments.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700">Attachments:</p>
                                <div className="mt-2 space-y-2">
                                    {notification.attachments.map((attachment, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 p-2">
                                            <span className="text-sm text-gray-600">{attachment.name}</span>
                                            <button className="text-blue-600 hover:text-blue-700">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {notification.actionUrl && (
                            <div className="mt-6">
                                <Link
                                    href={notification.actionUrl}
                                    onClick={() => {
                                        handleMarkAsRead(notification.id);
                                        setShowDetailsModal(false);
                                    }}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    {notification.actionLabel || 'View Details'}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-6">
                            <button
                                onClick={() => handleArchive(notification.id)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                Archive
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(notification.id);
                                    setShowDetailsModal(false);
                                }}
                                className="rounded-lg border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SettingsModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                        <button onClick={() => setShowSettingsModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Application updates</span>
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Evaluation feedback</span>
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Deadline reminders</span>
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">System announcements</span>
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">High priority notifications</span>
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">All notifications</span>
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Notification Preferences</h3>
                            <div className="mt-2">
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Group notifications by date</span>
                                    <input
                                        type="checkbox"
                                        checked={groupByDate}
                                        onChange={(e) => setGroupByDate(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setShowSettingsModal(false)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <Bell className="h-8 w-8 text-blue-600" />
                                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Stay updated with your internship progress and important announcements
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Notifications</p>
                                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                            </div>
                            <BellRing className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Unread</p>
                                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                            </div>
                            <Bell className="h-8 w-8 text-red-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">High Priority</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {notifications.filter(n => n.priority === 'high' && !n.isArchived).length}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Archived</p>
                                <p className="text-2xl font-bold text-gray-600">
                                    {notifications.filter(n => n.isArchived).length}
                                </p>
                            </div>
                            <Archive className="h-8 w-8 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeFilter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveFilter('unread')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeFilter === 'unread'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Unread
                        </button>
                        <button
                            onClick={() => setActiveFilter('archived')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeFilter === 'archived'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Archived
                        </button>
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="application">Applications</option>
                        <option value="placement">Placements</option>
                        <option value="evaluation">Evaluations</option>
                        <option value="report">Reports</option>
                        <option value="message">Messages</option>
                        <option value="deadline">Deadlines</option>
                        <option value="achievement">Achievements</option>
                        <option value="system">System</option>
                    </select>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Mark All as Read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-6">
                    {groupByDate && groupedNotifications ? (
                        Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                            <div key={group}>
                                <h2 className="mb-3 text-lg font-semibold text-gray-900">{group}</h2>
                                <div className="space-y-3">
                                    {groupNotifications.map((notification) => {
                                        const TypeIcon = notificationTypeConfig[notification.type].icon;
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`group relative rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                                                    }`}
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`rounded-xl p-2 ${notificationTypeConfig[notification.type].bgColor}`}>
                                                                <TypeIcon className={`h-5 w-5 ${notificationTypeConfig[notification.type].color}`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityConfig[notification.priority].bgColor} ${priorityConfig[notification.priority].color}`}>
                                                                        {priorityConfig[notification.priority].label}
                                                                    </span>
                                                                    {!notification.isRead && (
                                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                                            New
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                                                    <span className="flex items-center">
                                                                        <Clock className="mr-1 h-3 w-3" />
                                                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                                    </span>
                                                                    {notification.sender && (
                                                                        <span className="flex items-center">
                                                                            <User className="mr-1 h-3 w-3" />
                                                                            {notification.sender.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex items-center space-x-2 lg:mt-0">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedNotification(notification);
                                                                setShowDetailsModal(true);
                                                            }}
                                                            className="flex items-center rounded-lg px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <Eye className="mr-1 h-4 w-4" />
                                                            View
                                                        </button>
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleArchive(notification.id)}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                                            title="Archive"
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-3">
                            {filteredNotifications.map((notification) => {
                                const TypeIcon = notificationTypeConfig[notification.type].icon;
                                return (
                                    <div
                                        key={notification.id}
                                        className={`group relative rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                                            }`}
                                    >
                                        {/* Same content as above */}
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`rounded-xl p-2 ${notificationTypeConfig[notification.type].bgColor}`}>
                                                        <TypeIcon className={`h-5 w-5 ${notificationTypeConfig[notification.type].color}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityConfig[notification.priority].bgColor} ${priorityConfig[notification.priority].color}`}>
                                                                {priorityConfig[notification.priority].label}
                                                            </span>
                                                            {!notification.isRead && (
                                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                                            <span className="flex items-center">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                            </span>
                                                            {notification.sender && (
                                                                <span className="flex items-center">
                                                                    <User className="mr-1 h-3 w-3" />
                                                                    {notification.sender.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center space-x-2 lg:mt-0">
                                                <button
                                                    onClick={() => {
                                                        setSelectedNotification(notification);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="flex items-center rounded-lg px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View
                                                </button>
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleArchive(notification.id)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredNotifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12">
                            <BellOff className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeFilter === 'unread'
                                    ? 'You have no unread notifications'
                                    : activeFilter === 'archived'
                                        ? 'No archived notifications'
                                        : 'You\'re all caught up!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showDetailsModal && selectedNotification && (
                <NotificationDetailsModal notification={selectedNotification} />
            )}
            {showSettingsModal && <SettingsModal />}
        </div>
    );
}