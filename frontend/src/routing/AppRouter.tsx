import {useContext} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import {RoomContext} from '../context/RoomContext';
import {AuthContext} from '../context/AuthContext';

import NotFoundPage from '../pages/404/NotFoundPage';
import LandingPage from '../pages/landing-page/LandingPage';
import DashboardWrapper from '../pages/dashboard/DashboardWrapper';
import AccountSettingsPage from '../pages/dashboard/outlets/account-settings/AccountSettingsPage';
import AccountSecurityPage from '../pages/dashboard/outlets/account-settings/outlets/security/AccountSecurityPage';
import UserProfileSettingsPage from '../pages/dashboard/outlets/account-settings/outlets/user-profile/UserProfileSettingsPage';
import ManageUsersPage from '../pages/dashboard/outlets/manage-users/ManageUsersPage';
import ManageRoomsPage from '../pages/dashboard/outlets/manage-rooms/ManageRoomsPage';
import ManageSpecificUserOutlet from '../pages/dashboard/outlets/manage-users/outlets/ManageSpecificUserOutlet';
import ManageAllUsersOutlet from '../pages/dashboard/outlets/manage-users/outlets/ManageAllUsersOutlet';
import AutomationsPage from '../pages/dashboard/outlets/automations/AutomationsPage';
import RegisterNewUserOutlet from '../pages/dashboard/outlets/manage-users/outlets/RegisterNewUserOutlet';
import ManageAllRoomsOutlet from '../pages/dashboard/outlets/manage-rooms/outlets/all-rooms/ManageAllRoomsOutlet';
import NewRoomOutlet from '../pages/dashboard/outlets/manage-rooms/outlets/NewRoomOutlet';
import DevicesPage from '../pages/dashboard/outlets/devices/outlets/ManageAllDevicesOutlet';
import SensorsPage from '../pages/dashboard/outlets/sensors/outlets/ManageAllSensorsOutlet';
import ManageDevicesPage from '../pages/dashboard/outlets/devices/ManageDevicesOutlet';
import NewDeviceOutlet from '../pages/dashboard/outlets/devices/outlets/NewDeviceOutlet';
import ManageSpecificDeviceOutlet from '../pages/dashboard/outlets/devices/outlets/ManageSpecificDeviceOutlet';
import ManageSensorsPage from '../pages/dashboard/outlets/sensors/ManageSensortsPage';
import ManageSpecificSensorOutlet from '../pages/dashboard/outlets/sensors/outlets/ManageSpecificSensorOutlet';
import NewSensorOutlet from '../pages/dashboard/outlets/sensors/outlets/RegisterNewSensorOutlet';
import ManageSpecificRoomOutlet from '../pages/dashboard/outlets/manage-rooms/outlets/specific-room/ManageSpecificRoomOutlet';
import AddNewGadgetOutlet from '../pages/dashboard/outlets/manage-rooms/outlets/specific-room/AddNewGadgetOutlet';
import RoomRoutinesOutlet from '../pages/dashboard/outlets/automations/outlets/routines/RoomRoutinesOutlet';
import RoomTriggersOutlet from '../pages/dashboard/outlets/automations/outlets/triggers/RoomTriggersOutlet';
import AllRoomRoutinesPage from '../pages/dashboard/outlets/automations/outlets/routines/outlets/AllRoomRoutinesPage';
import ManageRoomRoutinePage from '../pages/dashboard/outlets/automations/outlets/routines/outlets/ManageRoomRoutinePage';
import NewRoomRoutinePage from '../pages/dashboard/outlets/automations/outlets/routines/outlets/NewRoomRoutinePage';
import AllRoomTriggersPage from '../pages/dashboard/outlets/automations/outlets/triggers/outlets/AllRoomTriggersPage';
import ManageRoomTriggerPage from '../pages/dashboard/outlets/automations/outlets/triggers/outlets/ManageRoomTriggersPage';
import NewRoomTriggerPage from '../pages/dashboard/outlets/automations/outlets/triggers/outlets/NewRoomTriggersPage';

