'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactName: '',
    contactEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

  function validate() {
    const newErrors = {};
    if (!form.title.trim())        newErrors.title = 'Job title is required';
    if (!form.description.trim())  newErrors.description = 'Description is required';
    if (!form.category)            newErrors.category = 'Please select a category';
    if (!form.location.trim())     newErrors.location = 'Location is required';
    if (!form.contactName.trim())  newErrors.contactName = 'Contact name is required';
    if (!form.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`https://globaltna-service-request-board-production.up.railway.app/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to submit. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  }

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

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Post New Service Request</h1>
          <p className="text-sm text-gray-500 mb-8">Fill out the form below to post a new service request</p>

          {/* Job Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Kitchen Tap Leaking - Urgent"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the service you need..."
              rows={5}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category + Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Glasgow"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Contact Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactEmail ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>

        </div>
      </div>
    </main>
  );
}