// app/dashboard/placement-status/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Clock,
    MapPin,
    Building2,
    User,
    Calendar,
    Mail,
    Phone,
    FileText,
    Download,
    MessageCircle,
    AlertCircle,
    ChevronRight,
    Briefcase,
    Award,
    GraduationCap,
    Timer,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    X
} from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';

// Types
interface PlacementDetails {
    id: string;
    status: 'pending' | 'under_review' | 'offered' | 'accepted' | 'rejected' | 'waitlisted' | 'confirmed' | 'completed';
    appliedDate: Date;
    decisionDate?: Date;
    acceptanceDeadline?: Date;

    // Internship Details
    internship: {
        title: string;
        department: string;
        hospital: string;
        location: string;
        startDate: Date;
        endDate: Date;
        duration: string;
        hoursPerWeek: number;
        stipend?: string;
        description: string;
    };

    // Supervisor Details
    supervisor?: {
        id: string;
        name: string;
        title: string;
        department: string;
        email: string;
        phone: string;
        office: string;
        image?: string;
        bio?: string;
    };

    // Documents
    offerLetter?: {
        url: string;
        filename: string;
        issuedDate: Date;
    };

    // Next Steps
    nextSteps: {
        title: string;
        description: string;
        dueDate?: Date;
        completed: boolean;
        action?: string;
        link?: string;
    }[];

    // Additional Info
    requirements?: string[];
    orientation?: {
        date: Date;
        location: string;
        details: string;
    };
    additionalNotes?: string;
}

interface ApplicationHistory {
    id: string;
    position: string;
    hospital: string;
    appliedDate: Date;
    status: string;
    decision?: string;
}

// Mock data - Replace with actual API calls
const mockPlacementDetails: PlacementDetails = {
    id: 'PL-2024-001',
    status: 'accepted',
    appliedDate: new Date(2024, 0, 15),
    decisionDate: new Date(2024, 1, 20),
    acceptanceDeadline: new Date(2024, 2, 1),

    internship: {
        title: 'General Surgery Intern',
        department: 'Department of Surgery',
        hospital: 'City General Hospital',
        location: 'Downtown Medical Center, 123 Healthcare Ave, New York, NY 10001',
        startDate: new Date(2024, 5, 1),
        endDate: new Date(2024, 7, 31),
        duration: '3 months (Full-time)',
        hoursPerWeek: 40,
        stipend: '$600/month',
        description: 'Join our surgical team for hands-on experience in general surgery procedures. You will work alongside experienced surgeons, participate in patient rounds, assist in surgical procedures, and contribute to research projects.',
    },

    supervisor: {
        id: 'SUP-001',
        name: 'Dr. Sarah Johnson',
        title: 'Chief of Surgery',
        department: 'General Surgery',
        email: 'sarah.johnson@citygeneral.org',
        phone: '(555) 123-4567',
        office: 'Room 304, Surgical Wing',
        bio: 'Dr. Johnson has over 15 years of experience in general surgery and has mentored numerous medical students and interns. She specializes in minimally invasive procedures and is dedicated to medical education.',
    },

    offerLetter: {
        url: '/documents/offer-letter.pdf',
        filename: 'Offer_Letter_City_General_2024.pdf',
        issuedDate: new Date(2024, 1, 20),
    },

    nextSteps: [
        {
            title: 'Complete Pre-internship Paperwork',
            description: 'Fill out all required forms including confidentiality agreement, emergency contact, and medical clearance.',
            dueDate: new Date(2024, 3, 15),
            completed: false,
            action: 'View Forms',
            link: '/dashboard/documents',
        },
        {
            title: 'Attend Orientation Session',
            description: 'Mandatory orientation for all incoming interns. Hospital tour and introduction to staff.',
            dueDate: new Date(2024, 4, 25),
            completed: false,
            action: 'RSVP',
            link: '#',
        },
        {
            title: 'Submit Vaccination Records',
            description: 'Provide proof of required vaccinations and recent health screening.',
            dueDate: new Date(2024, 4, 10),
            completed: true,
            action: 'View Submitted',
            link: '/dashboard/documents',
        },
        {
            title: 'Review Internship Guidelines',
            description: 'Read and understand the internship policies, code of conduct, and evaluation criteria.',
            dueDate: new Date(2024, 4, 30),
            completed: false,
            action: 'Download Handbook',
            link: '#',
        },
    ],

    orientation: {
        date: new Date(2024, 4, 25, 9, 0),
        location: 'Conference Room A, City General Hospital',
        details: 'Please arrive 15 minutes early. Bring your ID and orientation confirmation email. Dress code: Business casual. Lunch will be provided.',
    },

    additionalNotes: 'Please complete all onboarding documents before the orientation date. Contact HR if you have any questions about the pre-employment requirements.',
};

