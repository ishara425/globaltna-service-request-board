'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All Categories', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

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
    fetchJobs();
  }, [category]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const query = category && category !== 'All Categories' ? `?category=${category}` : '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs${query}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q)
    );
  });

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

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-500 mt-1">Browse and manage service requests from homeowners</p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">▼</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value === 'All Categories' ? '' : e.target.value)}
              className="pl-8 pr-6 py-2.5 border-2 border-blue-500 rounded-lg text-sm font-medium text-gray-700 focus:outline-none bg-white appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </p>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>No jobs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Top row - title + status */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-base font-bold text-gray-800 leading-snug">{job.title}</h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{job.description}</p>
                </div>

                {/* Location + Date */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span>📍 {job.location || 'N/A'}</span>
                  <span>📅 {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Bottom row - category + link */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[job.category] || 'bg-gray-100 text-gray-600'}`}>
                    {job.category}
                  </span>
                  <Link
                    href={`/jobs/${job._id}`}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}