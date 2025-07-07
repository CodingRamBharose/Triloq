import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send('you are not Authorized' );
    }
    jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.userId = decoded.userId;
        next();
    });
}