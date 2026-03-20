// app/dashboard/my-internship/page.tsx
'use client';

import { useState, } from 'react';
import {
    Briefcase,
    Calendar,
    Clock,
    MapPin,
    Building2,
    User,
    Mail,
    Phone,
    Award,
    Star,
    CheckCircle2,
    ChevronRight,
    Download,
    Share2,
    ClipboardList,
    FileText,
    MessageCircle,
    ExternalLink,
    Shield,
    Target,
    CalendarDays,
    Printer,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';

// Types
interface InternshipDetails {
    id: string;
    title: string;
    department: string;
    hospital: string;
    location: string;
    startDate: Date;
    endDate: Date;
    duration: string;
    hoursPerWeek: number;
    totalHours: number;
    completedHours: number;
    status: 'active' | 'completed' | 'pending' | 'on_hold';
    stipend?: {
        amount: number;
        currency: string;
        frequency: string;
    };
    description: string;
    objectives: string[];
    responsibilities: string[];
    requiredSkills: string[];
    learningOutcomes: string[];
    schedule: {
        day: string;
        startTime: string;
        endTime: string;
        activities: string[];
    }[];
    importantDates: {
        title: string;
        date: Date;
        description: string;
    }[];
    documents: {
        name: string;
        type: string;
        url: string;
        uploadedAt: Date;
    }[];
    policies: {
        title: string;
        description: string;
        link?: string;
    }[];
}

interface Supervisor {
    id: string;
    name: string;
    title: string;
    department: string;
    specialization: string[];
    email: string;
    phone: string;
    office: string;
    officeHours: {
        day: string;
        startTime: string;
        endTime: string;
        location: string;
    }[];
    image?: string;
    bio: string;
    education: {
        degree: string;
        institution: string;
        year: number;
    }[];
    experience: {
        title: string;
        organization: string;
        period: string;
        description: string;
    }[];
    publications: {
        title: string;
        journal: string;
        year: number;
        link?: string;
    }[];
    researchInterests: string[];
    certifications: string[];
    languages: string[];
    availability: {
        day: string;
        slots: string[];
    }[];
    rating: number;
    reviews: number;
    feedback: {
        student: string;
        comment: string;
        rating: number;
        date: Date;
    }[];
}

// Mock data - Replace with actual API calls
const mockInternshipDetails: InternshipDetails = {
    id: 'INT-2024-001',
    title: 'General Surgery Intern',
    department: 'Department of Surgery',
    hospital: 'City General Hospital',
    location: '123 Healthcare Ave, Downtown Medical Center, New York, NY 10001',
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 7, 31),
    duration: '3 months (Full-time)',
    hoursPerWeek: 40,
    totalHours: 480,
    completedHours: 128,
    status: 'active',
    stipend: {
        amount: 600,
        currency: 'USD',
        frequency: 'monthly'
    },
    description: 'Join our surgical team for hands-on experience in general surgery procedures. This internship provides comprehensive exposure to preoperative, intraoperative, and postoperative patient care. You will work alongside experienced surgeons, participate in patient rounds, assist in surgical procedures, and contribute to clinical research projects.',
    objectives: [
        'Develop proficiency in patient assessment and surgical consultation',
        'Gain hands-on experience in surgical assisting and sterile technique',
        'Understand perioperative patient management and care coordination',
        'Participate in multidisciplinary team meetings and case discussions',
        'Complete a research project on surgical outcomes'
    ],
    responsibilities: [
        'Assist in surgical procedures under supervision',
        'Perform patient histories and physical examinations',
        'Participate in daily morning rounds and patient follow-up',
        'Document patient encounters and progress notes',
        'Attend department conferences and grand rounds',
        'Present cases during team meetings'
    ],
    requiredSkills: [
        'Basic surgical skills and sterile technique',
        'Patient assessment and physical examination',
        'Medical documentation and record keeping',
        'Team collaboration and communication',
        'Critical thinking and problem-solving'
    ],
    learningOutcomes: [
        'Master surgical assisting techniques',
        'Develop clinical reasoning skills',
        'Enhance communication with patients and families',
        'Understand healthcare team dynamics',
        'Apply evidence-based medicine in surgical care'
    ],
    schedule: [
        {
            day: 'Monday',
            startTime: '07:00',
            endTime: '15:00',
            activities: ['Morning Rounds', 'OR Observation', 'Clinic Follow-up', 'Case Review']
        },
        {
            day: 'Tuesday',
            startTime: '07:00',
            endTime: '16:00',
            activities: ['Morning Rounds', 'Surgical Assisting', 'Pre-op Consultations', 'Research Meeting']
        },
        {
            day: 'Wednesday',
            startTime: '08:00',
            endTime: '16:00',
            activities: ['Grand Rounds', 'Clinic Hours', 'Procedure Observations', 'Journal Club']
        },
        {
            day: 'Thursday',
            startTime: '07:00',
            endTime: '15:00',
            activities: ['Morning Rounds', 'Surgical Assisting', 'Post-op Care', 'Multidisciplinary Meeting']
        },
        {
            day: 'Friday',
            startTime: '08:00',
            endTime: '14:00',
            activities: ['Clinic Hours', 'Case Presentations', 'Research Work', 'Weekly Review']
        }
    ],
    importantDates: [
        {
            title: 'Mid-term Evaluation',
            date: new Date(2024, 6, 15),
            description: 'Performance review with supervisor and coordinator'
        },
        {
            title: 'Research Symposium',
            date: new Date(2024, 7, 10),
            description: 'Present research findings to department'
        },
        {
            title: 'Final Evaluation',
            date: new Date(2024, 7, 28),
            description: 'Final performance assessment and feedback session'
        }
    ],
    documents: [
        {
            name: 'Internship Agreement',
            type: 'PDF',
            url: '/docs/agreement.pdf',
            uploadedAt: new Date(2024, 4, 15)
        },
        {
            name: 'Orientation Handbook',
            type: 'PDF',
            url: '/docs/handbook.pdf',
            uploadedAt: new Date(2024, 4, 20)
        },
        {
            name: 'Safety Protocols',
            type: 'PDF',
            url: '/docs/safety.pdf',
            uploadedAt: new Date(2024, 4, 25)
        }
    ],
    policies: [
        {
            title: 'Attendance Policy',
            description: '80% attendance required. All absences must be reported 24 hours in advance.'
        },
        {
            title: 'Professional Conduct',
            description: 'Adhere to hospital dress code and professional behavior standards.'
        },
        {
            title: 'Confidentiality',
            description: 'Maintain patient confidentiality as per HIPAA guidelines.'
        }
    ]
};

