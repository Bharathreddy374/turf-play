import { createUser, comparePassword, prisma } from "../models/User";
const jwt = require("jsonwebtoken");

const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.registerUser = async (req: any, res: any) => {
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

        res.status(201).json({
            id: user.id,
            user: { id: user.id, fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl },
            token: generateToken(user.id),
        });
    } catch (err: any) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

exports.loginUser = async (req: any, res: any) => {
    const { email, pass } = req.body;
    if (!email || !pass) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.pass || !(await comparePassword(pass, user.pass))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            id: user.id,
            user: { id: user.id, fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl },
            token: generateToken(user.id),
        });
    } catch (err: any) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

exports.getUser = async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, fullname: true, email: true, profileImageUrl: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
};