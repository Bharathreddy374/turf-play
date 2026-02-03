const { prisma } = require("../models/User");

// Create a new turf (Admin only)
exports.createTurf = async (req, res) => {
    const {
        name,
        description,
        location,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        images,
        pricePerHour,
        sportTypes,
        amenities,
        openTime,
        closeTime
    } = req.body;

    if (!name || !location || !city || !pricePerHour || !openTime || !closeTime) {
        return res.status(400).json({ message: "Required fields: name, location, city, pricePerHour, openTime, closeTime" });
    }

    try {
        const turf = await prisma.turf.create({
            data: {
                name,
                description,
                location,
                address,
                city,
                state,
                pincode,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                images: images || [],
                pricePerHour: parseFloat(pricePerHour),
                sportTypes: sportTypes || [],
                amenities: amenities || [],
                openTime,
                closeTime,
                ownerId: req.user.id,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                    }
                }
            }
        });

        res.status(201).json({ message: "Turf created successfully", turf });
    } catch (err) {
        res.status(500).json({ message: "Error creating turf", error: err.message });
    }
};

// Get all turfs (Public)
exports.getAllTurfs = async (req, res) => {
    try {
        const { city, sportType, minPrice, maxPrice, isActive } = req.query;

        const where = {};

        if (city) where.city = { contains: city, mode: 'insensitive' };
        if (sportType) where.sportTypes = { has: sportType };
        if (minPrice) where.pricePerHour = { ...where.pricePerHour, gte: parseFloat(minPrice) };
        if (maxPrice) where.pricePerHour = { ...where.pricePerHour, lte: parseFloat(maxPrice) };
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const turfs = await prisma.turf.findMany({
            where,
            include: {
                owner: {
                    select: {
                        id: true,
                        fullname: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(turfs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching turfs", error: err.message });
    }
};

// Get turf by ID (Public)
exports.getTurfById = async (req, res) => {
    try {
        const turf = await prisma.turf.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                    }
                }
            }
        });

        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        res.status(200).json(turf);
    } catch (err) {
        res.status(500).json({ message: "Error fetching turf", error: err.message });
    }
};

// Update turf (Admin only - owner or superadmin)
exports.updateTurf = async (req, res) => {
    const {
        name,
        description,
        location,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        images,
        pricePerHour,
        sportTypes,
        amenities,
        openTime,
        closeTime,
        isActive
    } = req.body;

    try {
        const turf = await prisma.turf.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        // Check if user is the owner or superadmin
        if (turf.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this turf" });
        }

        const updatedTurf = await prisma.turf.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(location && { location }),
                ...(address !== undefined && { address }),
                ...(city && { city }),
                ...(state !== undefined && { state }),
                ...(pincode !== undefined && { pincode }),
                ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
                ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
                ...(images && { images }),
                ...(pricePerHour && { pricePerHour: parseFloat(pricePerHour) }),
                ...(sportTypes && { sportTypes }),
                ...(amenities && { amenities }),
                ...(openTime && { openTime }),
                ...(closeTime && { closeTime }),
                ...(isActive !== undefined && { isActive }),
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullname: true,
                    }
                }
            }
        });

        res.status(200).json({ message: "Turf updated successfully", turf: updatedTurf });
    } catch (err) {
        res.status(500).json({ message: "Error updating turf", error: err.message });
    }
};

// Delete turf (Admin only)
exports.deleteTurf = async (req, res) => {
    try {
        const turf = await prisma.turf.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        // Check if user is the owner or superadmin
        if (turf.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this turf" });
        }

        await prisma.turf.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.status(200).json({ message: "Turf deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting turf", error: err.message });
    }
};

// Get turfs by owner (Admin)
exports.getMyTurfs = async (req, res) => {
    try {
        const turfs = await prisma.turf.findMany({
            where: { ownerId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(turfs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching turfs", error: err.message });
    }
};

// Get all turfs for admin dashboard
exports.getAllTurfsAdmin = async (req, res) => {
    try {
        const turfs = await prisma.turf.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const stats = {
            total: turfs.length,
            active: turfs.filter(t => t.isActive).length,
            inactive: turfs.filter(t => !t.isActive).length,
        };

        res.status(200).json({ turfs, stats });
    } catch (err) {
        res.status(500).json({ message: "Error fetching turfs", error: err.message });
    }
};
