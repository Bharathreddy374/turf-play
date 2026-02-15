const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createUser, comparePassword, prisma } = require("../models/User");

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString("hex");
};

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const saveRefreshToken = async (userId, token) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await prisma.refreshToken.create({
        data: { token, userId, expiresAt },
    });
};

const cleanupExpiredTokens = async (userId) => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId,
            expiresAt: { lt: new Date() },
        },
    });
};

exports.registerUser = async (req, res) => {
    const { fullname, email, pass, profileImageUrl } = req.body;

    if (!fullname || !email || !pass) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        const user = await createUser({ fullname, email, pass, profileImageUrl });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        await saveRefreshToken(user.id, refreshToken);

        res.status(201).json({
            id: user.id,
            user: { id: user.id, fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl, role: user.role },
            token: accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, pass } = req.body;
    if (!email || !pass) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.pass || !(await comparePassword(pass, user.pass))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        await cleanupExpiredTokens(user.id);

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken();
        await saveRefreshToken(user.id, refreshToken);

        res.status(200).json({
            id: user.id,
            user: { id: user.id, fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl, role: user.role },
            token: accessToken,
            refreshToken,
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: { select: { id: true, fullname: true, email: true, profileImageUrl: true, role: true } } },
        });

        if (!storedToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        if (storedToken.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { id: storedToken.id } });
            return res.status(401).json({ message: "Refresh token expired. Please login again." });
        }

        // Rotate: delete old token and issue new pair
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });

        const newAccessToken = generateAccessToken(storedToken.userId);
        const newRefreshToken = generateRefreshToken();
        await saveRefreshToken(storedToken.userId, newRefreshToken);

        res.status(200).json({
            token: newAccessToken,
            refreshToken: newRefreshToken,
            user: storedToken.user,
        });
    } catch (err) {
        res.status(500).json({ message: "Error refreshing token", error: err.message });
    }
};

exports.logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        }
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error logging out", error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, fullname: true, email: true, profileImageUrl: true, role: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
};
