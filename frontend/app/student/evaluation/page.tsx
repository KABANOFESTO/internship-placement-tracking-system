// app/dashboard/evaluations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    MessageCircle,
    Calendar,
    User,
    Briefcase,
    Award,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Filter,
    Search,
    ChevronDown,
    ChevronUp,
    Eye,
    FileText,
    BarChart3,
    PieChart,
    LineChart,
    Target,
    Heart,
    BookOpen,
    Users,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Printer,
    Mail,
    ExternalLink,
    X,
    Smile,
    Frown,
    Meh,
    Sparkles,
    Brain,
    Activity,
    ClipboardList
} from 'lucide-react';
import { format, formatDistanceToNow, differenceInDays, isAfter } from 'date-fns';
import Link from 'next/link';

// Types
interface Evaluation {
    id: string;
    type: 'mid_term' | 'final' | 'monthly' | 'weekly' | 'special';
    title: string;
    evaluator: {
        name: string;
        role: 'supervisor' | 'coordinator' | 'committee';
        title: string;
        department: string;
        avatar?: string;
    };
    evaluationDate: Date;
    dueDate: Date;
    status: 'completed' | 'pending' | 'overdue';
    overallScore: number;
    maxScore: number;
    sections: EvaluationSection[];
    strengths: string[];
    areasForImprovement: string[];
    comments: string;
    recommendations: string[];
    nextSteps?: string;
    attachments?: {
        name: string;
        url: string;
        type: string;
    }[];
    metrics: {
        attendance: number;
        punctuality: number;
        professionalism: number;
        clinicalSkills: number;
        communication: number;
        teamwork: number;
        initiative: number;
        knowledge: number;
    };
}

interface EvaluationSection {
    name: string;
    score: number;
    maxScore: number;
    criteria: {
        name: string;
        score: number;
        maxScore: number;
        feedback?: string;
    }[];
    feedback?: string;
}

interface PerformanceTrend {
    period: string;
    score: number;
    evaluations: number;
}

