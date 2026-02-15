import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { type Booking, type BookingStats } from '../../types/turf'

const BookingManagement = () => {
    const { user, clearUser, isAdmin } = useContext(UserContext)
    const navigate = useNavigate()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [stats, setStats] = useState<BookingStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'bookings'>('overview')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }
        if (user && !isAdmin()) {
            navigate("/dashboard")
            return
        }
        fetchData()
    }, [user, navigate])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [bookingsRes, statsRes] = await Promise.all([
                axiosInstance.get(API_PATHS.BOOKINGS.ADMIN_ALL),
                axiosInstance.get(API_PATHS.BOOKINGS.ADMIN_STATS),
            ])
            setBookings(bookingsRes.data)
            setStats(statsRes.data)
        } catch (err) {
            console.error('Error fetching booking data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
        try {
            setUpdatingId(bookingId)
            await axiosInstance.patch(API_PATHS.BOOKINGS.ADMIN_UPDATE_STATUS(bookingId), { status: newStatus })
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b))
            // Refresh stats
            const statsRes = await axiosInstance.get(API_PATHS.BOOKINGS.ADMIN_STATS)
            setStats(statsRes.data)
        } catch (err) {
            console.error('Error updating booking status:', err)
            alert('Failed to update booking status')
        } finally {
            setUpdatingId(null)
        }
    }

    const handleLogout = () => {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
            axiosInstance.post(API_PATHS.AUTH.LOGOUT, { refreshToken }).catch(() => {})
        }
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        clearUser()
        navigate("/login")
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'confirmed': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">{user?.fullname}</span>
                        <button
                            onClick={() => navigate("/admin")}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Admin Panel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'overview'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'bookings'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            All Bookings
                        </button>
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <div className="bg-white rounded-lg shadow p-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <p className="text-sm font-medium text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <p className="text-sm font-medium text-green-600">Confirmed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.confirmedCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <p className="text-sm font-medium text-blue-600">Completed</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.completedCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <p className="text-sm font-medium text-red-600">Cancelled</p>
                                <p className="text-2xl font-bold text-red-600">{stats.cancelledCount}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <p className="text-sm font-medium text-gray-500">Revenue</p>
                                <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue}</p>
                            </div>
                        </div>

                        {/* Pending Bookings - Quick Action */}
                        {stats.pendingCount > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                    ⏳ {stats.pendingCount} booking{stats.pendingCount > 1 ? 's' : ''} awaiting approval
                                </h3>
                                <button
                                    onClick={() => { setActiveTab('bookings'); setStatusFilter('pending'); }}
                                    className="text-yellow-700 hover:text-yellow-900 font-medium text-sm underline"
                                >
                                    Review pending bookings →
                                </button>
                            </div>
                        )}

                        {/* Recent Bookings */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {stats.recentBookings.map((booking) => (
                                    <li key={booking.id} className="px-6 py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {booking.user?.fullname} → {booking.turf?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {booking.date} | {booking.startTime} - {booking.endTime}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 text-xs rounded capitalize ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            <span className="font-bold text-green-600">₹{booking.totalPrice}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Bookings Table Tab */}
                {activeTab === 'bookings' && (
                    <div>
                        {/* Filters */}
                        <div className="flex gap-2 mb-6">
                            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                                        statusFilter === s
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white text-gray-700 border hover:bg-gray-50'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Bookings Table */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turf</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No bookings found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    #{booking.id}
                                                    {booking.notes && (
                                                        <p className="text-xs text-gray-400 mt-1" title={booking.notes}>
                                                            📝 {booking.notes.substring(0, 30)}{booking.notes.length > 30 ? '...' : ''}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{booking.user?.fullname}</div>
                                                    <div className="text-sm text-gray-500">{booking.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{booking.turf?.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.turf?.city}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <div>{new Date(booking.date + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                    <div className="text-gray-500">{booking.startTime} - {booking.endTime}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                    ₹{booking.totalPrice}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    {updatingId === booking.id ? (
                                                        <span className="text-gray-400">Updating...</span>
                                                    ) : (
                                                        <div className="flex justify-end gap-2">
                                                            {booking.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                            {booking.status === 'confirmed' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                            {(booking.status === 'cancelled' || booking.status === 'completed') && (
                                                                <span className="text-gray-400 text-xs">No actions</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default BookingManagement
