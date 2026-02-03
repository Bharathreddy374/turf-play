import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import {type Turf } from '../../types/turf'

const TurfList = () => {
    const { user, clearUser, isAdmin } = useContext(UserContext)
    const navigate = useNavigate()
    const [turfs, setTurfs] = useState<Turf[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        city: '',
        sportType: '',
        minPrice: '',
        maxPrice: ''
    })

    useEffect(() => {
        fetchTurfs()
    }, [])

    const fetchTurfs = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filters.city) params.append('city', filters.city)
            if (filters.sportType) params.append('sportType', filters.sportType)
            if (filters.minPrice) params.append('minPrice', filters.minPrice)
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
            params.append('isActive', 'true')

            const response = await axiosInstance.get(`${API_PATHS.TURFS.GET_ALL}?${params.toString()}`)
            setTurfs(response.data)
        } catch (error) {
            console.error('Error fetching turfs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchTurfs()
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        clearUser()
        navigate("/login")
    }

    const sportTypeOptions = ['football', 'cricket', 'basketball', 'tennis', 'badminton', 'hockey']

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
                                {isAdmin() && (
                                    <button
                                        onClick={() => navigate("/admin")}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        Admin
                                    </button>
                                )}
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
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Find Your Perfect Turf</h2>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input
                            type="text"
                            placeholder="City"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="border rounded-lg px-4 py-2"
                        />
                        <select
                            value={filters.sportType}
                            onChange={(e) => setFilters({ ...filters, sportType: e.target.value })}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Sports</option>
                            {sportTypeOptions.map(sport => (
                                <option key={sport} value={sport}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            className="border rounded-lg px-4 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            className="border rounded-lg px-4 py-2"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Turf Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    </div>
                ) : turfs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No turfs found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {turfs.map((turf) => (
                            <div
                                key={turf.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/turfs/${turf.id}`)}
                            >
                                <div className="h-48 bg-gray-200">
                                    {turf.images && turf.images.length > 0 ? (
                                        <img
                                            src={turf.images[0]}
                                            alt={turf.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{turf.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        <span className="inline-flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {turf.location}, {turf.city}
                                        </span>
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {turf.sportTypes.slice(0, 3).map((sport, idx) => (
                                            <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                {sport}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-green-600 font-bold text-lg">₹{turf.pricePerHour}/hr</span>
                                        <span className="text-gray-500 text-sm">{turf.openTime} - {turf.closeTime}</span>
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

export default TurfList
