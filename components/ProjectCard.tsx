import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface Bid {
  id: string;
  amount: number;
  estimatedTime: string;
  message: string;
  createdAt: string;
  sellerName: string;
  sellerId: string;
  projectId: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  budgetMin: number;
  budgetMax: number;
  status: string;
  bidsCount: number;
  bids: Bid[];
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Initial check for role
    const checkRole = () => {
      if (typeof window !== 'undefined') {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
      }
    };

    checkRole();

    // Listen for storage events (both native and custom)
    const handleStorageChange = () => {
      checkRole();
    };

    // Listen for the custom events you dispatch in login
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storageUpdate', handleStorageChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storageUpdate', handleStorageChange);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Budget Range</p>
            <p className="font-bold text-indigo-600 text-base">
              ₹{project.budgetMin.toLocaleString()} - ₹{project.budgetMax.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Deadline</p>
            <p className="font-semibold text-gray-900 text-sm">
              {new Date(project.deadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              {project.bids.length} {project.bids.length === 1 ? 'bid' : 'bids'}
            </span>
          </div>
          {role === 'SELLER' && (
            <Link
              href={`/dashboard/seller/projects/${project.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group/link"
            >
              View Details
              <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}