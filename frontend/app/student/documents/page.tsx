// app/dashboard/documents/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Folder,
    FileText,
    File,
    FileImage,
    FilePdf,
    FileSpreadsheet,
    Download,
    Upload,
    Trash2,
    Edit2,
    Share2,
    Search,
    Filter,
    Plus,
    X,
    ChevronDown,
    ChevronRight,
    Eye,
    Star,
    StarOff,
    MoreVertical,
    Copy,
    Move,
    Archive,
    Lock,
    Unlock,
    Clock,
    Calendar,
    User,
    HardDrive,
    CloudUpload,
    FolderPlus,
    RefreshCw,
    Grid3x3,
    List,
    SortAsc,
    SortDesc,
    Tag,
    Link2,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Info
} from 'lucide-react';
import { format, formatDistanceToNow, formatBytes } from 'date-fns';
import Link from 'next/link';

// Types
interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'jpg' | 'png' | 'txt' | 'other';
    category: 'internship_agreement' | 'report' | 'evaluation' | 'certificate' | 'identification' | 'transcript' | 'other';
    size: number;
    uploadDate: Date;
    lastModified: Date;
    url: string;
    thumbnail?: string;
    tags: string[];
    isStarred: boolean;
    isShared: boolean;
    sharedWith?: {
        name: string;
        role: string;
        email: string;
    }[];
    version: number;
    description?: string;
    status: 'draft' | 'final' | 'archived';
    folderId: string;
    createdBy: {
        name: string;
        role: string;
    };
}

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    color: string;
    isStarred: boolean;
    documentCount: number;
    path: string[];
}

// Mock data
const mockFolders: Folder[] = [
    {
        id: 'root',
        name: 'My Documents',
        parentId: null,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date(2024, 2, 15),
        color: 'blue',
        isStarred: true,
        documentCount: 12,
        path: ['My Documents']
    },
    {
        id: '1',
        name: 'Internship Agreements',
        parentId: 'root',
        createdAt: new Date(2024, 0, 5),
        updatedAt: new Date(2024, 2, 10),
        color: 'green',
        isStarred: true,
        documentCount: 2,
        path: ['My Documents', 'Internship Agreements']
    },
    {
        id: '2',
        name: 'Reports',
        parentId: 'root',
        createdAt: new Date(2024, 0, 5),
        updatedAt: new Date(2024, 2, 15),
        color: 'purple',
        isStarred: false,
        documentCount: 5,
        path: ['My Documents', 'Reports']
    },
    {
        id: '3',
        name: 'Evaluations',
        parentId: 'root',
        createdAt: new Date(2024, 0, 5),
        updatedAt: new Date(2024, 2, 12),
        color: 'orange',
        isStarred: false,
        documentCount: 3,
        path: ['My Documents', 'Evaluations']
    },
    {
        id: '4',
        name: 'Certificates',
        parentId: 'root',
        createdAt: new Date(2024, 0, 10),
        updatedAt: new Date(2024, 2, 8),
        color: 'red',
        isStarred: true,
        documentCount: 2,
        path: ['My Documents', 'Certificates']
    }
];

