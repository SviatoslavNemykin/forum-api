import type { Request, Response, NextFunction, RequestHandler } from "express";

export function createRequireAuth(
    verifyAccessToken: (token: string) => number
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const accessToken = req.cookies.accessToken;

            if (typeof accessToken !== "string") {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const userId = verifyAccessToken(accessToken);
            res.locals.userId = userId;

            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    };
}