const mockApplicationHistory: ApplicationHistory[] = [
    {
        id: '1',
        position: 'General Surgery Intern',
        hospital: 'City General Hospital',
        appliedDate: new Date(2024, 0, 15),
        status: 'Accepted',
        decision: 'Offer Accepted',
    },
    {
        id: '2',
        position: 'Pediatrics Resident',
        hospital: 'Children\'s Medical Center',
        appliedDate: new Date(2024, 0, 20),
        status: 'Waitlisted',
        decision: 'Waitlisted',
    },
    {
        id: '3',
        position: 'Cardiology Observer',
        hospital: 'Heart Institute',
        appliedDate: new Date(2024, 0, 10),
        status: 'Rejected',
        decision: 'Position Filled',
    },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'accepted':
        case 'confirmed':
            return {
                icon: CheckCircle2,
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-200',
                title: 'Placement Confirmed',
                message: 'Your internship placement has been confirmed. Please complete the next steps before your start date.',
            };
        case 'offered':
            return {
                icon: Award,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
                borderColor: 'border-blue-200',
                title: 'Offer Received',
                message: 'Congratulations! You have received an offer. Please accept or decline by the deadline.',
            };
        case 'under_review':
            return {
                icon: Clock,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                borderColor: 'border-yellow-200',
                title: 'Application Under Review',
                message: 'Your application is being reviewed by the placement committee.',
            };
        case 'waitlisted':
            return {
                icon: Timer,
                color: 'text-orange-600',
                bgColor: 'bg-orange-100',
                borderColor: 'border-orange-200',
                title: 'Waitlisted',
                message: 'You have been placed on the waitlist. We will notify you if a position becomes available.',
            };
        default:
            return {
                icon: AlertCircle,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-200',
                title: 'Placement Pending',
                message: 'Your placement is currently being processed.',
            };
    }
};

