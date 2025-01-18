type HTTPResponse = {
	statusCode: number;
	message: string;
};

type Statuses = 'OK' | 'CREATED' | 'ACCEPTED' | 'NO_CONTENT' | 'BAD_REQUEST' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'SERVER_ERROR';

export const HTTPResponses: Record<Statuses, HTTPResponse> = {
	OK: {statusCode: 200, message: 'OK'},
	CREATED: {statusCode: 201, message: 'CREATED'},
	ACCEPTED: {statusCode: 202, message: 'ACCEPTED'},
	NO_CONTENT: {statusCode: 204, message: 'NO_CONTENT'},
	BAD_REQUEST: {statusCode: 400, message: 'BAD_REQUEST'},
	FORBIDDEN: {statusCode: 403, message: 'FORBIDDEN'},
	NOT_FOUND: {statusCode: 404, message: 'NOT_FOUND'},
	CONFLICT: {statusCode: 409, message: 'CONFLICT'},
	SERVER_ERROR: {statusCode: 500, message: 'SERVER_ERROR'},
};
