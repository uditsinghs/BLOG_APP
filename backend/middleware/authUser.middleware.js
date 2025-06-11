import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies; // Corrected from req.cookie to req.cookies

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("Decode info:-", decoded);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export const isAuthorized = (role) => {
  return (req, res, next) => {
    try {
    
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized user",
          success: false,
        });
      }
    
      if (!role.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          success: false,
        });
      }
      next(); 
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  };
};
