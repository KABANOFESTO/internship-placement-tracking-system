// app/dashboard/internship-applications/page.tsx
'use client';

import { useState, type Dispatch, type SetStateAction, type ChangeEvent, type FormEvent } from 'react';
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileText,
    MapPin,
    Plus,
    Send,
    Trash2,
    AlertCircle,
    ChevronDown,
    ChevronRight,
    X,
    Upload,
    Building2,
    GraduationCap,
    Languages,
    Award,
    Heart,
    BookOpen,
    User,
    Mail,
    Phone,
    Calendar as CalendarIcon,
    Save,
    Edit2,
    Filter,
    Search,
    MoreVertical,
    ExternalLink,
    ThumbsUp,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

// Types
interface InternshipApplication {
    id: string;
    position: string;
    department: string;
    hospital: string;
    location: string;
    appliedDate: Date;
    status: 'pending' | 'reviewing' | 'shortlisted' | 'accepted' | 'rejected' | 'waitlisted';
    startDate?: Date;
    duration?: string;
    supervisor?: string;
    documents?: string[];
    feedback?: string;
}

interface InternshipPosition {
    id: string;
    title: string;
    department: string;
    hospital: string;
    location: string;
    duration: string;
    startDate: Date;
    endDate: Date;
    spots: number;
    spotsLeft: number;
    requirements: string[];
    skills: string[];
    description: string;
    stipend?: string;
    isFeatured: boolean;
}

interface ApplicationFormData {
    positionId: string;
    coverLetter: string;
    cvFile: File | null;
    transcripts: File | null;
    recommendations: File | null;
    additionalNotes: string;
    preferredStartDate: Date | null;
    skills: string[];
    languages: string[];
    availability: string;
}

// Mock data - Replace with actual API calls
const mockApplications: InternshipApplication[] = [
    {
        id: '1',
        position: 'General Surgery Intern',
        department: 'Surgery',
        hospital: 'City General Hospital',
        location: 'Downtown Medical Center',
        appliedDate: new Date(2024, 1, 15),
        status: 'accepted',
        startDate: new Date(2024, 2, 1),
        duration: '3 months',
        supervisor: 'Dr. Sarah Johnson',
        feedback: 'Excellent fit for the department. Strong academic record and relevant skills.'
    },
    {
        id: '2',
        position: 'Pediatrics Resident',
        department: 'Pediatrics',
        hospital: 'Children\'s Medical Center',
        location: 'Northside Health Campus',
        appliedDate: new Date(2024, 1, 20),
        status: 'reviewing',
        documents: ['CV.pdf', 'transcript.pdf']
    },
    {
        id: '3',
        position: 'Cardiology Observer',
        department: 'Cardiology',
        hospital: 'Heart Institute',
        location: 'Westside Medical Plaza',
        appliedDate: new Date(2024, 1, 10),
        status: 'shortlisted',
        startDate: new Date(2024, 3, 1),
        duration: '2 months'
    },
    {
        id: '4',
        position: 'Emergency Medicine Intern',
        department: 'Emergency',
        hospital: 'Regional Medical Center',
        location: 'Eastside Hospital',
        appliedDate: new Date(2024, 1, 5),
        status: 'pending',
        startDate: new Date(2024, 4, 1),
        duration: '4 months'
    },
    {
        id: '5',
        position: 'Radiology Assistant',
        department: 'Radiology',
        hospital: 'Advanced Imaging Center',
        location: 'South Medical District',
        appliedDate: new Date(2024, 0, 28),
        status: 'rejected',
        feedback: 'Position has been filled. We encourage you to apply for future opportunities.'
    },
    {
        id: '6',
        position: 'Neurology Intern',
        department: 'Neurology',
        hospital: 'Neuroscience Institute',
        location: 'University Medical Center',
        appliedDate: new Date(2024, 1, 18),
        status: 'waitlisted',
        startDate: new Date(2024, 3, 15),
        duration: '3 months'
    }
];

