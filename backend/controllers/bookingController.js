const { prisma } = require("../models/User");

// Create a new booking (Authenticated users)
exports.createBooking = async (req, res) => {
    const { turfId, date, startTime, endTime, notes } = req.body;

    if (!turfId || !date || !startTime || !endTime) {
        return res.status(400).json({ message: "Required fields: turfId, date, startTime, endTime" });
    }

    try {
        // Verify turf exists and is active
        const turf = await prisma.turf.findUnique({ where: { id: parseInt(turfId) } });
        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }
        if (!turf.isActive) {
            return res.status(400).json({ message: "This turf is currently not available" });
        }

        // Check if slot is already booked (pending or confirmed)
        const existingBooking = await prisma.booking.findFirst({
            where: {
                turfId: parseInt(turfId),
                date,
                startTime,
                endTime,
                status: { in: ["pending", "confirmed"] },
            },
        });

        if (existingBooking) {
            return res.status(409).json({ message: "This time slot is already booked" });
        }

        // Calculate total price based on hours
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = parseInt(endTime.split(":")[0]);
        const hours = endHour - startHour;
        const totalPrice = hours * turf.pricePerHour;

        const booking = await prisma.booking.create({
            data: {
                userId: req.user.id,
                turfId: parseInt(turfId),
                date,
                startTime,
                endTime,
                totalPrice,
                notes: notes || null,
                status: "pending",
            },
            include: {
                turf: {
                    select: { id: true, name: true, location: true, city: true, pricePerHour: true },
                },
                user: {
                    select: { id: true, fullname: true, email: true },
                },
            },
        });

        res.status(201).json({ message: "Booking created successfully. Waiting for admin approval.", booking });
    } catch (err) {
        res.status(500).json({ message: "Error creating booking", error: err.message });
    }
};

// Get available slots for a turf on a given date
exports.getAvailableSlots = async (req, res) => {
    const { turfId, date } = req.query;

    if (!turfId || !date) {
        return res.status(400).json({ message: "Required query params: turfId, date" });
    }

    try {
        const turf = await prisma.turf.findUnique({ where: { id: parseInt(turfId) } });
        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        // Get all booked slots for this turf on this date
        const bookedSlots = await prisma.booking.findMany({
            where: {
                turfId: parseInt(turfId),
                date,
                status: { in: ["pending", "confirmed"] },
            },
            select: { startTime: true, endTime: true, status: true },
        });

        // Generate all possible time slots from turf open/close time
        const openHour = parseInt(turf.openTime.split(":")[0]);
        const closeHour = parseInt(turf.closeTime.split(":")[0]);
        const slots = [];

        for (let h = openHour; h < closeHour; h++) {
            const start = `${h.toString().padStart(2, "0")}:00`;
            const end = `${(h + 1).toString().padStart(2, "0")}:00`;
            const booked = bookedSlots.find((b) => b.startTime === start);

            slots.push({
                startTime: start,
                endTime: end,
                isAvailable: !booked,
                status: booked ? booked.status : null,
            });
        }

        res.status(200).json({ turf: { id: turf.id, name: turf.name, openTime: turf.openTime, closeTime: turf.closeTime, pricePerHour: turf.pricePerHour }, date, slots });
    } catch (err) {
        res.status(500).json({ message: "Error fetching available slots", error: err.message });
    }
};

// Get current user's bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: {
                turf: {
                    select: { id: true, name: true, location: true, city: true, images: true, pricePerHour: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

// Cancel own booking (User)
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to cancel this booking" });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(req.params.id) },
            data: { status: "cancelled" },
            include: {
                turf: {
                    select: { id: true, name: true },
                },
            },
        });

        res.status(200).json({ message: "Booking cancelled successfully", booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ message: "Error cancelling booking", error: err.message });
    }
};

// ==================== ADMIN ENDPOINTS ====================

// Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const { status, turfId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (turfId) where.turfId = parseInt(turfId);

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: { id: true, fullname: true, email: true },
                },
                turf: {
                    select: { id: true, name: true, location: true, city: true, pricePerHour: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
};

// Update booking status (Admin) - confirm, cancel, complete
exports.updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    if (!status || !["confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'confirmed', 'cancelled', or 'completed'" });
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
            include: {
                user: {
                    select: { id: true, fullname: true, email: true },
                },
                turf: {
                    select: { id: true, name: true, location: true, city: true },
                },
            },
        });

        res.status(200).json({ message: `Booking ${status} successfully`, booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ message: "Error updating booking status", error: err.message });
    }
};

// Get booking stats (Admin)
exports.getBookingStats = async (req, res) => {
    try {
        const totalBookings = await prisma.booking.count();
        const pendingCount = await prisma.booking.count({ where: { status: "pending" } });
        const confirmedCount = await prisma.booking.count({ where: { status: "confirmed" } });
        const cancelledCount = await prisma.booking.count({ where: { status: "cancelled" } });
        const completedCount = await prisma.booking.count({ where: { status: "completed" } });

        // Revenue from confirmed + completed bookings
        const revenueResult = await prisma.booking.aggregate({
            where: { status: { in: ["confirmed", "completed"] } },
            _sum: { totalPrice: true },
        });

        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, fullname: true } },
                turf: { select: { id: true, name: true } },
            },
        });

        res.status(200).json({
            totalBookings,
            pendingCount,
            confirmedCount,
            cancelledCount,
            completedCount,
            totalRevenue: revenueResult._sum.totalPrice || 0,
            recentBookings,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching booking stats", error: err.message });
    }
};
