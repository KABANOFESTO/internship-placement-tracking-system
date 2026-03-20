// app/dashboard/progress-tracking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin, User } from 'lucide-react';
import {
    Activity,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Flag,
    Plus,
    Save,
    Send,
    Trash2,
    Edit2,
    Eye,
    Filter,
    Search,
    Download,
    Upload,
    AlertCircle,
    X,
    Target,
    TrendingUp,
    Award,
    BookOpen,
    Users,
    Heart,
    Star,
    MessageCircle,
    BarChart3,
    PieChart,
    LineChart,
    CalendarDays,
    Timer,
    Zap,
    RefreshCw,
    MoreVertical,
    Copy,
    Share2,
    Printer
} from 'lucide-react';
import { format, formatDistanceToNow, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import Link from 'next/link';

// Types
interface ActivityLog {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration: number; // in hours
    activityType: 'clinical' | 'educational' | 'research' | 'administrative' | 'other';
    title: string;
    description: string;
    supervisor: string;
    location: string;
    status: 'pending' | 'approved' | 'rejected';
    feedback?: string;
    attachments?: string[];
    tags: string[];
}

interface Timesheet {
    id: string;
    weekStart: Date;
    weekEnd: Date;
    totalHours: number;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    days: {
        date: Date;
        hours: number;
        activities: string[];
        notes?: string;
    }[];
    submittedAt?: Date;
    approvedAt?: Date;
    feedback?: string;
}

interface Milestone {
    id: string;
    title: string;
    description: string;
    type: 'clinical' | 'educational' | 'research' | 'professional';
    targetDate: Date;
    completedDate?: Date;
    status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    progress: number; // 0-100
    requirements: string[];
    evidence?: {
        type: string;
        url: string;
        title: string;
    }[];
    feedback?: string;
    weight: number; // importance weight
}

// Mock data
const mockActivities: ActivityLog[] = [
    {
        id: '1',
        date: new Date(2024, 2, 15),
        startTime: '08:00',
        endTime: '12:00',
        duration: 4,
        activityType: 'clinical',
        title: 'Morning Rounds with Dr. Johnson',
        description: 'Participated in patient rounds, presented 3 cases, discussed treatment plans',
        supervisor: 'Dr. Sarah Johnson',
        location: 'Surgical Ward, 3rd Floor',
        status: 'approved',
        tags: ['patient care', 'rounds', 'presentation'],
        feedback: 'Excellent presentation skills. Keep up the good work!'
    },
    {
        id: '2',
        date: new Date(2024, 2, 15),
        startTime: '13:00',
        endTime: '17:00',
        duration: 4,
        activityType: 'clinical',
        title: 'OR Observation - Laparoscopic Cholecystectomy',
        description: 'Observed laparoscopic cholecystectomy procedure. Assisted with patient positioning and equipment setup.',
        supervisor: 'Dr. Michael Chen',
        location: 'Operating Room 4',
        status: 'approved',
        tags: ['surgery', 'observation', 'OR'],
        feedback: 'Showed great interest and asked insightful questions.'
    },
    {
        id: '3',
        date: new Date(2024, 2, 16),
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        activityType: 'educational',
        title: 'Grand Rounds - Advances in Minimally Invasive Surgery',
        description: 'Attended weekly grand rounds presentation on new surgical techniques',
        supervisor: 'Dr. Sarah Johnson',
        location: 'Conference Room A',
        status: 'pending',
        tags: ['education', 'grand rounds', 'CME']
    },
    {
        id: '4',
        date: new Date(2024, 2, 16),
        startTime: '14:00',
        endTime: '16:00',
        duration: 2,
        activityType: 'research',
        title: 'Literature Review - Surgical Outcomes',
        description: 'Conducted literature review for ongoing research project on surgical outcomes',
        supervisor: 'Dr. Emily Rodriguez',
        location: 'Medical Library',
        status: 'pending',
        tags: ['research', 'literature review']
    },
    {
        id: '5',
        date: new Date(2024, 2, 17),
        startTime: '08:30',
        endTime: '12:30',
        duration: 4,
        activityType: 'clinical',
        title: 'Clinic Hours - Pre-op Consultations',
        description: 'Assisted in pre-operative consultations for 6 patients. Performed history and physical exams.',
        supervisor: 'Dr. Sarah Johnson',
        location: 'Surgical Clinic',
        status: 'approved',
        tags: ['clinic', 'consultations', 'patient care'],
        feedback: 'Good patient interaction skills.'
    }
];

const mockTimesheets: Timesheet[] = [
    {
        id: '1',
        weekStart: new Date(2024, 2, 11),
        weekEnd: new Date(2024, 2, 17),
        totalHours: 28,
        status: 'approved',
        days: [
            { date: new Date(2024, 2, 11), hours: 0, activities: [], notes: 'Day off' },
            { date: new Date(2024, 2, 12), hours: 8, activities: ['Morning Rounds', 'OR Observation'], notes: 'Productive day' },
            { date: new Date(2024, 2, 13), hours: 6, activities: ['Clinic Hours', 'Research Work'], notes: '' },
            { date: new Date(2024, 2, 14), hours: 8, activities: ['Surgical Assisting', 'Post-op Care'], notes: 'Great learning experience' },
            { date: new Date(2024, 2, 15), hours: 6, activities: ['Morning Rounds', 'OR Observation'], notes: '' },
            { date: new Date(2024, 2, 16), hours: 0, activities: [], notes: 'Weekend' },
            { date: new Date(2024, 2, 17), hours: 0, activities: [], notes: 'Weekend' }
        ],
        submittedAt: new Date(2024, 2, 18),
        approvedAt: new Date(2024, 2, 19),
        feedback: 'Great progress this week. Keep documenting your learning objectives.'
    },
    {
        id: '2',
        weekStart: new Date(2024, 2, 4),
        weekEnd: new Date(2024, 2, 10),
        totalHours: 32,
        status: 'submitted',
        days: [
            { date: new Date(2024, 2, 4), hours: 8, activities: ['Surgical Assisting', 'Morning Rounds'], notes: '' },
            { date: new Date(2024, 2, 5), hours: 8, activities: ['Clinic Hours', 'Research Meeting'], notes: '' },
            { date: new Date(2024, 2, 6), hours: 6, activities: ['OR Observation', 'Journal Club'], notes: '' },
            { date: new Date(2024, 2, 7), hours: 6, activities: ['Post-op Care', 'Patient Education'], notes: '' },
            { date: new Date(2024, 2, 8), hours: 4, activities: ['Grand Rounds', 'Research Work'], notes: '' },
            { date: new Date(2024, 2, 9), hours: 0, activities: [], notes: 'Weekend' },
            { date: new Date(2024, 2, 10), hours: 0, activities: [], notes: 'Weekend' }
        ],
        submittedAt: new Date(2024, 2, 11)
    },
    {
        id: '3',
        weekStart: new Date(2024, 1, 26),
        weekEnd: new Date(2024, 2, 3),
        totalHours: 24,
        status: 'draft',
        days: [
            { date: new Date(2024, 1, 26), hours: 6, activities: ['Clinic Hours'], notes: '' },
            { date: new Date(2024, 1, 27), hours: 6, activities: ['OR Observation'], notes: '' },
            { date: new Date(2024, 1, 28), hours: 4, activities: ['Research Work'], notes: '' },
            { date: new Date(2024, 1, 29), hours: 8, activities: ['Morning Rounds', 'Surgical Assisting'], notes: '' },
            { date: new Date(2024, 2, 1), hours: 0, activities: [], notes: 'Day off' },
            { date: new Date(2024, 2, 2), hours: 0, activities: [], notes: 'Weekend' },
            { date: new Date(2024, 2, 3), hours: 0, activities: [], notes: 'Weekend' }
        ]
    }
];

const mockMilestones: Milestone[] = [
    {
        id: '1',
        title: 'Complete Surgical Skills Workshop',
        description: 'Successfully complete the basic surgical skills workshop including suturing, knot tying, and instrument handling',
        type: 'clinical',
        targetDate: new Date(2024, 3, 15),
        completedDate: new Date(2024, 3, 10),
        status: 'completed',
        progress: 100,
        requirements: [
            'Attend all workshop sessions',
            'Pass practical assessment',
            'Complete post-workshop evaluation'
        ],
        evidence: [
            {
                type: 'certificate',
                url: '/certificates/surgical-skills.pdf',
                title: 'Surgical Skills Certificate'
            }
        ],
        weight: 15
    },
    {
        id: '2',
        title: 'Present Case Study at Grand Rounds',
        description: 'Prepare and present a comprehensive case study during department grand rounds',
        type: 'educational',
        targetDate: new Date(2024, 4, 1),
        status: 'in_progress',
        progress: 60,
        requirements: [
            'Select interesting case',
            'Research literature',
            'Prepare presentation',
            'Present to department'
        ],
        feedback: 'Case selection is good. Work on literature review and data presentation.',
        weight: 20
    },
    {
        id: '3',
        title: 'Complete Research Project',
        description: 'Complete data collection and analysis for research project on surgical outcomes',
        type: 'research',
        targetDate: new Date(2024, 4, 30),
        status: 'in_progress',
        progress: 45,
        requirements: [
            'Complete data collection',
            'Statistical analysis',
            'Draft manuscript',
            'Submit to supervisor for review'
        ],
        weight: 25
    },
    {
        id: '4',
        title: 'Achieve 200 Clinical Hours',
        description: 'Complete required clinical hours for internship',
        type: 'clinical',
        targetDate: new Date(2024, 5, 1),
        status: 'in_progress',
        progress: 64, // 128/200
        requirements: [
            'Log all clinical activities',
            'Get supervisor verification',
            'Maintain activity log'
        ],
        weight: 30
    },
    {
        id: '5',
        title: 'Complete Professional Development Series',
        description: 'Attend all professional development workshops and seminars',
        type: 'professional',
        targetDate: new Date(2024, 4, 15),
        status: 'not_started',
        progress: 0,
        requirements: [
            'Attend 4 workshops',
            'Complete reflection essays',
            'Participate in discussions'
        ],
        weight: 10
    },
    {
        id: '6',
        title: 'Final Evaluation Preparation',
        description: 'Prepare portfolio and schedule final evaluation with supervisor',
        type: 'professional',
        targetDate: new Date(2024, 5, 15),
        status: 'not_started',
        progress: 0,
        requirements: [
            'Compile portfolio',
            'Self-assessment',
            'Schedule evaluation meeting'
        ],
        weight: 15
    }
];

// Activity Type Colors and Icons
const activityTypeConfig = {
    clinical: { color: 'bg-blue-100 text-blue-700', icon: Heart, label: 'Clinical' },
    educational: { color: 'bg-purple-100 text-purple-700', icon: BookOpen, label: 'Educational' },
    research: { color: 'bg-green-100 text-green-700', icon: BarChart3, label: 'Research' },
    administrative: { color: 'bg-gray-100 text-gray-700', icon: FileText, label: 'Administrative' },
    other: { color: 'bg-yellow-100 text-yellow-700', icon: Activity, label: 'Other' }
};

// Status Colors
const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    rejected: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
    draft: { color: 'bg-gray-100 text-gray-700', icon: FileText },
    submitted: { color: 'bg-blue-100 text-blue-700', icon: Send },
    not_started: { color: 'bg-gray-100 text-gray-700', icon: Clock },
    in_progress: { color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
    completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    overdue: { color: 'bg-red-100 text-red-700', icon: AlertCircle }
};

export default function ProgressTracking() {
    const [activeTab, setActiveTab] = useState<'activities' | 'timesheets' | 'milestones'>('activities');
    const [activities, setActivities] = useState<ActivityLog[]>(mockActivities);
    const [timesheets, setTimesheets] = useState<Timesheet[]>(mockTimesheets);
    const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);

    // UI States
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showTimesheetModal, setShowTimesheetModal] = useState(false);
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
    const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Form States
    const [newActivity, setNewActivity] = useState({
        date: new Date(),
        startTime: '09:00',
        endTime: '17:00',
        activityType: 'clinical' as const,
        title: '',
        description: '',
        location: '',
        tags: [] as string[]
    });
    const [currentTag, setCurrentTag] = useState('');

    // Statistics
    const totalHours = activities.reduce((sum, act) => sum + act.duration, 0);
    const approvedHours = activities.filter(a => a.status === 'approved').reduce((sum, act) => sum + act.duration, 0);
    const pendingHours = activities.filter(a => a.status === 'pending').reduce((sum, act) => sum + act.duration, 0);
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const overallProgress = milestones.reduce((sum, m) => sum + (m.progress * m.weight), 0) / milestones.reduce((sum, m) => sum + m.weight, 0);

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || activity.activityType === filterType;
        const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleAddActivity = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowActivityModal(false);
        // Reset form
        setNewActivity({
            date: new Date(),
            startTime: '09:00',
            endTime: '17:00',
            activityType: 'clinical',
            title: '',
            description: '',
            location: '',
            tags: []
        });
    };

    const handleSubmitTimesheet = async (timesheetId: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTimesheets(timesheets.map(ts =>
            ts.id === timesheetId ? { ...ts, status: 'submitted', submittedAt: new Date() } : ts
        ));
    };

    const handleUpdateMilestone = async (milestoneId: string, progress: number) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMilestones(milestones.map(m =>
            m.id === milestoneId ? {
                ...m,
                progress: Math.min(100, Math.max(0, progress)),
                status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
                completedDate: progress === 100 ? new Date() : m.completedDate
            } : m
        ));
    };

    const ActivityModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Log Activity</h2>
                        <button onClick={() => setShowActivityModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    value={format(newActivity.date, 'yyyy-MM-dd')}
                                    onChange={(e) => setNewActivity({ ...newActivity, date: new Date(e.target.value) })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Activity Type</label>
                                <select
                                    value={newActivity.activityType}
                                    onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value as any })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="clinical">Clinical</option>
                                    <option value="educational">Educational</option>
                                    <option value="research">Research</option>
                                    <option value="administrative">Administrative</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input
                                    type="time"
                                    value={newActivity.startTime}
                                    onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                <input
                                    type="time"
                                    value={newActivity.endTime}
                                    onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={newActivity.title}
                                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="e.g., Morning Rounds, OR Observation"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={3}
                                value={newActivity.description}
                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Describe what you did, what you learned..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                value={newActivity.location}
                                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="e.g., Operating Room 4, Surgical Clinic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {newActivity.tags.map((tag, index) => (
                                    <span key={index} className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                        {tag}
                                        <button
                                            onClick={() => setNewActivity({
                                                ...newActivity,
                                                tags: newActivity.tags.filter((_, i) => i !== index)
                                            })}
                                            className="ml-2"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="mt-2 flex">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && currentTag.trim()) {
                                            setNewActivity({
                                                ...newActivity,
                                                tags: [...newActivity.tags, currentTag.trim()]
                                            });
                                            setCurrentTag('');
                                        }
                                    }}
                                    className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Add tags..."
                                />
                                <button
                                    onClick={() => {
                                        if (currentTag.trim()) {
                                            setNewActivity({
                                                ...newActivity,
                                                tags: [...newActivity.tags, currentTag.trim()]
                                            });
                                            setCurrentTag('');
                                        }
                                    }}
                                    className="rounded-r-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
                        <button
                            onClick={() => setShowActivityModal(false)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddActivity}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Save Activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const TimesheetModal = ({ timesheet }: { timesheet: Timesheet }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Timesheet: {format(timesheet.weekStart, 'MMM dd')} - {format(timesheet.weekEnd, 'MMM dd, yyyy')}
                        </h2>
                        <button onClick={() => setShowTimesheetModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Day</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hours</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Activities</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {timesheet.days.map((day, index) => (
                                    <tr key={index} className={day.hours === 0 ? 'bg-gray-50' : ''}>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {format(day.date, 'EEEE')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {format(day.date, 'MMM dd')}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {day.hours}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div className="flex flex-wrap gap-1">
                                                {day.activities.map((activity, idx) => (
                                                    <span key={idx} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                                                        {activity}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {day.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Total Hours: {timesheet.totalHours}</p>
                            {timesheet.feedback && (
                                <p className="mt-1 text-sm text-gray-600">Feedback: {timesheet.feedback}</p>
                            )}
                        </div>
                        {timesheet.status === 'draft' && (
                            <button
                                onClick={() => handleSubmitTimesheet(timesheet.id)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Submit Timesheet
                            </button>
                        )}
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
                            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Log your activities, submit timesheets, and track your milestones
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <button
                                onClick={() => setShowActivityModal(true)}
                                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Log Activity
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Hours</p>
                                <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
                                <p className="text-xs text-green-600">+{approvedHours} approved</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Hours</p>
                                <p className="text-2xl font-bold text-yellow-600">{pendingHours}</p>
                                <p className="text-xs text-gray-500">Awaiting approval</p>
                            </div>
                            <Timer className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Milestones</p>
                                <p className="text-2xl font-bold text-gray-900">{completedMilestones}/{milestones.length}</p>
                                <p className="text-xs text-green-600">Completed</p>
                            </div>
                            <Flag className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Overall Progress</p>
                                <p className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</p>
                                <p className="text-xs text-gray-500">Towards completion</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('activities')}
                            className={`flex items-center py-2 text-sm font-medium ${activeTab === 'activities'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Activity className="mr-2 h-4 w-4" />
                            Log Activities
                        </button>
                        <button
                            onClick={() => setActiveTab('timesheets')}
                            className={`flex items-center py-2 text-sm font-medium ${activeTab === 'timesheets'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Timesheets
                        </button>
                        <button
                            onClick={() => setActiveTab('milestones')}
                            className={`flex items-center py-2 text-sm font-medium ${activeTab === 'milestones'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Flag className="mr-2 h-4 w-4" />
                            Milestones
                        </button>
                    </nav>
                </div>

                {/* Activities Tab */}
                {activeTab === 'activities' && (
                    <div>
                        {/* Filters */}
                        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search activities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="all">All Types</option>
                                <option value="clinical">Clinical</option>
                                <option value="educational">Educational</option>
                                <option value="research">Research</option>
                                <option value="administrative">Administrative</option>
                                <option value="other">Other</option>
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Activities List */}
                        <div className="space-y-4">
                            {filteredActivities.map((activity) => {
                                const TypeIcon = activityTypeConfig[activity.activityType].icon;
                                const StatusIcon = statusConfig[activity.status].icon;
                                return (
                                    <div key={activity.id} className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`rounded-lg p-2 ${activityTypeConfig[activity.activityType].color}`}>
                                                        <TypeIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusConfig[activity.status].color}`}>
                                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <Calendar className="mr-1 h-4 w-4" />
                                                                {format(activity.date, 'MMM dd, yyyy')}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Clock className="mr-1 h-4 w-4" />
                                                                {activity.startTime} - {activity.endTime} ({activity.duration} hrs)
                                                            </span>
                                                            <span className="flex items-center">
                                                                <MapPin className="mr-1 h-4 w-4" />
                                                                {activity.location}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <User className="mr-1 h-4 w-4" />
                                                                {activity.supervisor}
                                                            </span>
                                                        </div>
                                                        {activity.tags.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {activity.tags.map((tag, idx) => (
                                                                    <span key={idx} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {activity.feedback && (
                                                            <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                                                <p className="text-sm text-blue-800">
                                                                    <span className="font-medium">Feedback:</span> {activity.feedback}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex space-x-2 lg:mt-0">
                                                <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredActivities.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12">
                                <Activity className="h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No activities found</h3>
                                <p className="mt-1 text-sm text-gray-500">Start logging your internship activities</p>
                                <button
                                    onClick={() => setShowActivityModal(true)}
                                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Log Your First Activity
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Timesheets Tab */}
                {activeTab === 'timesheets' && (
                    <div>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {timesheets.map((timesheet) => (
                                <div
                                    key={timesheet.id}
                                    className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                    onClick={() => {
                                        setSelectedTimesheet(timesheet);
                                        setShowTimesheetModal(true);
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Week of {format(timesheet.weekStart, 'MMM dd')}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {format(timesheet.weekStart, 'MMM dd')} - {format(timesheet.weekEnd, 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusConfig[timesheet.status].color}`}>
                                            {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{timesheet.totalHours}</p>
                                            <p className="text-xs text-gray-500">Total Hours</p>
                                        </div>
                                        <div className="text-right">
                                            {timesheet.submittedAt && (
                                                <p className="text-xs text-gray-500">
                                                    Submitted: {format(timesheet.submittedAt, 'MMM dd')}
                                                </p>
                                            )}
                                            {timesheet.approvedAt && (
                                                <p className="text-xs text-green-600">
                                                    Approved: {format(timesheet.approvedAt, 'MMM dd')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {timesheet.status === 'draft' && (
                                        <div className="mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSubmitTimesheet(timesheet.id);
                                                }}
                                                className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                                            >
                                                Submit for Approval
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Milestones Tab */}
                {activeTab === 'milestones' && (
                    <div>
                        <div className="space-y-6">
                            {milestones.map((milestone) => {
                                const daysUntil = differenceInDays(milestone.targetDate, new Date());
                                const isOverdue = daysUntil < 0 && milestone.status !== 'completed';

                                return (
                                    <div key={milestone.id} className="rounded-2xl bg-white p-6 shadow-sm">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`rounded-lg p-2 ${milestone.type === 'clinical' ? 'bg-blue-100 text-blue-600' :
                                                            milestone.type === 'educational' ? 'bg-purple-100 text-purple-600' :
                                                                milestone.type === 'research' ? 'bg-green-100 text-green-600' :
                                                                    'bg-yellow-100 text-yellow-600'
                                                        }`}>
                                                        {milestone.type === 'clinical' ? <Heart className="h-5 w-5" /> :
                                                            milestone.type === 'educational' ? <BookOpen className="h-5 w-5" /> :
                                                                milestone.type === 'research' ? <BarChart3 className="h-5 w-5" /> :
                                                                    <Award className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                    milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                                        isOverdue ? 'bg-red-100 text-red-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {milestone.status === 'completed' ? 'Completed' :
                                                                    milestone.status === 'in_progress' ? 'In Progress' :
                                                                        isOverdue ? 'Overdue' : 'Not Started'}
                                                            </span>
                                                            {milestone.completedDate && (
                                                                <span className="text-xs text-green-600">
                                                                    Completed {formatDistanceToNow(milestone.completedDate, { addSuffix: true })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-600">{milestone.description}</p>

                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600">Progress</span>
                                                                <span className="font-medium text-blue-600">{milestone.progress}%</span>
                                                            </div>
                                                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                                                    style={{ width: `${milestone.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                                            <div className="flex items-center text-gray-500">
                                                                <Calendar className="mr-1 h-4 w-4" />
                                                                Target: {format(milestone.targetDate, 'MMM dd, yyyy')}
                                                                {!milestone.completedDate && (
                                                                    <span className={`ml-2 ${isOverdue ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                                                                        ({isOverdue ? 'Overdue' : `${daysUntil} days left`})
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center text-gray-500">
                                                                <Award className="mr-1 h-4 w-4" />
                                                                Weight: {milestone.weight}%
                                                            </div>
                                                        </div>

                                                        {milestone.requirements.length > 0 && (
                                                            <div className="mt-3">
                                                                <p className="text-sm font-medium text-gray-700">Requirements:</p>
                                                                <ul className="mt-1 list-inside list-disc space-y-1">
                                                                    {milestone.requirements.map((req, idx) => (
                                                                        <li key={idx} className="text-sm text-gray-600">{req}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {milestone.feedback && (
                                                            <div className="mt-3 rounded-lg bg-yellow-50 p-3">
                                                                <p className="text-sm text-yellow-800">
                                                                    <span className="font-medium">Feedback:</span> {milestone.feedback}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 lg:mt-0 lg:ml-6">
                                                {milestone.status !== 'completed' && (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={milestone.progress}
                                                            onChange={(e) => handleUpdateMilestone(milestone.id, parseInt(e.target.value))}
                                                            className="w-32"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">{milestone.progress}%</span>
                                                    </div>
                                                )}
                                                {milestone.evidence && milestone.evidence.length > 0 && (
                                                    <button className="mt-2 flex w-full items-center justify-center rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        View Evidence
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showActivityModal && <ActivityModal />}
            {showTimesheetModal && selectedTimesheet && <TimesheetModal timesheet={selectedTimesheet} />}
        </div>
    );
}