const mockAvailablePositions: InternshipPosition[] = [
    {
        id: '1',
        title: 'General Surgery Intern',
        department: 'Surgery',
        hospital: 'City General Hospital',
        location: 'Downtown Medical Center',
        duration: '3 months',
        startDate: new Date(2024, 3, 1),
        endDate: new Date(2024, 5, 30),
        spots: 5,
        spotsLeft: 2,
        requirements: ['Completed 3rd year', 'Basic surgical skills', 'BLS certified'],
        skills: ['Suturing', 'Patient assessment', 'Medical documentation'],
        description: 'Join our surgical team for hands-on experience in general surgery procedures. Work alongside experienced surgeons and participate in patient care.',
        stipend: '$500/month',
        isFeatured: true
    },
    {
        id: '2',
        title: 'Pediatrics Resident',
        department: 'Pediatrics',
        hospital: 'Children\'s Medical Center',
        location: 'Northside Health Campus',
        duration: '4 months',
        startDate: new Date(2024, 4, 1),
        endDate: new Date(2024, 7, 31),
        spots: 8,
        spotsLeft: 4,
        requirements: ['Pediatrics rotation completed', 'Strong communication skills'],
        skills: ['Child development', 'Vaccination protocols', 'Parent education'],
        description: 'Work in a fast-paced pediatric environment. Gain experience in well-child visits, acute care, and developmental assessments.',
        stipend: '$600/month',
        isFeatured: false
    },
    {
        id: '3',
        title: 'Cardiology Research Intern',
        department: 'Cardiology',
        hospital: 'Heart Institute',
        location: 'Westside Medical Plaza',
        duration: '6 months',
        startDate: new Date(2024, 5, 1),
        endDate: new Date(2024, 10, 31),
        spots: 3,
        spotsLeft: 1,
        requirements: ['Research experience', 'Statistics knowledge', 'ECG interpretation'],
        skills: ['Data analysis', 'Research methodology', 'Medical writing'],
        description: 'Participate in cutting-edge cardiovascular research. Assist in clinical trials and data collection for ongoing studies.',
        stipend: '$700/month',
        isFeatured: true
    },
    {
        id: '4',
        title: 'Emergency Medicine Intern',
        department: 'Emergency',
        hospital: 'Regional Medical Center',
        location: 'Eastside Hospital',
        duration: '3 months',
        startDate: new Date(2024, 3, 15),
        endDate: new Date(2024, 6, 14),
        spots: 6,
        spotsLeft: 3,
        requirements: ['ACLS certified', 'Triage experience', 'Crisis management'],
        skills: ['Rapid assessment', 'Trauma care', 'Team coordination'],
        description: 'Experience the fast-paced environment of emergency medicine. Learn triage, acute care management, and emergency procedures.',
        stipend: '$550/month',
        isFeatured: false
    }
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'accepted':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'reviewing':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'shortlisted':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'waitlisted':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'accepted':
            return CheckCircle2;
        case 'reviewing':
            return Clock;
        case 'shortlisted':
            return ThumbsUp;
        case 'pending':
            return Clock;
        case 'rejected':
            return X;
        case 'waitlisted':
            return AlertCircle;
        default:
            return Clock;
    }
};

type ApplicationModalProps = {
    selectedPosition: InternshipPosition | null;
    formData: ApplicationFormData;
    setFormData: Dispatch<SetStateAction<ApplicationFormData>>;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>, field: 'cvFile' | 'transcripts' | 'recommendations') => void;
    handleSubmitApplication: (e: FormEvent) => void;
    isSubmitting: boolean;
    onClose: () => void;
};

