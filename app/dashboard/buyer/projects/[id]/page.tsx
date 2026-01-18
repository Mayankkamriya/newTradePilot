'use client';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import StatusBadge from '../../../../../components/StatusBadge';
import SelectBidButton from '../../../../../components/SelectBidButton';
import { useEffect, useState } from 'react';
import { getProjects } from '../../../../api/projectApi';
import { toast } from 'react-toastify';

interface Project {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
  selectedBid: string | null;
  bids: Bid[];
}

interface Bid {
  id: string;
  amount: number;
  sellerName: string;
  estimatedTime: string;
  message: string;
  createdAt: string;
}

export default function BuyerProjectDetail() {
 const { id } = useParams<{ id: string }>();
const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const allProjects = await getProjects();
        const foundProject = allProjects.find((p: Project) => p.id === id);
        if (!foundProject) toast.error("Project not found");
        setProject(foundProject);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

    const handleSelectBid = async (bidId: string) => {
  console.log(`Selected bid ${bidId} for project ${id}`);
  
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('No authentication token found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'IN_PROGRESS',
        bidId: bidId
      })
    });

    if (!response.ok) {
      toast.error(`HTTP error! status: ${response.status}`);
      return
    }

    const data = await response.json();
    console.log('Success:', data);

    // Update local state only after successful API call
    if (project) {
      setProject({
        ...project,
        selectedBid: bidId,
        status: 'IN_PROGRESS'
      });
    }

  } catch (error) {
    toast.error('Error updating project status');
    console.log(error)
  }
};


  // Show loader while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Show error or not found message
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you&#39;re looking for doesn&#39;t exist or may have been removed.</p>
          <button
            onClick={() => router.push('/dashboard/buyer')}
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Project Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <div className="mt-1 flex items-center">
                  <StatusBadge status={project.status} />
                  <span className="ml-2 text-sm text-gray-500">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="text-lg font-semibold text-indigo-600">
                  ₹{project.budgetMin.toLocaleString()} - ₹{project.budgetMax.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="px-6 py-5">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
          </div>

          {/* Bids Section */}
          <div className="border-t border-gray-200 px-6 py-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Bids ({project.bids.length})
            </h2>

            {project.bids.length === 0 ? (
              <p className="text-gray-500">No bids yet.</p>
            ) : (
              <div className="space-y-4">
                {project.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={`border rounded-lg p-4 ${
                      project.selectedBid === bid.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{bid.sellerName}</h3>
                        <p className="text-sm text-gray-500">
                          Bid placed on {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-indigo-600">
                          ₹{bid.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Est. time: {bid.estimatedTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Message</h4>
                      <p className="text-gray-700">{bid.message}</p>
                    </div>
                    {project.status === 'PENDING' && !project.selectedBid && (
                      <div className="mt-4 flex justify-end">
                        <SelectBidButton
                          bidId={bid.id}
                          onSelect={handleSelectBid}
                        />
                      </div>
                    )}
                    {project.selectedBid === bid.id && (
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Actions */}
          {project.status === 'IN_PROGRESS' && (
            <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Management</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Current Status: In Progress</h3>
                  <p className="text-gray-700 mb-4">
                    The seller is working on your project. You&#39;ll be notified when they submit deliverables.
                  </p>
                  {/* <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Message Seller
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}