const mockDocuments: Document[] = [
    {
        id: '1',
        name: 'Internship_Agreement_Signed.pdf',
        type: 'pdf',
        category: 'internship_agreement',
        size: 2450000,
        uploadDate: new Date(2024, 1, 15),
        lastModified: new Date(2024, 1, 15),
        url: '/documents/agreement.pdf',
        tags: ['signed', 'official', 'contract'],
        isStarred: true,
        isShared: true,
        sharedWith: [
            { name: 'Dr. Sarah Johnson', role: 'Supervisor', email: 'sarah.johnson@hospital.org' }
        ],
        version: 1,
        description: 'Signed internship agreement for General Surgery rotation',
        status: 'final',
        folderId: '1',
        createdBy: { name: 'Sarah Johnson', role: 'Student' }
    },
    {
        id: '2',
        name: 'Weekly_Report_Week4.pdf',
        type: 'pdf',
        category: 'report',
        size: 1800000,
        uploadDate: new Date(2024, 2, 10),
        lastModified: new Date(2024, 2, 10),
        url: '/documents/week4.pdf',
        tags: ['weekly', 'clinical', 'approved'],
        isStarred: true,
        isShared: true,
        sharedWith: [
            { name: 'Dr. Sarah Johnson', role: 'Supervisor', email: 'sarah.johnson@hospital.org' }
        ],
        version: 2,
        description: 'Week 4 clinical rotation report with supervisor feedback',
        status: 'final',
        folderId: '2',
        createdBy: { name: 'Sarah Johnson', role: 'Student' }
    },
    {
        id: '3',
        name: 'Mid_Term_Evaluation.pdf',
        type: 'pdf',
        category: 'evaluation',
        size: 950000,
        uploadDate: new Date(2024, 1, 28),
        lastModified: new Date(2024, 1, 28),
        url: '/documents/midterm.pdf',
        tags: ['evaluation', 'midterm', 'feedback'],
        isStarred: false,
        isShared: false,
        version: 1,
        description: 'Mid-term performance evaluation by supervisor',
        status: 'final',
        folderId: '3',
        createdBy: { name: 'Dr. Sarah Johnson', role: 'Supervisor' }
    },
    {
        id: '4',
        name: 'Surgical_Skills_Certificate.pdf',
        type: 'pdf',
        category: 'certificate',
        size: 3200000,
        uploadDate: new Date(2024, 2, 5),
        lastModified: new Date(2024, 2, 5),
        url: '/documents/certificate.pdf',
        tags: ['certificate', 'surgical skills', 'achievement'],
        isStarred: true,
        isShared: false,
        version: 1,
        description: 'Certificate of completion - Surgical Skills Workshop',
        status: 'final',
        folderId: '4',
        createdBy: { name: 'Workshop Coordinator', role: 'Administrator' }
    },
    {
        id: '5',
        name: 'Monthly_Report_February.docx',
        type: 'docx',
        category: 'report',
        size: 4200000,
        uploadDate: new Date(2024, 1, 29),
        lastModified: new Date(2024, 2, 1),
        url: '/documents/feb_report.docx',
        tags: ['monthly', 'draft', 'in-progress'],
        isStarred: false,
        isShared: false,
        version: 3,
        description: 'Draft of monthly progress report for February',
        status: 'draft',
        folderId: '2',
        createdBy: { name: 'Sarah Johnson', role: 'Student' }
    },
    {
        id: '6',
        name: 'Student_ID_Card.jpg',
        type: 'jpg',
        category: 'identification',
        size: 450000,
        uploadDate: new Date(2024, 0, 10),
        lastModified: new Date(2024, 0, 10),
        url: '/documents/id.jpg',
        tags: ['id', 'identification'],
        isStarred: false,
        isShared: false,
        version: 1,
        description: 'Student identification card',
        status: 'final',
        folderId: 'root',
        createdBy: { name: 'Sarah Johnson', role: 'Student' }
    }
];

