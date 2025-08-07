const jwt = require("jsonwebtoken");

const authMiddleware = async (request, response, next) => {
	const { token } = request.headers;
	console.log("Received token:", token);

	if (!token) {
		return response.status(401).json({
			success: false,
			message: "Oh no! We couldn’t find your token. Please log in again to continue.",
		});
	}

	try {
		console.log("JWT_SECRET_KEY from env:", process.env.JWT_SECRET_KEY);

		const token_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		console.log("Decoded token:", token_decoded);

		request.body.userId = token_decoded.id;
		console.log("User authenticated successfully!");
		next();
	} catch (error) {
		console.error("Token verification error:", error);
		response.status(403).json({
			success: false,
			message: "Uh-oh! Something went wrong while verifying your session. Please log in again.",
		});
	}
};

module.exports = authMiddleware;