const mockSupervisor: Supervisor = {
    id: 'SUP-001',
    name: 'Dr. Sarah Johnson',
    title: 'Chief of Surgery',
    department: 'General Surgery',
    specialization: ['Minimally Invasive Surgery', 'Oncologic Surgery', 'Surgical Education'],
    email: 'sarah.johnson@citygeneral.org',
    phone: '(555) 123-4567',
    office: 'Room 304, Surgical Wing, City General Hospital',
    officeHours: [
        {
            day: 'Monday',
            startTime: '13:00',
            endTime: '16:00',
            location: 'Surgical Suite Office'
        },
        {
            day: 'Wednesday',
            startTime: '14:00',
            endTime: '17:00',
            location: 'Clinic Office B'
        },
        {
            day: 'Friday',
            startTime: '10:00',
            endTime: '12:00',
            location: 'Virtual via Zoom'
        }
    ],
    bio: 'Dr. Sarah Johnson is a board-certified general surgeon with over 15 years of experience. She specializes in minimally invasive surgical techniques and has a passion for medical education. Dr. Johnson has mentored over 50 medical students and residents, and is committed to fostering the next generation of surgeons. She is actively involved in clinical research and has published extensively in the field of surgical oncology.',
    education: [
        {
            degree: 'MD, Medicine',
            institution: 'Harvard Medical School',
            year: 2005
        },
        {
            degree: 'Residency, General Surgery',
            institution: 'Johns Hopkins Hospital',
            year: 2010
        },
        {
            degree: 'Fellowship, Surgical Oncology',
            institution: 'MD Anderson Cancer Center',
            year: 2012
        }
    ],
    experience: [
        {
            title: 'Chief of Surgery',
            organization: 'City General Hospital',
            period: '2020 - Present',
            description: 'Lead surgical department operations, oversee quality improvement initiatives, and mentor surgical residents.'
        },
        {
            title: 'Associate Professor of Surgery',
            organization: 'University of Medicine',
            period: '2015 - Present',
            description: 'Teach medical students and residents, develop curriculum, and conduct research in surgical education.'
        },
        {
            title: 'Attending Surgeon',
            organization: 'Memorial Sloan Kettering',
            period: '2012 - 2020',
            description: 'Performed complex oncologic surgeries and participated in clinical trials.'
        }
    ],
    publications: [
        {
            title: 'Minimally Invasive Approaches in Colorectal Surgery',
            journal: 'Annals of Surgery',
            year: 2023,
            link: '#'
        },
        {
            title: 'Surgical Education in the Digital Age',
            journal: 'Journal of Surgical Education',
            year: 2022,
            link: '#'
        },
        {
            title: 'Outcomes of Laparoscopic vs. Open Surgery',
            journal: 'JAMA Surgery',
            year: 2021,
            link: '#'
        }
    ],
    researchInterests: [
        'Surgical Outcomes Research',
        'Medical Education',
        'Minimally Invasive Techniques',
        'Oncologic Surgery',
        'Patient Safety'
    ],
    certifications: [
        'American Board of Surgery - Certified',
        'Advanced Trauma Life Support (ATLS)',
        'Fundamentals of Laparoscopic Surgery (FLS)',
        'Surgical Education Research Fellowship'
    ],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    availability: [
        {
            day: 'Monday',
            slots: ['13:00', '14:00', '15:00']
        },
        {
            day: 'Wednesday',
            slots: ['14:00', '15:00', '16:00']
        },
        {
            day: 'Friday',
            slots: ['10:00', '11:00']
        }
    ],
    rating: 4.9,
    reviews: 47,
    feedback: [
        {
            student: 'Michael Chen',
            comment: 'Dr. Johnson is an exceptional mentor. She provides detailed feedback and genuinely cares about student development.',
            rating: 5,
            date: new Date(2024, 0, 15)
        },
        {
            student: 'Emily Rodriguez',
            comment: 'Great supervisor! Very knowledgeable and always willing to explain complex concepts.',
            rating: 5,
            date: new Date(2023, 11, 10)
        },
        {
            student: 'James Wilson',
            comment: 'Supportive and encouraging. Creates a positive learning environment.',
            rating: 4.8,
            date: new Date(2023, 10, 5)
        }
    ]
};

