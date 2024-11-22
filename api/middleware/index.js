import admin from "../config/firebase-config.js";

export const decodeToken = async (req, res, next) => {
    const token = req.headers.token;

    try {
        const decodeValue = await admin.auth().verifyIdToken(token);

        if (decodeValue) {
            return next();
        }

        return res.status(200).json({message: 'Authorized'});
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}