// Mock data
const mockEvaluations: Evaluation[] = [
    {
        id: '1',
        type: 'mid_term',
        title: 'Mid-Term Performance Review',
        evaluator: {
            name: 'Dr. Sarah Johnson',
            role: 'supervisor',
            title: 'Chief of Surgery',
            department: 'Department of Surgery'
        },
        evaluationDate: new Date(2024, 1, 28),
        dueDate: new Date(2024, 1, 15),
        status: 'completed',
        overallScore: 88,
        maxScore: 100,
        sections: [
            {
                name: 'Clinical Skills',
                score: 42,
                maxScore: 50,
                criteria: [
                    { name: 'Patient Assessment', score: 8, maxScore: 10, feedback: 'Good thoroughness in history taking' },
                    { name: 'Diagnostic Reasoning', score: 9, maxScore: 10, feedback: 'Excellent analytical skills' },
                    { name: 'Procedural Skills', score: 7, maxScore: 10, feedback: 'Needs more practice with suturing' },
                    { name: 'Medical Knowledge', score: 9, maxScore: 10, feedback: 'Strong theoretical foundation' },
                    { name: 'Clinical Documentation', score: 9, maxScore: 10, feedback: 'Detailed and accurate records' }
                ],
                feedback: 'Strong clinical foundation with room for procedural skill development.'
            },
            {
                name: 'Professionalism',
                score: 46,
                maxScore: 50,
                criteria: [
                    { name: 'Punctuality', score: 9, maxScore: 10, feedback: 'Always on time' },
                    { name: 'Attendance', score: 10, maxScore: 10, feedback: 'Perfect attendance record' },
                    { name: 'Professional Conduct', score: 9, maxScore: 10, feedback: 'Professional demeanor' },
                    { name: 'Ethics', score: 9, maxScore: 10, feedback: 'Strong ethical judgment' },
                    { name: 'Dress Code', score: 9, maxScore: 10, feedback: 'Always appropriately dressed' }
                ],
                feedback: 'Exemplary professional behavior.'
            }
        ],
        strengths: [
            'Strong patient assessment skills',
            'Excellent diagnostic reasoning',
            'Professional demeanor with patients and staff',
            'Quick learner with good retention'
        ],
        areasForImprovement: [
            'Surgical suturing technique',
            'Time management during procedures',
            'More proactive in seeking learning opportunities'
        ],
        comments: 'Sarah has shown excellent progress during the first half of her internship. She demonstrates strong clinical knowledge and a genuine commitment to patient care. With continued focus on procedural skills, she will excel in the second half.',
        recommendations: [
            'Practice suturing techniques in simulation lab',
            'Take on more responsibility in surgical assisting',
            'Present at least one case during grand rounds'
        ],
        nextSteps: 'Schedule weekly check-ins to monitor procedural skill development',
        metrics: {
            attendance: 98,
            punctuality: 95,
            professionalism: 92,
            clinicalSkills: 85,
            communication: 88,
            teamwork: 90,
            initiative: 85,
            knowledge: 90
        }
    },
    {
        id: '2',
        type: 'weekly',
        title: 'Week 4 Progress Evaluation',
        evaluator: {
            name: 'Dr. Michael Chen',
            role: 'supervisor',
            title: 'Attending Surgeon',
            department: 'General Surgery'
        },
        evaluationDate: new Date(2024, 1, 25),
        dueDate: new Date(2024, 1, 22),
        status: 'completed',
        overallScore: 92,
        maxScore: 100,
        sections: [
            {
                name: 'Weekly Performance',
                score: 46,
                maxScore: 50,
                criteria: [
                    { name: 'Task Completion', score: 9, maxScore: 10, feedback: 'Completed all assigned tasks' },
                    { name: 'Quality of Work', score: 9, maxScore: 10, feedback: 'High quality documentation' },
                    { name: 'Learning Progress', score: 10, maxScore: 10, feedback: 'Rapid improvement' },
                    { name: 'Initiative', score: 9, maxScore: 10, feedback: 'Proactively seeks opportunities' },
                    { name: 'Responsiveness', score: 9, maxScore: 10, feedback: 'Quick to respond to requests' }
                ]
            }
        ],
        strengths: [
            'Quick learner',
            'Excellent documentation skills',
            'Good rapport with patients'
        ],
        areasForImprovement: [
            'Familiarity with hospital systems',
            'Speed in completing tasks'
        ],
        comments: 'Excellent progress this week. Shows great enthusiasm and dedication.',
        recommendations: [
            'Continue building speed while maintaining quality',
            'Learn hospital EMR system shortcuts'
        ],
        metrics: {
            attendance: 100,
            punctuality: 100,
            professionalism: 95,
            clinicalSkills: 88,
            communication: 92,
            teamwork: 90,
            initiative: 94,
            knowledge: 88
        }
    },
    {
        id: '3',
        type: 'monthly',
        title: 'Monthly Progress Review - February',
        evaluator: {
            name: 'Dr. Sarah Johnson',
            role: 'supervisor',
            title: 'Chief of Surgery',
            department: 'Department of Surgery'
        },
        evaluationDate: new Date(2024, 1, 29),
        dueDate: new Date(2024, 1, 28),
        status: 'completed',
        overallScore: 86,
        maxScore: 100,
        sections: [
            {
                name: 'Research Contribution',
                score: 40,
                maxScore: 50,
                criteria: [
                    { name: 'Data Collection', score: 8, maxScore: 10, feedback: 'Good progress' },
                    { name: 'Analysis', score: 8, maxScore: 10, feedback: 'Needs more depth' },
                    { name: 'Literature Review', score: 9, maxScore: 10, feedback: 'Comprehensive' },
                    { name: 'Writing Skills', score: 8, maxScore: 10, feedback: 'Clear and concise' },
                    { name: 'Presentation', score: 7, maxScore: 10, feedback: 'Work on slide design' }
                ]
            }
        ],
        strengths: [
            'Research methodology understanding',
            'Literature review skills',
            'Data organization'
        ],
        areasForImprovement: [
            'Statistical analysis techniques',
            'Presentation skills'
        ],
        comments: 'Good research progress. Need to focus on advanced data analysis.',
        recommendations: [
            'Attend biostatistics workshop',
            'Practice presentation delivery'
        ],
        metrics: {
            attendance: 100,
            punctuality: 98,
            professionalism: 90,
            clinicalSkills: 84,
            communication: 86,
            teamwork: 88,
            initiative: 88,
            knowledge: 89
        }
    },
    {
        id: '4',
        type: 'final',
        title: 'Final Internship Evaluation',
        evaluator: {
            name: 'Dr. Sarah Johnson',
            role: 'supervisor',
            title: 'Chief of Surgery',
            department: 'Department of Surgery'
        },
        evaluationDate: new Date(2024, 2, 25),
        dueDate: new Date(2024, 2, 30),
        status: 'pending',
        overallScore: 0,
        maxScore: 100,
        sections: [],
        strengths: [],
        areasForImprovement: [],
        comments: '',
        recommendations: [],
        metrics: {
            attendance: 0,
            punctuality: 0,
            professionalism: 0,
            clinicalSkills: 0,
            communication: 0,
            teamwork: 0,
            initiative: 0,
            knowledge: 0
        }
    }
];

