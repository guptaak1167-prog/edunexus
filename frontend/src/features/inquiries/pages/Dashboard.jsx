import { useEffect, useState } from 'react';
import { getInquiries, updateInquiryStatus, logoutAdmin } from '../../auth/service/auth.service.js';

function Dashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch inquiries and apply filters
  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError('');

      try {
        const params = {};

        if (search.trim()) params.search = search.trim();
        if (category) params.category = category;
        if (userType) params.user_type = userType;

        const data = await getInquiries(params);
        setInquiries(data.inquiries);
      } catch (err) {
        console.error('Fetch inquiries error:', err);
        setError(err.response?.data?.message || 'Failed to load inquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [search, category, userType]);

  // Update inquiry status
  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);

      setInquiries((previous) =>
        previous.map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry))
      );
    } catch (err) {
      console.error('Status update error:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  // Log out admin
  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logoutAdmin();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      alert('Unable to log out. Please try again.');
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex items-center justify-between bg-white px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inquiry Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track submitted inquiries</p>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Inquiries displayed</p>
            <p className="mt-2 text-3xl font-bold">{inquiries.length}</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">New inquiries displayed</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {inquiries.filter((item) => item.status === 'New').length}
            </p>
          </div>
        </div>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">All Inquiries</h2>

          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <input
              type="search"
              placeholder="Search name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Concert">Concert</option>
              <option value="Admission">Admission</option>
              <option value="General Query">General Query</option>
            </select>

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">All User Types</option>
              <option value="Parent">Parent</option>
              <option value="Student">Student</option>
              <option value="School">School</option>
            </select>
          </div>

          {loading && <p className="py-8 text-center text-slate-500">Loading inquiries...</p>}

          {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">User Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium">{inquiry.name}</td>

                      <td className="px-4 py-4">
                        <div>{inquiry.email}</div>
                        <div className="mt-1 text-slate-500">{inquiry.phone}</div>
                      </td>

                      <td className="px-4 py-4">{inquiry.user_type}</td>

                      <td className="px-4 py-4">{inquiry.category}</td>

                      <td className="px-4 py-4">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {inquiries.length === 0 && (
                <p className="py-8 text-center text-slate-500">No inquiries found.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
