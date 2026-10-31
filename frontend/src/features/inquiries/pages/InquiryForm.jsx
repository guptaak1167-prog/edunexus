import { useState } from 'react';
import api from '../../../services/api';

function InquiryForm() {
  const [formData, setFormData] = useState({
    user_type: 'Parent',
    category: 'Scholarship',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await api.post('/api/inquiries', formData);

      setSuccess('Your inquiry has been submitted successfully!');

      setFormData({
        user_type: 'Parent',
        category: 'Scholarship',
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
            E
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Send an Inquiry</h1>
          <p className="mt-2 text-slate-500">
            Have a question? Fill out the form and our team will contact you.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {success && (
            <p className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>
          )}

          {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">I am a</label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select user type</option>
                <option value="Parent">Parent</option>
                <option value="Student">Student</option>
                <option value="School">School</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Inquiry Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select category</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Concert">Concert</option>
                <option value="Admission">Admission</option>
                <option value="General Query">General Query</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows={5}
                required
                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">EdTech CRM · Inquiry Portal</p>
        </div>
      </div>
    </div>
  );
}

export default InquiryForm;