// File type icons and colors
const fileTypeConfig = {
    pdf: { icon: FilePdf, color: 'text-red-500', bgColor: 'bg-red-50' },
    doc: { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    docx: { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    xls: { icon: FileSpreadsheet, color: 'text-green-500', bgColor: 'bg-green-50' },
    xlsx: { icon: FileSpreadsheet, color: 'text-green-500', bgColor: 'bg-green-50' },
    ppt: { icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    pptx: { icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    jpg: { icon: FileImage, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    png: { icon: FileImage, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    txt: { icon: FileText, color: 'text-gray-500', bgColor: 'bg-gray-50' },
    other: { icon: File, color: 'text-gray-500', bgColor: 'bg-gray-50' }
};

const folderColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
};

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>(mockDocuments);
    const [folders, setFolders] = useState<Folder[]>(mockFolders);
    const [currentFolderId, setCurrentFolderId] = useState<string>('root');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterType, setFilterType] = useState<string>('all');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentFolder = folders.find(f => f.id === currentFolderId);
    const subFolders = folders.filter(f => f.parentId === currentFolderId);
    const currentDocuments = documents.filter(d => d.folderId === currentFolderId);

    const filteredDocuments = currentDocuments
        .filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = filterType === 'all' || doc.type === filterType;
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'size') {
                return sortOrder === 'asc'
                    ? a.size - b.size
                    : b.size - a.size;
            } else {
                return sortOrder === 'asc'
                    ? a.uploadDate.getTime() - b.uploadDate.getTime()
                    : b.uploadDate.getTime() - a.uploadDate.getTime();
            }
        });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Simulate upload
            const newDocument: Document = {
                id: (documents.length + 1).toString(),
                name: file.name,
                type: file.name.split('.').pop() as any,
                category: 'other',
                size: file.size,
                uploadDate: new Date(),
                lastModified: new Date(),
                url: URL.createObjectURL(file),
                tags: [],
                isStarred: false,
                isShared: false,
                version: 1,
                status: 'draft',
                folderId: currentFolderId,
                createdBy: { name: 'Sarah Johnson', role: 'Student' }
            };
            setDocuments([newDocument, ...documents]);
            setShowUploadModal(false);
        }
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            const newFolder: Folder = {
                id: (folders.length + 1).toString(),
                name: newFolderName,
                parentId: currentFolderId,
                createdAt: new Date(),
                updatedAt: new Date(),
                color: 'blue',
                isStarred: false,
                documentCount: 0,
                path: [...(currentFolder?.path || []), newFolderName]
            };
            setFolders([...folders, newFolder]);
            setNewFolderName('');
            setShowNewFolderModal(false);
        }
    };

    const handleDeleteDocument = (docId: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            setDocuments(documents.filter(d => d.id !== docId));
        }
    };

    const handleToggleStar = (docId: string) => {
        setDocuments(documents.map(doc =>
            doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
        ));
    };

    const formatFileSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    };

    const getBreadcrumb = () => {
        const breadcrumb = [];
        let current = currentFolder;
        while (current) {
            breadcrumb.unshift(current);
            current = folders.find(f => f.id === current?.parentId);
        }
        return breadcrumb;
    };

    const DocumentDetailsModal = ({ document }: { document: Document }) => {
        const FileIcon = fileTypeConfig[document.type]?.icon || File;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                    <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start space-x-4">
                            <div className={`rounded-xl p-4 ${fileTypeConfig[document.type]?.bgColor}`}>
                                <FileIcon className={`h-12 w-12 ${fileTypeConfig[document.type]?.color}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">{document.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{document.description || 'No description'}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Size</p>
                                <p className="text-sm font-medium text-gray-900">{formatFileSize(document.size)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Type</p>
                                <p className="text-sm font-medium text-gray-900 uppercase">{document.type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Uploaded</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {format(document.uploadDate, 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Last Modified</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {format(document.lastModified, 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Version</p>
                                <p className="text-sm font-medium text-gray-900">v{document.version}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${document.status === 'final' ? 'bg-green-100 text-green-800' :
                                        document.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {document.status}
                                </span>
                            </div>
                        </div>

                        {document.tags.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500">Tags</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {document.tags.map((tag, idx) => (
                                        <span key={idx} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {document.sharedWith && document.sharedWith.length > 0 && (
                            <div className="mt-4 rounded-lg bg-blue-50 p-4">
                                <p className="text-sm font-medium text-blue-900">Shared with:</p>
                                <div className="mt-2 space-y-1">
                                    {document.sharedWith.map((person, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-blue-800">
                                            <User className="mr-2 h-3 w-3" />
                                            {person.name} ({person.role}) - {person.email}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                <Download className="mr-2 inline h-4 w-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const UploadModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
                        <button onClick={() => setShowUploadModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div
                        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-500"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.ppt,.pptx"
                        />
                    </div>

                    {uploadFile && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-3">
                            <p className="text-sm text-blue-800">{uploadFile.name}</p>
                            <p className="text-xs text-blue-600">{formatFileSize(uploadFile.size)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const NewFolderModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Create New Folder</h2>
                        <button onClick={() => setShowNewFolderModal(false)} className="rounded-lg p-1 hover:bg-gray-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700">Folder Name</label>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter folder name"
                        autoFocus
                    />

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowNewFolderModal(false)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateFolder}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Create Folder
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
                            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage your internship documents and files
                            </p>
                        </div>
                        <div className="mt-4 flex space-x-3 sm:mt-0">
                            <button
                                onClick={() => setShowNewFolderModal(true)}
                                className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            >
                                <FolderPlus className="mr-2 h-4 w-4" />
                                New Folder
                            </button>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                            </button>
                        </div>
                    </div>
                </div>

                {/* Storage Info */}
                <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <HardDrive className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Storage Usage</p>
                                <p className="text-xs text-gray-500">12.5 MB of 1 GB used</p>
                            </div>
                        </div>
                        <div className="w-48">
                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                <div className="h-full w-[12%] rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex items-center space-x-2 text-sm">
                    <button
                        onClick={() => setCurrentFolderId('root')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        My Documents
                    </button>
                    {getBreadcrumb().slice(1).map((folder, index) => (
                        <div key={folder.id} className="flex items-center space-x-2">
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button
                                onClick={() => setCurrentFolderId(folder.id)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {folder.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
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
                        <option value="pdf">PDF</option>
                        <option value="doc">Word</option>
                        <option value="jpg">Image</option>
                    </select>

                    <div className="flex rounded-lg border border-gray-300">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                        <option value="size">Sort by Size</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                    >
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </button>
                </div>

                {/* Folders Grid */}
                {subFolders.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Folders</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {subFolders.map((folder) => (
                                <div
                                    key={folder.id}
                                    className="group cursor-pointer rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                    onClick={() => setCurrentFolderId(folder.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`rounded-lg p-2 ${folderColors[folder.color as keyof typeof folderColors]}`}>
                                                <Folder className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{folder.name}</h3>
                                                <p className="text-xs text-gray-500">{folder.documentCount} items</p>
                                            </div>
                                        </div>
                                        {folder.isStarred && (
                                            <Star className="h-4 w-4 text-yellow-400" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Updated {formatDistanceToNow(folder.updatedAt)} ago
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Documents View */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {currentFolder?.name === 'My Documents' ? 'All Documents' : 'Documents'}
                        </h2>
                        <p className="text-sm text-gray-500">{filteredDocuments.length} items</p>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredDocuments.map((doc) => {
                                const FileIcon = fileTypeConfig[doc.type]?.icon || File;
                                return (
                                    <div
                                        key={doc.id}
                                        className="group relative rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`rounded-lg p-2 ${fileTypeConfig[doc.type]?.bgColor}`}>
                                                    <FileIcon className={`h-5 w-5 ${fileTypeConfig[doc.type]?.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {doc.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(doc.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleStar(doc.id)}
                                                className="text-gray-400 hover:text-yellow-400"
                                            >
                                                {doc.isStarred ? (
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                ) : (
                                                    <Star className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(doc.uploadDate)} ago
                                            </span>
                                            <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDocument(doc);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="rounded p-1 hover:bg-gray-100"
                                                >
                                                    <Eye className="h-3 w-3 text-gray-500" />
                                                </button>
                                                <button className="rounded p-1 hover:bg-gray-100">
                                                    <Download className="h-3 w-3 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="rounded p-1 hover:bg-gray-100"
                                                >
                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modified</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredDocuments.map((doc) => {
                                        const FileIcon = fileTypeConfig[doc.type]?.icon || File;
                                        return (
                                            <tr key={doc.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center">
                                                        <FileIcon className={`mr-3 h-5 w-5 ${fileTypeConfig[doc.type]?.color}`} />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                                            {doc.description && (
                                                                <div className="text-xs text-gray-500">{doc.description}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 uppercase">
                                                    {doc.type}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {formatFileSize(doc.size)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {format(doc.uploadDate, 'MMM dd, yyyy')}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleToggleStar(doc.id)}
                                                            className="text-gray-400 hover:text-yellow-400"
                                                        >
                                                            {doc.isStarred ? (
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            ) : (
                                                                <Star className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDocument(doc);
                                                                setShowDetailsModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredDocuments.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12">
                            <File className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
                            <p className="mt-1 text-sm text-gray-500">Upload your first document to get started</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                <Upload className="mr-2 inline h-4 w-4" />
                                Upload Document
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showUploadModal && <UploadModal />}
            {showNewFolderModal && <NewFolderModal />}
            {showDetailsModal && selectedDocument && (
                <DocumentDetailsModal document={selectedDocument} />
            )}
        </div>
    );
}