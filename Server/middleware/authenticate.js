import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  // Extract the token from cookies or authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {   
    const decoded = jwt.verify(token, process.env.KEY);
    console.log("Decoded Token:", decoded); // Debug decoded token
    req.user = decoded; // Attach decoded token data to req.user
    console.log(req.user)
    next();

  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
