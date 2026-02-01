const jwt = require("jsonwebtoken");
const { prisma } = require("../models/User");

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.id) },
            select: {
                id: true,
                fullname: true,
                email: true,
                profileImageUrl: true,
                role: true,
            },
        });
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = { protect };
