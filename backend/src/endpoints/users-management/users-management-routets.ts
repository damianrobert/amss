import {Express} from 'express';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {asyncHandler} from '../../endpoints/utils/async-handler';

import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {authenticatedUserEndpoint} from '../../middlewares/authenticated-user-endpoint';
import {getAllUsersPaginatedRequestHandler} from './all-users-paginated';
import {deleteUserRequestHandler} from './delete-user';
import {disableTwoFactorAuthUserRequestHandler} from './disable-two-factor-auth-user';
import {updateUserRequestHandler} from './update-user';
import {registerNewUserRequestHandler} from './register-new-user';
import {getUserManageRequestHandler} from './get-user';
import {changeUserPasswordRequestHandler} from './change-user-password';

export const registerUsersManagementEndpoints = (app: Express, usersManagementRepository: IUsersManagementRepository, accessRepository: IAccessRepository) => {
	app.get('/users-all', authenticatedUserEndpoint, asyncHandler(getAllUsersPaginatedRequestHandler(usersManagementRepository)));
	app.post('/users/user', authenticatedUserEndpoint, asyncHandler(registerNewUserRequestHandler(usersManagementRepository, accessRepository)));
	app.get('/users/user/:userId', authenticatedUserEndpoint, asyncHandler(getUserManageRequestHandler(usersManagementRepository)));

	app.put('/users/user/:userId', authenticatedUserEndpoint, asyncHandler(updateUserRequestHandler(usersManagementRepository)));
	app.put('/users/user/:userId/password', authenticatedUserEndpoint, asyncHandler(changeUserPasswordRequestHandler(usersManagementRepository)));

	app.delete('/users/user/:userId', authenticatedUserEndpoint, asyncHandler(deleteUserRequestHandler(usersManagementRepository)));

	app.post('/users/user/:userId/disable-totp', authenticatedUserEndpoint, asyncHandler(disableTwoFactorAuthUserRequestHandler(usersManagementRepository)));
};
