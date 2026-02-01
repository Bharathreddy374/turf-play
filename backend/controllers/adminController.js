const { prisma } = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullname: true,
                email: true,
                profileImageUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true,
                fullname: true,
                email: true,
                profileImageUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { role },
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true,
            },
        });

        res.status(200).json({ message: "User role updated", user });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({ message: "Error updating user role", error: err.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.user.id === parseInt(req.params.id)) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        await prisma.user.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const adminCount = await prisma.user.count({ where: { role: 'admin' } });
        const userCount = await prisma.user.count({ where: { role: 'user' } });

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fullname: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.status(200).json({
            totalUsers,
            adminCount,
            userCount,
            recentUsers,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats", error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats };