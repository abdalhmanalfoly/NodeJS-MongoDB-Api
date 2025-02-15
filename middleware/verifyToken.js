import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Access Denied. No Token Provided!" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    try {
        const verified = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET_KEY);
        req.user = verified; 
        next();
    } catch (err) {
        return res.status(400).json({ msg: "Invalid Token!" });
    }
};

export default verifyToken;