export default function MyInternship() {
    const [activeTab, setActiveTab] = useState<'details' | 'supervisor'>('details');
    const [internship] = useState<InternshipDetails>(mockInternshipDetails);
    const [supervisor] = useState<Supervisor>(mockSupervisor);
    const [expandedSections, setExpandedSections] = useState<string[]>(['schedule', 'documents']);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [showAllFeedback, setShowAllFeedback] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>('Monday');

    const progressPercentage = (internship.completedHours / internship.totalHours) * 100;
    const daysRemaining = differenceInDays(internship.endDate, new Date());
    const isActive = internship.status === 'active';

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowMessageModal(false);
        setMessageText('');
        alert('Message sent successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Internship</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                View and manage your current internship details
                            </p>
                        </div>
                        <div className="mt-4 flex items-center space-x-3 sm:mt-0">
                            <button className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </button>
                            <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {isActive && (
                    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                            <div className="flex-1">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Internship Progress</span>
                                    <span className="text-sm font-medium text-blue-600">
                                        {internship.completedHours}/{internship.totalHours} hours ({Math.round(progressPercentage)}%)
                                    </span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {format(internship.startDate, 'MMM dd')} - {format(internship.endDate, 'MMM dd, yyyy')}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="mr-1 h-4 w-4" />
                                        {daysRemaining} days remaining
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/progress-tracking"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                                Track Progress
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`py-2 text-sm font-medium ${activeTab === 'details'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Briefcase className="mr-2 inline h-4 w-4" />
                            Internship Details
                        </button>
                        <button
                            onClick={() => setActiveTab('supervisor')}
                            className={`py-2 text-sm font-medium ${activeTab === 'supervisor'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <User className="mr-2 inline h-4 w-4" />
                            Supervisor Info
                        </button>
                    </nav>
                </div>

                {/* Internship Details Tab */}
                {activeTab === 'details' && (
                    <div className="space-y-6">
                        {/* Overview Card */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2>
                                    <p className="mt-1 text-gray-600">{internship.department}</p>
                                    <div className="mt-4 flex flex-wrap gap-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Building2 className="mr-2 h-4 w-4" />
                                            {internship.hospital}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            {internship.location.split(',')[0]}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-2 h-4 w-4" />
                                            {internship.hoursPerWeek} hours/week
                                        </div>
                                        {internship.stipend && (
                                            <div className="flex items-center text-sm text-green-600">
                                                <Award className="mr-2 h-4 w-4" />
                                                {internship.stipend.currency} {internship.stipend.amount}/{internship.stipend.frequency}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-sm font-medium ${internship.status === 'active' ? 'bg-green-100 text-green-700' :
                                    internship.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600">{internship.description}</p>
                        </div>

                        {/* Objectives & Responsibilities */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center">
                                    <Target className="mr-2 h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Objectives</h3>
                                </div>
                                <ul className="space-y-2">
                                    {internship.objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                            <span className="text-sm text-gray-600">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center">
                                    <ClipboardList className="mr-2 h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Key Responsibilities</h3>
                                </div>
                                <ul className="space-y-2">
                                    {internship.responsibilities.map((responsibility, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-blue-100 text-center text-xs font-bold text-blue-600">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm text-gray-600">{responsibility}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <button
                                onClick={() => toggleSection('schedule')}
                                className="flex w-full items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
                                </div>
                                {expandedSections.includes('schedule') ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('schedule') && (
                                <div className="mt-4 space-y-3">
                                    {internship.schedule.map((day, index) => (
                                        <div key={index} className="rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900">{day.day}</h4>
                                                <span className="text-sm text-gray-500">
                                                    {day.startTime} - {day.endTime}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {day.activities.map((activity, idx) => (
                                                    <span key={idx} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                                                        {activity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Important Dates */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center">
                                <CalendarDays className="mr-2 h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Important Dates</h3>
                            </div>
                            <div className="space-y-3">
                                {internship.importantDates.map((date, index) => (
                                    <div key={index} className="flex items-start rounded-lg border border-gray-100 p-3">
                                        <div className="mr-4 text-center">
                                            <div className="text-xl font-bold text-blue-600">
                                                {format(date.date, 'dd')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {format(date.date, 'MMM')}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{date.title}</p>
                                            <p className="text-sm text-gray-500">{date.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <button
                                onClick={() => toggleSection('documents')}
                                className="flex w-full items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Resources & Documents</h3>
                                </div>
                                {expandedSections.includes('documents') ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('documents') && (
                                <div className="mt-4 space-y-3">
                                    {internship.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                                            <div className="flex items-center">
                                                <FileText className="mr-3 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {doc.type} • Uploaded {format(doc.uploadedAt, 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-700">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Policies */}
                        <div className="rounded-2xl bg-yellow-50 p-6 shadow-sm">
                            <div className="mb-3 flex items-center">
                                <Shield className="mr-2 h-5 w-5 text-yellow-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Important Policies</h3>
                            </div>
                            <div className="space-y-3">
                                {internship.policies.map((policy, index) => (
                                    <div key={index}>
                                        <p className="font-medium text-gray-900">{policy.title}</p>
                                        <p className="text-sm text-gray-600">{policy.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Supervisor Info Tab */}
                {activeTab === 'supervisor' && (
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex flex-col items-center text-center lg:flex-row lg:text-left">
                                    <div className="mb-4 lg:mb-0 lg:mr-6">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                                            <User className="h-12 w-12 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{supervisor.name}</h2>
                                        <p className="text-gray-600">{supervisor.title}</p>
                                        <p className="text-sm text-gray-500">{supervisor.department}</p>
                                        <div className="mt-2 flex items-center justify-center lg:justify-start">
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <span className="ml-2 text-sm text-gray-600">
                                                {supervisor.rating} ({supervisor.reviews} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-3 lg:mt-0">
                                    <button
                                        onClick={() => setShowMessageModal(true)}
                                        className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Send Message
                                    </button>
                                    <button className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Schedule Meeting
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Office Hours */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Mail className="mr-3 h-5 w-5 text-gray-400" />
                                        <a href={`mailto:${supervisor.email}`} className="text-blue-600 hover:underline">
                                            {supervisor.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="mr-3 h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">{supervisor.phone}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="mr-3 mt-0.5 h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700">{supervisor.office}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Office Hours</h3>
                                <div className="space-y-3">
                                    {supervisor.officeHours.map((hours, index) => (
                                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                            <span className="font-medium text-gray-700">{hours.day}</span>
                                            <span className="text-sm text-gray-600">
                                                {hours.startTime} - {hours.endTime}
                                            </span>
                                            <span className="text-xs text-gray-500">{hours.location}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bio & Experience */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Biography</h3>
                            <p className="text-gray-600">{supervisor.bio}</p>
                        </div>

                        {/* Education & Experience */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Education</h3>
                                <div className="space-y-4">
                                    {supervisor.education.map((edu, index) => (
                                        <div key={index}>
                                            <p className="font-medium text-gray-900">{edu.degree}</p>
                                            <p className="text-sm text-gray-600">{edu.institution}</p>
                                            <p className="text-xs text-gray-500">{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Experience</h3>
                                <div className="space-y-4">
                                    {supervisor.experience.map((exp, index) => (
                                        <div key={index}>
                                            <p className="font-medium text-gray-900">{exp.title}</p>
                                            <p className="text-sm text-gray-600">{exp.organization}</p>
                                            <p className="text-xs text-gray-500">{exp.period}</p>
                                            <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Research & Publications */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Research & Publications</h3>
                            <div className="space-y-4">
                                {supervisor.publications.map((pub, index) => (
                                    <div key={index} className="rounded-lg border border-gray-100 p-3">
                                        <p className="font-medium text-gray-900">{pub.title}</p>
                                        <p className="text-sm text-gray-600">{pub.journal} • {pub.year}</p>
                                        {pub.link && (
                                            <a href={pub.link} className="mt-1 inline-flex items-center text-sm text-blue-600 hover:underline">
                                                View Publication
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Specializations & Skills */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Specializations</h3>
                                <div className="flex flex-wrap gap-2">
                                    {supervisor.specialization.map((spec, index) => (
                                        <span key={index} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Research Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {supervisor.researchInterests.map((interest, index) => (
                                        <span key={index} className="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-600">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Certifications & Awards</h3>
                            <div className="flex flex-wrap gap-2">
                                {supervisor.certifications.map((cert, index) => (
                                    <span key={index} className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-600">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Student Feedback */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Student Feedback</h3>
                            <div className="space-y-4">
                                {(showAllFeedback ? supervisor.feedback : supervisor.feedback.slice(0, 2)).map((feedback, index) => (
                                    <div key={index} className="rounded-lg border border-gray-100 p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{feedback.student}</p>
                                                <div className="mt-1 flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(feedback.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {format(feedback.date, 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">&quot;{feedback.comment}&quot;</p>
                                    </div>
                                ))}
                                {supervisor.feedback.length > 2 && (
                                    <button
                                        onClick={() => setShowAllFeedback(!showAllFeedback)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        {showAllFeedback ? 'Show Less' : `Read All ${supervisor.feedback.length} Reviews`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Message {supervisor.name}
                            </h2>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <textarea
                            rows={5}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendMessage}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}