const mockPerformanceTrend: PerformanceTrend[] = [
    { period: 'Week 1', score: 82, evaluations: 1 },
    { period: 'Week 2', score: 85, evaluations: 1 },
    { period: 'Week 3', score: 84, evaluations: 1 },
    { period: 'Week 4', score: 92, evaluations: 1 },
    { period: 'Month 1', score: 86, evaluations: 1 },
    { period: 'Month 2', score: 88, evaluations: 1 }
];

const getEvaluationTypeColor = (type: string) => {
    switch (type) {
        case 'mid_term':
            return 'bg-blue-100 text-blue-800';
        case 'final':
            return 'bg-purple-100 text-purple-800';
        case 'monthly':
            return 'bg-green-100 text-green-800';
        case 'weekly':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

export default function Evaluations() {
    const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);
    const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const filteredEvaluations = evaluations.filter(eval => {
        const matchesSearch = eval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eval.evaluator.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || eval.type === filterType;
        const matchesStatus = filterStatus === 'all' || eval.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const completedEvaluations = evaluations.filter(e => e.status === 'completed');
    const averageScore = completedEvaluations.length > 0
        ? Math.round(completedEvaluations.reduce((sum, e) => sum + (e.overallScore / e.maxScore * 100), 0) / completedEvaluations.length)
        : 0;

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const EvaluationDetailsModal = ({ evaluation }: { evaluation: Evaluation }) => {
        const percentage = (evaluation.overallScore / evaluation.maxScore) * 100;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                    <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">{evaluation.title}</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getEvaluationTypeColor(evaluation.type)}`}>
                                            {evaluation.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {evaluation.status === 'completed' ? (
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                            ) : (
                                                <Clock className="mr-1 h-3 w-3" />
                                            )}
                                            {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            Evaluated: {format(evaluation.evaluationDate, 'MMMM dd, yyyy')}
                                        </span>
                                        <span className="flex items-center">
                                            <User className="mr-1 h-4 w-4" />
                                            {evaluation.evaluator.name} ({evaluation.evaluator.title})
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-gray-900">{evaluation.overallScore}</p>
                                    <p className="text-sm text-gray-500">out of {evaluation.maxScore}</p>
                                    <p className={`text-lg font-semibold ${getScoreColor(evaluation.overallScore, evaluation.maxScore)}`}>
                                        {percentage}%
                                    </p>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            {evaluation.status === 'completed' && (
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="mb-3 text-sm font-medium text-gray-900">Performance Metrics</h3>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {Object.entries(evaluation.metrics).map(([key, value]) => (
                                            <div key={key}>
                                                <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                <p className="text-lg font-semibold text-gray-900">{value}%</p>
                                                <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-blue-500"
                                                        style={{ width: `${value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Evaluation Sections */}
                            {evaluation.sections.map((section, idx) => (
                                <div key={idx} className="rounded-lg border border-gray-200">
                                    <button
                                        onClick={() => toggleSection(`${evaluation.id}-section-${idx}`)}
                                        className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{section.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                Score: {section.score}/{section.maxScore} ({Math.round((section.score / section.maxScore) * 100)}%)
                                            </p>
                                        </div>
                                        {expandedSections.includes(`${evaluation.id}-section-${idx}`) ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>

                                    {expandedSections.includes(`${evaluation.id}-section-${idx}`) && (
                                        <div className="border-t border-gray-200 p-4">
                                            <div className="space-y-3">
                                                {section.criteria.map((criterion, cIdx) => (
                                                    <div key={cIdx}>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">{criterion.name}</span>
                                                            <span className="text-sm text-gray-600">{criterion.score}/{criterion.maxScore}</span>
                                                        </div>
                                                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-200">
                                                            <div
                                                                className="h-full rounded-full bg-blue-500"
                                                                style={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }}
                                                            />
                                                        </div>
                                                        {criterion.feedback && (
                                                            <p className="mt-1 text-xs text-gray-500">{criterion.feedback}</p>
                                                        )}
                                                    </div>
                                                ))}
                                                {section.feedback && (
                                                    <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                                        <p className="text-sm text-blue-800">{section.feedback}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Strengths */}
                            {evaluation.strengths.length > 0 && (
                                <div className="rounded-lg bg-green-50 p-4">
                                    <h3 className="mb-2 flex items-center text-sm font-semibold text-green-900">
                                        <ThumbsUp className="mr-2 h-4 w-4" />
                                        Strengths
                                    </h3>
                                    <ul className="list-inside list-disc space-y-1">
                                        {evaluation.strengths.map((strength, idx) => (
                                            <li key={idx} className="text-sm text-green-800">{strength}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Areas for Improvement */}
                            {evaluation.areasForImprovement.length > 0 && (
                                <div className="rounded-lg bg-yellow-50 p-4">
                                    <h3 className="mb-2 flex items-center text-sm font-semibold text-yellow-900">
                                        <ThumbsDown className="mr-2 h-4 w-4" />
                                        Areas for Improvement
                                    </h3>
                                    <ul className="list-inside list-disc space-y-1">
                                        {evaluation.areasForImprovement.map((area, idx) => (
                                            <li key={idx} className="text-sm text-yellow-800">{area}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Comments */}
                            {evaluation.comments && (
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <h3 className="mb-2 flex items-center text-sm font-semibold text-blue-900">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Supervisor Comments
                                    </h3>
                                    <p className="text-sm text-blue-800">{evaluation.comments}</p>
                                </div>
                            )}

                            {/* Recommendations */}
                            {evaluation.recommendations.length > 0 && (
                                <div className="rounded-lg bg-purple-50 p-4">
                                    <h3 className="mb-2 flex items-center text-sm font-semibold text-purple-900">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Recommendations
                                    </h3>
                                    <ul className="list-inside list-disc space-y-1">
                                        {evaluation.recommendations.map((rec, idx) => (
                                            <li key={idx} className="text-sm text-purple-800">{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Next Steps */}
                            {evaluation.nextSteps && (
                                <div className="rounded-lg bg-indigo-50 p-4">
                                    <h3 className="mb-2 flex items-center text-sm font-semibold text-indigo-900">
                                        <Target className="mr-2 h-4 w-4" />
                                        Next Steps
                                    </h3>
                                    <p className="text-sm text-indigo-800">{evaluation.nextSteps}</p>
                                </div>
                            )}

                            {/* Attachments */}
                            {evaluation.attachments && evaluation.attachments.length > 0 && (
                                <div>
                                    <h3 className="mb-2 text-sm font-medium text-gray-900">Attachments</h3>
                                    <div className="space-y-2">
                                        {evaluation.attachments.map((attachment, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                                                <div className="flex items-center">
                                                    <FileText className="mr-2 h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{attachment.name}</span>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-700">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Evaluations & Feedback</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                View your performance evaluations and feedback from supervisors
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <button className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                <Printer className="mr-2 h-4 w-4" />
                                Print Summary
                            </button>
                            <button className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                <Download className="mr-2 h-4 w-4" />
                                Export All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Overall Performance</p>
                                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                                <p className="text-xs text-green-600">+6% from last month</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Evaluations</p>
                                <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
                                <p className="text-xs text-blue-600">{completedEvaluations.length} completed</p>
                            </div>
                            <ClipboardList className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Highest Score</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {Math.max(...completedEvaluations.map(e => (e.overallScore / e.maxScore) * 100), 0)}%
                                </p>
                                <p className="text-xs text-gray-500">Week 4 Evaluation</p>
                            </div>
                            <Award className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Reviews</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {evaluations.filter(e => e.status === 'pending').length}
                                </p>
                                <p className="text-xs text-orange-600">Awaiting feedback</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search evaluations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="mid_term">Mid-Term</option>
                        <option value="final">Final</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                {/* Evaluations Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredEvaluations.map((evaluation) => {
                        const percentage = evaluation.status === 'completed'
                            ? (evaluation.overallScore / evaluation.maxScore) * 100
                            : 0;
                        const isOverdue = evaluation.status === 'overdue' ||
                            (evaluation.status === 'pending' && isAfter(new Date(), evaluation.dueDate));

                        return (
                            <div
                                key={evaluation.id}
                                className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                onClick={() => {
                                    setSelectedEvaluation(evaluation);
                                    setShowDetailsModal(true);
                                }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{evaluation.title}</h3>
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEvaluationTypeColor(evaluation.type)}`}>
                                                {evaluation.type.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${evaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                isOverdue ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {evaluation.status === 'completed' ? (
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                ) : isOverdue ? (
                                                    <AlertCircle className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <Clock className="mr-1 h-3 w-3" />
                                                )}
                                                {evaluation.status === 'completed' ? 'Completed' :
                                                    isOverdue ? 'Overdue' : 'Pending'}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <User className="mr-1 h-4 w-4" />
                                                {evaluation.evaluator.name} ({evaluation.evaluator.title})
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {evaluation.status === 'completed'
                                                    ? `Evaluated: ${format(evaluation.evaluationDate, 'MMM dd, yyyy')}`
                                                    : `Due: ${format(evaluation.dueDate, 'MMM dd, yyyy')}`}
                                            </span>
                                        </div>

                                        {evaluation.status === 'completed' && (
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Overall Score</span>
                                                    <span className={`font-medium ${getScoreColor(evaluation.overallScore, evaluation.maxScore)}`}>
                                                        {evaluation.overallScore}/{evaluation.maxScore} ({Math.round(percentage)}%)
                                                    </span>
                                                </div>
                                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Preview of strengths or comments */}
                                        {evaluation.status === 'completed' && evaluation.strengths.length > 0 && (
                                            <div className="mt-3 flex items-start space-x-2">
                                                <ThumbsUp className="mt-0.5 h-4 w-4 text-green-500" />
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {evaluation.strengths[0]}
                                                    {evaluation.strengths.length > 1 && ` +${evaluation.strengths.length - 1} more`}
                                                </p>
                                            </div>
                                        )}

                                        {evaluation.comments && (
                                            <div className="mt-2 flex items-start space-x-2">
                                                <MessageCircle className="mt-0.5 h-4 w-4 text-blue-500" />
                                                <p className="text-sm text-gray-500 line-clamp-2">{evaluation.comments}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center space-x-2 lg:mt-0">
                                        <button className="flex items-center rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                                            <Eye className="mr-1 h-4 w-4" />
                                            View Details
                                        </button>
                                        {evaluation.status === 'completed' && (
                                            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredEvaluations.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12">
                        <Star className="h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No evaluations found</h3>
                        <p className="mt-1 text-sm text-gray-500">Your evaluations will appear here once completed</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedEvaluation && (
                <EvaluationDetailsModal evaluation={selectedEvaluation} />
            )}
        </div>
    );
}