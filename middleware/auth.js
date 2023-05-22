import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      req.user = decoded;

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(401).json({ message: "Authorization header is missing" });
  }
};
