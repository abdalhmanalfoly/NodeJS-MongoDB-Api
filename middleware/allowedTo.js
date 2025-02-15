const allowedTO = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: "User not authenticated" });
        }

        if (!req.user.role) {
            return res.status(400).json({ msg: "Role not found in token!" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: "You are not allowed to access this route" });
        }

        next();
    };
};

export default allowedTO;
