import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'

const Dashboard = () => {
  const { user, clearUser, isAdmin } = useContext(UserContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    if (!user) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [user, navigate])

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user:", error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    clearUser()
    navigate("/login")
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">Welcome to Turf Play</h1>
              {user && (
                <p className="text-gray-600 mt-2">Hello, {user.fullname}!</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isAdmin() && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Book a Turf</h3>
              <p className="text-sm">Find and book sports turfs near you</p>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
              <p className="text-sm">View your turf reservations</p>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p className="text-sm">Manage your account settings</p>
            </div>
          </div>

          {user && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">Your Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user.fullname}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">ID:</span> {user.id}</p>
                <p><span className="font-medium">Role:</span> <span className={`px-2 py-1 text-xs rounded ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
