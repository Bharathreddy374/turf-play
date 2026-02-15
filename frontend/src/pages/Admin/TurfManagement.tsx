import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { type Turf,type TurfFormData } from '../../types/turf'

const initialFormData: TurfFormData = {
    name: '',
    description: '',
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    images: [],
    pricePerHour: '',
    sportTypes: [],
    amenities: [],
    openTime: '06:00',
    closeTime: '22:00',
    isActive: true
}

const sportTypeOptions = ['football', 'cricket', 'basketball', 'tennis', 'badminton', 'hockey', 'volleyball']
const amenityOptions = ['parking', 'changing room', 'floodlights', 'drinking water', 'washroom', 'first aid', 'cafeteria', 'wifi']

const TurfManagement = () => {
    const { user, clearUser, isAdmin } = useContext(UserContext)
    const navigate = useNavigate()
    const [turfs, setTurfs] = useState<Turf[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTurf, setEditingTurf] = useState<Turf | null>(null)
    const [formData, setFormData] = useState<TurfFormData>(initialFormData)
    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState('')
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })

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

        fetchTurfs()
    }, [user, navigate])

    const fetchTurfs = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.TURFS.ADMIN_ALL)
            setTurfs(response.data.turfs)
            setStats(response.data.stats)
        } catch (error) {
            console.error('Error fetching turfs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (turf?: Turf) => {
        if (turf) {
            setEditingTurf(turf)
            setFormData({
                name: turf.name,
                description: turf.description || '',
                location: turf.location,
                address: turf.address || '',
                city: turf.city,
                state: turf.state || '',
                pincode: turf.pincode || '',
                latitude: turf.latitude?.toString() || '',
                longitude: turf.longitude?.toString() || '',
                images: turf.images || [],
                pricePerHour: turf.pricePerHour.toString(),
                sportTypes: turf.sportTypes || [],
                amenities: turf.amenities || [],
                openTime: turf.openTime,
                closeTime: turf.closeTime,
                isActive: turf.isActive
            })
        } else {
            setEditingTurf(null)
            setFormData(initialFormData)
        }
        setError('')
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingTurf(null)
        setFormData(initialFormData)
        setImageUrl('')
        setError('')
    }

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setFormData({ ...formData, images: [...formData.images, imageUrl.trim()] })
            setImageUrl('')
        }
    }

    const handleRemoveImage = (index: number) => {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
    }

    const toggleSportType = (sport: string) => {
        if (formData.sportTypes.includes(sport)) {
            setFormData({ ...formData, sportTypes: formData.sportTypes.filter(s => s !== sport) })
        } else {
            setFormData({ ...formData, sportTypes: [...formData.sportTypes, sport] })
        }
    }

    const toggleAmenity = (amenity: string) => {
        if (formData.amenities.includes(amenity)) {
            setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) })
        } else {
            setFormData({ ...formData, amenities: [...formData.amenities, amenity] })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.name || !formData.location || !formData.city || !formData.pricePerHour) {
            setError('Please fill in all required fields')
            return
        }

        if (formData.sportTypes.length === 0) {
            setError('Please select at least one sport type')
            return
        }

        try {
            if (editingTurf) {
                await axiosInstance.put(API_PATHS.TURFS.UPDATE(editingTurf.id), formData)
            } else {
                await axiosInstance.post(API_PATHS.TURFS.CREATE, formData)
            }
            handleCloseModal()
            fetchTurfs()
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this turf?')) return

        try {
            await axiosInstance.delete(API_PATHS.TURFS.DELETE(id))
            fetchTurfs()
        } catch (error) {
            console.error('Error deleting turf:', error)
            alert('Failed to delete turf')
        }
    }

    const handleToggleActive = async (turf: Turf) => {
        try {
            await axiosInstance.put(API_PATHS.TURFS.UPDATE(turf.id), { isActive: !turf.isActive })
            fetchTurfs()
        } catch (error) {
            console.error('Error updating turf:', error)
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
                        <h1 className="text-2xl font-bold text-gray-900">Turf Management</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin")}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Admin
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-medium text-gray-500">Total Turfs</div>
                        <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-medium text-gray-500">Active</div>
                        <div className="text-2xl font-semibold text-green-600">{stats.active}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-medium text-gray-500">Inactive</div>
                        <div className="text-2xl font-semibold text-red-600">{stats.inactive}</div>
                    </div>
                </div>

                {/* Add Button */}
                <div className="mb-6">
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                    >
                        + Add New Turf
                    </button>
                </div>

                {/* Turfs Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turf</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sports</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {turfs.map((turf) => (
                                <tr key={turf.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                                                {turf.images && turf.images[0] ? (
                                                    <img src={turf.images[0]} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{turf.name}</div>
                                                <div className="text-sm text-gray-500">{turf.openTime} - {turf.closeTime}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{turf.location}</div>
                                        <div className="text-sm text-gray-500">{turf.city}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-green-600">₹{turf.pricePerHour}/hr</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {turf.sportTypes.slice(0, 2).map((sport, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                    {sport}
                                                </span>
                                            ))}
                                            {turf.sportTypes.length > 2 && (
                                                <span className="text-xs text-gray-500">+{turf.sportTypes.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleActive(turf)}
                                            className={`px-2 py-1 text-xs rounded ${turf.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {turf.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenModal(turf)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(turf.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingTurf ? 'Edit Turf' : 'Add New Turf'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{error}</div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (₹) *</label>
                                        <input
                                            type="number"
                                            value={formData.pricePerHour}
                                            onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Open Time *</label>
                                        <input
                                            type="time"
                                            value={formData.openTime}
                                            onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Close Time *</label>
                                        <input
                                            type="time"
                                            value={formData.closeTime}
                                            onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sports Types *</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sportTypeOptions.map((sport) => (
                                            <button
                                                key={sport}
                                                type="button"
                                                onClick={() => toggleSportType(sport)}
                                                className={`px-3 py-1 rounded-full text-sm ${formData.sportTypes.includes(sport) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            >
                                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                                    <div className="flex flex-wrap gap-2">
                                        {amenityOptions.map((amenity) => (
                                            <button
                                                key={amenity}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity)}
                                                className={`px-3 py-1 rounded-full text-sm ${formData.amenities.includes(amenity) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            >
                                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="Enter image URL"
                                            className="flex-1 border rounded-lg px-4 py-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddImage}
                                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {formData.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 text-green-600 rounded"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active (visible to users)</label>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        {editingTurf ? 'Update Turf' : 'Create Turf'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TurfManagement