function AppRouter() {
	const {isUserAuthenticated, user} = useContext(AuthContext);
	const {getSelectedRoomId} = useContext(RoomContext);

	const selectedRoomId = getSelectedRoomId();

	return (
		<BrowserRouter>
			<Routes>
				{isUserAuthenticated && user ? (
					<>
						<Route key="dashboard" path="/" element={<DashboardWrapper />}>
							<Route key="dashboard-home" index element={<>home</>} />

							{Number(selectedRoomId) != -1 && (
								<>
									<Route key="dashboard-devices" path="/devices" element={<ManageDevicesPage />}>
										<Route key="dashboard-devices-index" index element={<DevicesPage />} />
										<Route key="dashboard-devices-new" path="new" element={<NewDeviceOutlet />} />
										<Route
											key="dashboard-devices-manage-device"
											path=":deviceId"
											element={<ManageSpecificDeviceOutlet />}
										/>
									</Route>
									<Route key="dashboard-sensors" path="/sensors" element={<ManageSensorsPage />}>
										<Route key="dashboard-sensors-index" index element={<SensorsPage />} />
										<Route key="dashboard-sensors-new" path="new" element={<NewSensorOutlet />} />
										<Route
											key="dashboard-sensors-manage-sensor"
											path=":sensorId"
											element={<ManageSpecificSensorOutlet />}
										/>
									</Route>

									<Route key="dashboard-automations" path="/automations" element={<AutomationsPage />}>
										<Route key="dashboard-automations-routines" element={<RoomRoutinesOutlet />}>
											<Route
												key="dashboard-automations-routines-index"
												path="routines/all"
												element={<AllRoomRoutinesPage />}
											/>
											<Route
												key="dashboard-automations-routines-new"
												path="routines/new"
												element={<NewRoomRoutinePage />}
											/>
											<Route
												key="dashboard-automations-routines-manage"
												path="routines/:routineId"
												element={<ManageRoomRoutinePage />}
											/>
										</Route>
										<Route key="dashboard-automations-triggers" path="triggers" element={<RoomTriggersOutlet />}>
											<Route key="dashboard-automations-triggers-index" path="all" element={<AllRoomTriggersPage />} />
											<Route key="dashboard-automations-triggers-new" path="new" element={<NewRoomTriggerPage />} />
											<Route
												key="dashboard-automations-triggers-manage"
												path=":triggerId"
												element={<ManageRoomTriggerPage />}
											/>
										</Route>
									</Route>
								</>
							)}

							{user.isAdmin && (
								<>
									<Route key="dashboard-users" path="/users" element={<ManageUsersPage />}>
										<Route key="dashboard-users-index" index element={<ManageAllUsersOutlet />} />
										<Route
											key="dashboard-users-manage-user"
											path="user/:userId"
											element={<ManageSpecificUserOutlet />}
										/>
										<Route key="dashboard-users-register" path="register" element={<RegisterNewUserOutlet />} />
									</Route>
									<Route key="dashboard-rooms" path="/rooms" element={<ManageRoomsPage />}>
										<Route key="dashboard-rooms-index" index element={<ManageAllRoomsOutlet />} />
										<Route key="dashboard-rooms-new" path="new" element={<NewRoomOutlet />} />
										<Route key="dashboard-rooms-manage-room" path=":roomId" element={<ManageSpecificRoomOutlet />} />

										<Route
											key="dashboard-rooms-room-new-gadget"
											path=":roomId/new-gadget"
											element={<AddNewGadgetOutlet />}
										/>
									</Route>
								</>
							)}
							<Route key="dashboard-user-settings" path="/account-settings" element={<AccountSettingsPage />}>
								<Route key="dashboard-user-settings-account" index element={<UserProfileSettingsPage />} />
								<Route key="dashboard-user-settings-security" path="security" element={<AccountSecurityPage />} />
							</Route>
						</Route>
					</>
				) : (
					<>
						<Route key="ladning-page" path="/" element={<LandingPage />} />
					</>
				)}
				<Route key="not-found" path="/not-found" element={<NotFoundPage />} />
				<Route key="unknown-page" path="*" element={<Navigate replace to="/not-found" />} />
			</Routes>
		</BrowserRouter>
	);
}

export default AppRouter;
