'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusColors = {
    'Open':        'bg-green-100 text-green-600 border border-green-200',
    'In Progress': 'bg-yellow-100 text-yellow-600 border border-yellow-200',
    'Closed':      'bg-gray-100 text-gray-500 border border-gray-200',
  };

  const categoryColors = {
    'Plumbing':   'bg-blue-100 text-blue-600',
    'Electrical': 'bg-orange-100 text-orange-600',
    'Painting':   'bg-purple-100 text-purple-600',
    'Joinery':    'bg-green-100 text-green-600',
    'Other':      'bg-gray-100 text-gray-600',
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  async function fetchJob() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`);
      if (!res.ok) {
        router.push('/');
        return;
      }
      const data = await res.json();
      setJob(data);
      setStatus(data.status);
    } catch (err) {
      console.error('Failed to fetch job:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus() {
    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setJob(updated);
        setStatus(updated.status);
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/');
      }
    } catch (err) {
      alert('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!job) return null;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">Service Board</span>
          <Link
            href="/new"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Post New Job
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
          ← Back to Jobs
        </Link>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Top Section — Title, badges, location, date */}
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h1>

            {/* Status + Category badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[job.status]}`}>
                {job.status}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[job.category] || 'bg-gray-100 text-gray-600'}`}>
                {job.category}
              </span>
            </div>

            {/* Location + Date */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                📍 {job.location || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                📅 {new Date(job.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })} at {new Date(job.createdAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Contact Information */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>👤</span>
                <span>{job.contactName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>✉️</span>
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {job.contactEmail || 'N/A'}
                </a>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Update Status</h2>
            <div className="flex gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || status === job.status}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Delete */}
          <div className="p-8">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-50 text-red-500 border border-red-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🗑️ {deleting ? 'Deleting...' : 'Delete Job'}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}