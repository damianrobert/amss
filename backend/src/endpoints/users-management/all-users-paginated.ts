import {Request, Response} from 'express';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {AllUsersPaginatedQuery, AllUsersPaginatedResponse} from 'domain/users-management/UsersManagementModelTypes';

export const getAllUsersPaginatedRequestHandler =
	(usersManagementRepository: IUsersManagementRepository) =>
	async (req: Request<unknown, GetAllUsersPaginatedRequestResponse, unknown, unknown>, res: Response<GetAllUsersPaginatedRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {page, limit} = req.query as GetAllUsersPaginatedRequestQuery;

		if (!page || !limit) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const users = await usersManagementRepository.getUsersPaginated({page: Number(page), limit: Number(limit)});

		res.send(users);
	};

type GetAllUsersPaginatedRequestResponse = AllUsersPaginatedResponse;

type GetAllUsersPaginatedRequestQuery = AllUsersPaginatedQuery;
