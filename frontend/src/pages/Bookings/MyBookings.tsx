import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { type Booking } from '../../types/turf'

const MyBookings = () => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.BOOKINGS.MY_BOOKINGS)
            setBookings(response.data)
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (bookingId: number) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        try {
            await axiosInstance.patch(API_PATHS.BOOKINGS.CANCEL(bookingId))
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error cancelling booking')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
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

    const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        Turf Play
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">{user?.fullname}</span>
                        <button
                            onClick={() => navigate('/turfs')}
                            className="text-green-600 hover:text-green-800"
                        >
                            Browse Turfs
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                    <div className="flex gap-2">
                        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                                    filter === s
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {s} {s !== 'all' && `(${bookings.filter(b => b.status === s).length})`}
                                {s === 'all' && `(${bookings.length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg mt-4">No bookings found</p>
                        <button
                            onClick={() => navigate('/turfs')}
                            className="mt-4 text-green-600 hover:text-green-800 font-medium"
                        >
                            Browse Turfs to Book
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {booking.turf?.images && booking.turf.images.length > 0 ? (
                                                <img src={booking.turf.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3
                                                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-green-600"
                                                onClick={() => navigate(`/turfs/${booking.turfId}`)}
                                            >
                                                {booking.turf?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {booking.turf?.location}, {booking.turf?.city}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(booking.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {booking.startTime} - {booking.endTime}
                                                </span>
                                            </div>
                                            {booking.notes && (
                                                <p className="text-sm text-gray-500 mt-1">Note: {booking.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-lg font-bold text-green-600">₹{booking.totalPrice}</span>
                                        <span className="text-xs text-gray-400">
                                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                        </span>
                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default MyBookings
