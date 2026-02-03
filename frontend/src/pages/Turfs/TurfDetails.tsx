import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import {type Turf } from '../../types/turf'

const TurfDetails = () => {
    const { id } = useParams<{ id: string }>()
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [turf, setTurf] = useState<Turf | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)

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
                                onClick={() => user ? alert('Booking feature coming soon!') : navigate('/login')}
                                className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                {user ? 'Book Now' : 'Login to Book'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TurfDetails
