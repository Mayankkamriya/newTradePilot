'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Bid {
  id: string;
  amount: number;
  estimatedTime: string;
  message: string;
  createdAt: string;
  sellerName: string;
  sellerId: string;
  bidStatus: string;
  projectId: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  buyerId: string;
  sellerId: string | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'SELLER' | 'BUYER';
  createdAt: string;
  projectsCreated: Project[];
  projectsTaken: Project[];
  bids: Bid[];
}

interface ApiResponse {
  status: string;
  data: UserData;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingBids, setCompletingBids] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, File>>(new Map());
  const [showUploadPanel, setShowUploadPanel] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          toast.error('Failed to fetch user data');
        }

        const result: ApiResponse = await response.json();
        
        if (result.status === 'success') {
          setUser(result.data);
          console.log(result.data.bids)
        } else {
          toast.error('API returned error status');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 text-red-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-500 mt-4">{error}</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = user ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  // Calculate statistics
  const totalBidAmount = user ? user.bids.reduce((sum, bid) => sum + bid.amount, 0) : 0;
  const activeBids = user ? user.bids.length : 0;
  const projectsCreatedCount = user ? user.projectsCreated.length : 0;
  const projectsTakenCount = user ? user.projectsTaken.length : 0;
  
  const activeProjects = user ? user.projectsCreated.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PENDING').length : 0;
  const completedProjects = user ? user.projectsCreated.filter(p => p.status === 'COMPLETED').length : 0;


  const initiateCompletion = (bidId: string) => {
    setShowUploadPanel(prev => new Set(prev).add(bidId));
  };

  const cancelCompletion = (bidId: string) => {
    setShowUploadPanel(prev => {
      const newSet = new Set(prev);
      newSet.delete(bidId);
      return newSet;
    });
    setUploadedFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(bidId);
      return newMap;
    });
  };

  const handleFileUpload = (bidId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => new Map(prev).set(bidId, file));
      toast.success(`File "${file.name}" selected successfully!`);
    }
  };

  const submitCompletion = async (bidId: string, projectId: string) => {
    const uploadedFile = uploadedFiles.get(bidId);
    
    if (!uploadedFile) {
      toast.error('Please upload a document before submitting');
      return;
    }

    setCompletingBids(prev => new Set(prev).add(bidId));

    try {
      const formData = new FormData();
      formData.append('status', 'COMPLETED');
      formData.append('bidId', bidId);
      formData.append('document', uploadedFile);

      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Project marked as completed successfully!');
        
        // Update the local state
        setUser(prevUser => {
          if (!prevUser) return null;
          
          return {
            ...prevUser,
            bids: prevUser.bids.map(bid => 
              bid.id === bidId ? { ...bid, bidStatus: 'COMPLETED' } : bid
            ),
            projectsCreated: prevUser.projectsCreated.map(project =>
              project.id === projectId ? { ...project, status: 'COMPLETED' } : project
            ),
            projectsTaken: prevUser.projectsTaken.map(project =>
              project.id === projectId ? { ...project, status: 'COMPLETED' } : project
            )
          };
        });

        // Clear states
        setUploadedFiles(prev => {
          const newMap = new Map(prev);
          newMap.delete(bidId);
          return newMap;
        });
        setShowUploadPanel(prev => {
          const newSet = new Set(prev);
          newSet.delete(bidId);
          return newSet;
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to mark project as completed');
      }
    } catch (error) {
      console.error('Error marking bid as completed:', error);
      toast.error('Failed to mark project as completed');
    } finally {
      setCompletingBids(prev => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });
    }
  };



  if (!user) {
    return <div>Loading...</div>;
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            {/* <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Edit Profile
            </button> */}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-8 py-10">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-8">
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-lg text-gray-600 mt-1">{user.email}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'SELLER' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-gray-500">
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.role === 'SELLER' ? (
            <>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Bids Placed</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeBids}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Bid Amount</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">${totalBidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-purple-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Average Bid</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{activeBids > 0 ? Math.round(totalBidAmount / activeBids).toLocaleString() : '0'}
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-orange-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Projects Taken</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{projectsTakenCount}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Projects Created</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{projectsCreatedCount}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-yellow-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Projects</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeProjects}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed Projects</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completedProjects}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Bids Received</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{user.bids.length}</p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}