const ApplicationModal = ({
    selectedPosition,
    formData,
    setFormData,
    handleFileChange,
    handleSubmitApplication,
    isSubmitting,
    onClose
}: ApplicationModalProps) => {
    if (!selectedPosition) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                {/* Modal Header */}
                <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Apply for Internship</h2>
                            <p className="mt-1 text-sm text-gray-500">{selectedPosition.title} at {selectedPosition.hospital}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmitApplication} className="p-6">
                    <div className="space-y-6">
                        {/* Personal Information Section */}
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Personal Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        value="Sarah Johnson"
                                        disabled
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                    <input
                                        type="text"
                                        value="STU-2024-001"
                                        disabled
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value="sarah.johnson@university.edu"
                                        disabled
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        value="+1 (555) 123-4567"
                                        disabled
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Cover Letter <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={5}
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Explain why you're interested in this position and why you're a good fit..."
                                required
                            />
                        </div>

                        {/* Documents Upload */}
                        <div>
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Required Documents</h3>
                            <div className="space-y-4">
                                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                                    <label className="flex cursor-pointer flex-col items-center">
                                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Upload CV/Resume</span>
                                        <span className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, 'cvFile')}
                                        />
                                    </label>
                                    {formData.cvFile && (
                                        <div className="mt-2 flex items-center justify-between rounded bg-white p-2">
                                            <span className="text-sm text-gray-600">{formData.cvFile.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, cvFile: null })}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                                    <label className="flex cursor-pointer flex-col items-center">
                                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Academic Transcripts</span>
                                        <span className="text-xs text-gray-500">PDF (Max 5MB)</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, 'transcripts')}
                                        />
                                    </label>
                                    {formData.transcripts && (
                                        <div className="mt-2 flex items-center justify-between rounded bg-white p-2">
                                            <span className="text-sm text-gray-600">{formData.transcripts.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, transcripts: null })}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                                    <label className="flex cursor-pointer flex-col items-center">
                                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Letters of Recommendation</span>
                                        <span className="text-xs text-gray-500">PDF (Max 5MB)</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, 'recommendations')}
                                        />
                                    </label>
                                    {formData.recommendations && (
                                        <div className="mt-2 flex items-center justify-between rounded bg-white p-2">
                                            <span className="text-sm text-gray-600">{formData.recommendations.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, recommendations: null })}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Skills & Languages */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Skills</label>
                                <select
                                    multiple
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    value={formData.skills}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setFormData({ ...formData, skills: selected });
                                    }}
                                >
                                    <option value="patient-care">Patient Care</option>
                                    <option value="medical-documentation">Medical Documentation</option>
                                    <option value="team-collaboration">Team Collaboration</option>
                                    <option value="critical-thinking">Critical Thinking</option>
                                    <option value="communication">Communication</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Languages</label>
                                <select
                                    multiple
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    value={formData.languages}
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setFormData({ ...formData, languages: selected });
                                    }}
                                >
                                    <option value="english">English (Native)</option>
                                    <option value="spanish">Spanish</option>
                                    <option value="french">French</option>
                                    <option value="mandarin">Mandarin</option>
                                    <option value="arabic">Arabic</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                            <textarea
                                rows={3}
                                value={formData.additionalNotes}
                                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Any additional information you'd like to share..."
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

type ApplicationDetailsModalProps = {
    application: InternshipApplication;
    onClose: () => void;
};

