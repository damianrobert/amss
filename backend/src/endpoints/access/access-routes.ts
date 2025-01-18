import {Express} from 'express';

import {asyncHandler} from '../../endpoints/utils/async-handler';
import {passwordLoginRequestHandler} from './password-login';
import {totpLoginRequestHandler} from './totp-login';
import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {authenticatedUserEndpoint} from '../../middlewares/authenticated-user-endpoint';
import {totpInitializeActivationRequestHandler} from './totp-activation-initialize';
import {totpCompleteActivationRequestHandler} from './totp-activation-complete';
import {accountDetailsRequestHandler} from './account-details';
import {totpDisableRequestHandler} from './totp-disable';
import {passwordChangeRequestHandler} from './password-change';
import {updateAccountRequestHandler} from './update-account';

export const registerAccessEndpoints = (app: Express, accessRepository: IAccessRepository) => {
	app.post('/login', asyncHandler(passwordLoginRequestHandler(accessRepository)));
	// Step 2 is optional, only if user has 2FA enabled
	app.post('/login-totp', asyncHandler(totpLoginRequestHandler(accessRepository)));

	app.post('/user/totp/initialize', authenticatedUserEndpoint, asyncHandler(totpInitializeActivationRequestHandler(accessRepository)));
	app.post('/user/totp/activate', authenticatedUserEndpoint, asyncHandler(totpCompleteActivationRequestHandler(accessRepository)));
	app.post('/user/totp/disable', authenticatedUserEndpoint, asyncHandler(totpDisableRequestHandler(accessRepository)));
	app.get('/user/account-details', authenticatedUserEndpoint, asyncHandler(accountDetailsRequestHandler(accessRepository)));
	app.post('/user/change-password', authenticatedUserEndpoint, asyncHandler(passwordChangeRequestHandler(accessRepository)));
	app.put('/user/update-profile', authenticatedUserEndpoint, asyncHandler(updateAccountRequestHandler(accessRepository)));
};