export default function PlacementStatus() {
    const [placement, setPlacement] = useState<PlacementDetails | null>(mockPlacementDetails);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showSupervisorDetails, setShowSupervisorDetails] = useState(false);
    const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
    const [daysUntilStart, setDaysUntilStart] = useState<number | null>(null);
    const [, setDaysUntilDeadline] = useState<number | null>(null);

    useEffect(() => {
        if (placement) {
            const daysStart = differenceInDays(placement.internship.startDate, new Date());
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDaysUntilStart(daysStart);

            if (placement.acceptanceDeadline) {
                const daysDeadline = differenceInDays(placement.acceptanceDeadline, new Date());
                setDaysUntilDeadline(daysDeadline);
            }
        }
    }, [placement]);

    const statusConfig = placement ? getStatusConfig(placement.status) : getStatusConfig('pending');

    const handleAcceptOffer = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowOfferModal(false);
        // Update placement status
        setPlacement(prev => prev ? { ...prev, status: 'accepted' } : null);
    };

    const toggleStepExpanded = (stepTitle: string) => {
        setExpandedSteps(prev =>
            prev.includes(stepTitle)
                ? prev.filter(s => s !== stepTitle)
                : [...prev, stepTitle]
        );
    };

    if (!placement) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Placement Found</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven&apos;t been assigned an internship yet.</p>
                    <Link
                        href="/dashboard/internship-applications"
                        className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Browse Internships
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Placement Status</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Track your internship placement progress and complete required steps
                            </p>
                        </div>
                        <div className={`mt-4 flex items-center space-x-2 rounded-lg ${statusConfig.bgColor} px-4 py-2 sm:mt-0`}>
                            <statusConfig.icon className={`h-5 w-5 ${statusConfig.color}`} />
                            <span className={`text-sm font-medium ${statusConfig.color}`}>
                                {statusConfig.title}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className={`mb-8 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} p-4`}>
                    <div className="flex items-start">
                        <statusConfig.icon className={`mt-0.5 h-5 w-5 ${statusConfig.color}`} />
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.title}</h3>
                            <p className="mt-1 text-sm text-gray-700">{statusConfig.message}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Internship Details */}
                    <div className="lg:col-span-2">
                        {/* Internship Card */}
                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Internship Details</h2>
                                <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{placement.internship.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{placement.internship.department}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-start space-x-3">
                                        <Building2 className="mt-0.5 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Hospital/Institution</p>
                                            <p className="text-sm text-gray-600">{placement.internship.hospital}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Location</p>
                                            <p className="text-sm text-gray-600">{placement.internship.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Duration</p>
                                            <p className="text-sm text-gray-600">
                                                {format(placement.internship.startDate, 'MMM dd, yyyy')} - {format(placement.internship.endDate, 'MMM dd, yyyy')}
                                                <span className="ml-2 text-xs text-gray-500">
                                                    ({placement.internship.duration})
                                                </span>
                                            </p>
                                            {daysUntilStart && daysUntilStart > 0 && (
                                                <p className="mt-1 text-xs text-blue-600">
                                                    Starts in {daysUntilStart} days
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Clock className="mt-0.5 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Hours/Week</p>
                                            <p className="text-sm text-gray-600">{placement.internship.hoursPerWeek} hours</p>
                                        </div>
                                    </div>

                                    {placement.internship.stipend && (
                                        <div className="flex items-start space-x-3">
                                            <Award className="mt-0.5 h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Stipend</p>
                                                <p className="text-sm text-green-600 font-medium">{placement.internship.stipend}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-700">{placement.internship.description}</p>
                                </div>

                                {placement.offerLetter && (
                                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Offer Letter</p>
                                                <p className="text-xs text-gray-500">
                                                    Issued: {format(placement.offerLetter.issuedDate, 'MMMM dd, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="flex items-center text-blue-600 hover:text-blue-700">
                                            <Download className="mr-2 h-4 w-4" />
                                            <span className="text-sm">Download</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Next Steps</h2>
                                <div className="text-sm text-gray-500">
                                    {placement.nextSteps.filter(step => step.completed).length} of {placement.nextSteps.length} completed
                                </div>
                            </div>

                            <div className="space-y-4">
                                {placement.nextSteps.map((step, index) => (
                                    <div key={index} className="rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center space-x-3">
                                                {step.completed ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                                )}
                                                <div>
                                                    <p className={`font-medium ${step.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                        {step.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{step.description}</p>
                                                    {step.dueDate && (
                                                        <p className="mt-1 text-xs text-orange-600">
                                                            Due: {format(step.dueDate, 'MMMM dd, yyyy')}
                                                            {differenceInDays(step.dueDate, new Date()) <= 7 && !step.completed && (
                                                                <span className="ml-2 text-red-600">(Soon!)</span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {step.action && (
                                                    <button className="rounded-lg px-3 py-1 text-sm text-blue-600 hover:bg-blue-50">
                                                        {step.action}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => toggleStepExpanded(step.title)}
                                                    className="rounded-lg p-1 hover:bg-gray-100"
                                                >
                                                    {expandedSteps.includes(step.title) ? (
                                                        <ChevronUp className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedSteps.includes(step.title) && (
                                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                                                <p className="text-sm text-gray-600">
                                                    Additional instructions: Please ensure all documents are properly formatted and uploaded through the documents section. Contact your coordinator if you need assistance.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Supervisor Information */}
                        {placement.supervisor && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Supervisor</h2>
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{placement.supervisor.name}</h3>
                                        <p className="text-sm text-gray-500">{placement.supervisor.title}</p>
                                        <p className="text-sm text-gray-500">{placement.supervisor.department}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <a href={`mailto:${placement.supervisor.email}`} className="text-blue-600 hover:underline">
                                                {placement.supervisor.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">{placement.supervisor.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">{placement.supervisor.office}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowSupervisorDetails(!showSupervisorDetails)}
                                        className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50"
                                    >
                                        <span className="font-medium text-gray-700">View Bio & Experience</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${showSupervisorDetails ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showSupervisorDetails && (
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-sm text-gray-600">{placement.supervisor.bio}</p>
                                        </div>
                                    )}

                                    <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                        <MessageCircle className="h-4 w-4" />
                                        <span>Send Message</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Orientation Information */}
                        {placement.orientation && (
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Orientation</h2>
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Date & Time</p>
                                            <p className="text-sm text-gray-600">
                                                {format(placement.orientation.date, 'EEEE, MMMM dd, yyyy')}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {format(placement.orientation.date, 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Location</p>
                                            <p className="text-sm text-gray-600">{placement.orientation.location}</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-3">
                                        <p className="text-sm text-blue-800">{placement.orientation.details}</p>
                                    </div>

                                    <button className="w-full rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                                        Add to Calendar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Application History */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Application History</h2>
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="space-y-4">
                                {mockApplicationHistory.map((app) => (
                                    <div key={app.id} className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{app.position}</p>
                                            <p className="text-xs text-gray-500">{app.hospital}</p>
                                            <p className="text-xs text-gray-400">
                                                Applied: {format(app.appliedDate, 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                app.status === 'Waitlisted' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        {placement.additionalNotes && (
                            <div className="rounded-2xl bg-yellow-50 p-6 shadow-sm">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                                    <div>
                                        <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                                        <p className="mt-1 text-sm text-yellow-700">{placement.additionalNotes}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Offer Acceptance Modal */}
            {showOfferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Accept Offer</h2>
                            <button
                                onClick={() => setShowOfferModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-gray-600">
                            Are you sure you want to accept the internship offer for{' '}
                            <span className="font-semibold">{placement.internship.title}</span> at{' '}
                            <span className="font-semibold">{placement.internship.hospital}</span>?
                        </p>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => setShowOfferModal(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAcceptOffer}
                                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                Accept Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}