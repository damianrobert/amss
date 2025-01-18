import {Request, Response, NextFunction, RequestHandler} from 'express';

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Locals {
			authUserData: {
				id: number;
				email: string;
				firstName: string;
				lastName: string;
				isAdmin: boolean;
			};
		}
	}
}
