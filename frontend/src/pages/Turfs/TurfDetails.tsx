import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { type Turf, type TimeSlot } from '../../types/turf'

const TurfDetails = () => {
    const { id } = useParams<{ id: string }>()
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [turf, setTurf] = useState<Turf | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [showBooking, setShowBooking] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])
    const [slotsLoading, setSlotsLoading] = useState(false)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [bookingNotes, setBookingNotes] = useState('')

    useEffect(() => {
        if (id) {
            fetchTurf()
        }
    }, [id])

    const fetchTurf = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.TURFS.GET_BY_ID(Number(id)))
            setTurf(response.data)
        } catch (error) {
            console.error('Error fetching turf:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        clearUser()
        navigate("/login")
    }

    // Get today's date in YYYY-MM-DD format for min date
    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    const fetchSlots = async (date: string) => {
        if (!id || !date) return
        try {
            setSlotsLoading(true)
            setSelectedSlots([])
            const response = await axiosInstance.get(`${API_PATHS.BOOKINGS.GET_SLOTS}?turfId=${id}&date=${date}`)
            setSlots(response.data.slots)
        } catch (error) {
            console.error('Error fetching slots:', error)
        } finally {
            setSlotsLoading(false)
        }
    }

    const handleDateChange = (date: string) => {
        setSelectedDate(date)
        setBookingSuccess(false)
        if (date) {
            fetchSlots(date)
        } else {
            setSlots([])
            setSelectedSlots([])
        }
    }

    const toggleSlotSelection = (slot: TimeSlot) => {
        if (!slot.isAvailable) return
        const exists = selectedSlots.find(s => s.startTime === slot.startTime)
        if (exists) {
            setSelectedSlots(selectedSlots.filter(s => s.startTime !== slot.startTime))
        } else {
            setSelectedSlots([...selectedSlots, slot])
        }
    }

    const getTotalPrice = () => {
        if (!turf) return 0
        return selectedSlots.length * turf.pricePerHour
    }

    const handleBooking = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        if (selectedSlots.length === 0) return

        try {
            setBookingLoading(true)
            // Create a booking for each selected slot
            for (const slot of selectedSlots) {
                await axiosInstance.post(API_PATHS.BOOKINGS.CREATE, {
                    turfId: Number(id),
                    date: selectedDate,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    notes: bookingNotes || undefined,
                })
            }
            setBookingSuccess(true)
            setSelectedSlots([])
            setBookingNotes('')
            // Refresh slots to show updated availability
            fetchSlots(selectedDate)
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error creating booking')
        } finally {
            setBookingLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!turf) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Turf not found</h2>
                    <button
                        onClick={() => navigate('/turfs')}
                        className="mt-4 text-green-600 hover:text-green-800"
                    >
                        Back to Turfs
                    </button>
                </div>
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
                        {user ? (
                            <>
                                <span className="text-gray-600">{user.fullname}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate('/turfs')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Turfs
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Images */}
                        <div className="p-6">
                            <div className="h-80 bg-gray-200 rounded-lg overflow-hidden mb-4">
                                {turf.images && turf.images.length > 0 ? (
                                    <img
                                        src={turf.images[selectedImage]}
                                        alt={turf.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {turf.images && turf.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {turf.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-green-500' : 'border-transparent'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-900">{turf.name}</h1>
                            
                            <div className="flex items-center text-gray-600 mt-2">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {turf.address ? `${turf.address}, ` : ''}{turf.location}, {turf.city}
                                {turf.state && `, ${turf.state}`}
                                {turf.pincode && ` - ${turf.pincode}`}
                            </div>

                            <div className="mt-6">
                                <span className="text-3xl font-bold text-green-600">₹{turf.pricePerHour}</span>
                                <span className="text-gray-500"> /hour</span>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Timing</h3>
                                <p className="text-gray-600">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {turf.openTime} - {turf.closeTime}
                                </p>
                            </div>

                            {turf.description && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                    <p className="text-gray-600">{turf.description}</p>
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sports Available</h3>
                                <div className="flex flex-wrap gap-2">
                                    {turf.sportTypes.map((sport, idx) => (
                                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {turf.amenities && turf.amenities.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {turf.amenities.map((amenity, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login')
                                        return
                                    }
                                    setShowBooking(!showBooking)
                                    setBookingSuccess(false)
                                }}
                                className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                {user ? (showBooking ? 'Hide Booking' : 'Book Now') : 'Login to Book'}
                            </button>
                        </div>
                    </div>

                    {/* Booking Section */}
                    {showBooking && user && (
                        <div className="p-6 border-t">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Slot</h2>

                            {bookingSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                                    <p className="font-semibold">Booking request submitted!</p>
                                    <p className="text-sm mt-1">Your booking is pending admin approval. You can track it in <button onClick={() => navigate('/my-bookings')} className="underline font-medium">My Bookings</button>.</p>
                                </div>
                            )}

                            {/* Date Picker */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    min={getTodayDate()}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="border rounded-lg px-4 py-2 w-full max-w-xs"
                                />
                            </div>

                            {/* Time Slots */}
                            {selectedDate && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Time Slots</label>
                                    {slotsLoading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                            {slots.map((slot) => {
                                                const isSelected = selectedSlots.some(s => s.startTime === slot.startTime)
                                                return (
                                                    <button
                                                        key={slot.startTime}
                                                        onClick={() => toggleSlotSelection(slot)}
                                                        disabled={!slot.isAvailable}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                                            !slot.isAvailable
                                                                ? 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed'
                                                                : isSelected
                                                                    ? 'bg-green-500 text-white border-green-500'
                                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                                                        }`}
                                                    >
                                                        {slot.startTime}
                                                        <span className="block text-xs opacity-75">
                                                            {!slot.isAvailable ? (slot.status === 'pending' ? 'Pending' : 'Booked') : 'Available'}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notes */}
                            {selectedSlots.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                                    <textarea
                                        value={bookingNotes}
                                        onChange={(e) => setBookingNotes(e.target.value)}
                                        placeholder="Any special requests..."
                                        className="border rounded-lg px-4 py-2 w-full max-w-md"
                                        rows={2}
                                    />
                                </div>
                            )}

                            {/* Booking Summary & Confirm */}
                            {selectedSlots.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Date:</span> {new Date(selectedDate + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p><span className="font-medium">Slots:</span> {selectedSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(s => `${s.startTime}-${s.endTime}`).join(', ')}</p>
                                        <p><span className="font-medium">Duration:</span> {selectedSlots.length} hour{selectedSlots.length > 1 ? 's' : ''}</p>
                                        <p className="text-lg font-bold text-green-600 mt-2">Total: ₹{getTotalPrice()}</p>
                                    </div>
                                    <button
                                        onClick={handleBooking}
                                        disabled={bookingLoading}
                                        className="mt-4 w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        {bookingLoading ? 'Booking...' : `Confirm Booking - ₹${getTotalPrice()}`}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2 text-center">Your booking will be confirmed after admin approval</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default TurfDetails
