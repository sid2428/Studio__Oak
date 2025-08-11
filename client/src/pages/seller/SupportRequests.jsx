import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

// --- Icons for a cleaner UI ---
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const SupportRequests = () => {
    const { axios } = useAppContext();
    const [requests, setRequests] = useState([]);

    const fetchSupportRequests = async () => {
        try {
            const { data } = await axios.get('/api/support/requests');
            if (data.success) {
                setRequests(data.requests);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch support requests.");
        }
    };

    useEffect(() => {
        fetchSupportRequests();
    }, []);

    const handleUpdateRequest = async (requestId, newStatus) => {
        try {
            const { data } = await axios.post('/api/support/request/update', { requestId, status: newStatus });
            if (data.success) {
                toast.success(data.message);
                // Update the status locally for immediate feedback
                setRequests(prevRequests => 
                    prevRequests.map(req => 
                        req._id === requestId ? { ...req, status: newStatus } : req
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update request status.");
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Customer Support Requests
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.length > 0 ? requests.map((request) => (
                                <tr key={request._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.userId.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.userId.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(request.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {request.status === 'Pending' && (
                                            <button 
                                                onClick={() => handleUpdateRequest(request._id, 'Resolved')}
                                                className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                                                title="Mark as Resolved"
                                            >
                                                <CheckCircleIcon />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">No support requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupportRequests;