const ApplicationDetailsModal = ({ application, onClose }: ApplicationDetailsModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
                        <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{application.position}</h3>
                                <p className="text-sm text-gray-500">{application.hospital}</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="text-sm font-medium text-gray-900">{application.department}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm font-medium text-gray-900">{application.location}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Applied Date</p>
                                <p className="text-sm font-medium text-gray-900">{format(application.appliedDate, 'MMMM dd, yyyy')}</p>
                            </div>
                            {application.startDate && (
                                <div>
                                    <p className="text-xs text-gray-500">Start Date</p>
                                    <p className="text-sm font-medium text-gray-900">{format(application.startDate, 'MMMM dd, yyyy')}</p>
                                </div>
                            )}
                            {application.duration && (
                                <div>
                                    <p className="text-xs text-gray-500">Duration</p>
                                    <p className="text-sm font-medium text-gray-900">{application.duration}</p>
                                </div>
                            )}
                            {application.supervisor && (
                                <div>
                                    <p className="text-xs text-gray-500">Supervisor</p>
                                    <p className="text-sm font-medium text-gray-900">{application.supervisor}</p>
                                </div>
                            )}
                        </div>

                        {application.feedback && (
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-700">Feedback</p>
                                <p className="mt-1 text-sm text-gray-600">{application.feedback}</p>
                            </div>
                        )}

                        {application.documents && application.documents.length > 0 && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">Submitted Documents</p>
                                <div className="space-y-2">
                                    {application.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                                <span className="text-sm text-gray-700">{doc}</span>
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

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function InternshipApplications() {
    const [activeTab, setActiveTab] = useState<'apply' | 'my-applications'>('my-applications');
    const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<InternshipPosition | null>(null);
    const [formData, setFormData] = useState<ApplicationFormData>({
        positionId: '',
        coverLetter: '',
        cvFile: null,
        transcripts: null,
        recommendations: null,
        additionalNotes: '',
        preferredStartDate: null,
        skills: [],
        languages: [],
        availability: 'full-time'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredApplications = mockApplications.filter(app => {
        const matchesSearch = app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.hospital.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'cvFile' | 'transcripts' | 'recommendations') => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, [field]: e.target.files[0] });
        }
    };

    const handleSubmitApplication = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Reset form and close modal
        setIsSubmitting(false);
        setShowApplicationModal(false);

        // Show success message (you can add a toast notification here)
        alert('Application submitted successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Internship Applications</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Apply for new internships and track your application progress
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setActiveTab('apply');
                                setSelectedPosition(mockAvailablePositions[0]);
                                setShowApplicationModal(true);
                            }}
                            className="mt-4 flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:mt-0"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Application
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('my-applications')}
                            className={`py-2 text-sm font-medium ${activeTab === 'my-applications'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            My Applications
                        </button>
                        <button
                            onClick={() => setActiveTab('apply')}
                            className={`py-2 text-sm font-medium ${activeTab === 'apply'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Available Positions
                        </button>
                    </nav>
                </div>

                {/* My Applications Tab */}
                {activeTab === 'my-applications' && (
                    <div>
                        {/* Filters and Search */}
                        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="rounded-lg border border-gray-300 pl-10 pr-8 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="waitlisted">Waitlisted</option>
                                </select>
                            </div>
                        </div>

                        {/* Applications Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {filteredApplications.map((application) => {
                                const StatusIcon = getStatusIcon(application.status);
                                return (
                                    <div
                                        key={application.id}
                                        className="group cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                                        onClick={() => setSelectedApplication(application)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{application.position}</h3>
                                                    {application.status === 'accepted' && (
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Accepted
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{application.hospital}</p>
                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <Building2 className="mr-1 h-4 w-4" />
                                                        {application.department}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MapPin className="mr-1 h-4 w-4" />
                                                        {application.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="mr-1 h-4 w-4" />
                                                        Applied {formatDistanceToNow(application.appliedDate, { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center space-x-2 rounded-full px-3 py-1 ${getStatusColor(application.status)}`}>
                                                <StatusIcon className="h-4 w-4" />
                                                <span className="text-sm font-medium capitalize">{application.status}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedApplication(application);
                                                    }}
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    View Details
                                                </button>
                                                {application.status === 'accepted' && (
                                                    <button className="flex items-center text-sm text-green-600 hover:text-green-700">
                                                        <MessageCircle className="mr-1 h-4 w-4" />
                                                        Contact Supervisor
                                                    </button>
                                                )}
                                            </div>
                                            {application.status === 'accepted' && application.startDate && (
                                                <div className="text-xs text-gray-500">
                                                    Starts {format(application.startDate, 'MMM dd, yyyy')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredApplications.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12">
                                <Briefcase className="h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
                                <p className="mt-1 text-sm text-gray-500">Start your internship journey by applying to available positions.</p>
                                <button
                                    onClick={() => setActiveTab('apply')}
                                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Browse Positions
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Available Positions Tab */}
                {activeTab === 'apply' && (
                    <div>
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search available positions..."
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {mockAvailablePositions.map((position) => (
                                <div
                                    key={position.id}
                                    className="relative rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                                >
                                    {position.isFeatured && (
                                        <div className="absolute -top-2 right-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-medium text-white">
                                            Featured
                                        </div>
                                    )}
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <Building2 className="mr-1 h-4 w-4" />
                                                    {position.hospital}
                                                </span>
                                                <span className="flex items-center">
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    {position.location}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    {format(position.startDate, 'MMM dd')} - {format(position.endDate, 'MMM dd, yyyy')}
                                                </span>
                                                <span className="flex items-center">
                                                    <Clock className="mr-1 h-4 w-4" />
                                                    {position.duration}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm text-gray-600">{position.description}</p>

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {position.requirements.map((req, index) => (
                                                        <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                                            {req}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-900">Required Skills:</h4>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {position.skills.map((skill, index) => (
                                                        <span key={index} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                                {position.stipend && (
                                                    <div className="flex items-center text-sm text-green-600">
                                                        <Award className="mr-1 h-4 w-4" />
                                                        {position.stipend}
                                                    </div>
                                                )}
                                                <div className="flex items-center text-sm text-orange-600">
                                                    <Users className="mr-1 h-4 w-4" />
                                                    {position.spotsLeft} of {position.spots} spots remaining
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 lg:mt-0 lg:ml-6">
                                            <button
                                                onClick={() => {
                                                    setSelectedPosition(position);
                                                    setShowApplicationModal(true);
                                                }}
                                                className="w-full rounded-lg bg-blue-600 px-6 py-2 text-white transition-all hover:bg-blue-700 lg:w-auto"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showApplicationModal && (
                <ApplicationModal
                    selectedPosition={selectedPosition}
                    formData={formData}
                    setFormData={setFormData}
                    handleFileChange={handleFileChange}
                    handleSubmitApplication={handleSubmitApplication}
                    isSubmitting={isSubmitting}
                    onClose={() => setShowApplicationModal(false)}
                />
            )}
            {selectedApplication && (
                <ApplicationDetailsModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    );
}

// Add Users icon import if needed
const Users = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
