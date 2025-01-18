import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Formik, Form} from 'formik';
import Select from 'react-select';
import {Button, CircularProgress, Switch, TextField, Alert, Snackbar} from '@mui/material';
import {request} from '../../../../../../api/api-handler';
import {AddGadgetRequest, GetRoomRequest} from '../../../../../../api/manage-rooms/manage-rooms-types';
import {GadgetType, DeviceType, SensorType} from '../../../../../../utils/GadgetsTypes';
import {defaultSelectStyles} from '../../../../../../components/select/DefaultSelectStyle';
import {AddCircleOutline} from '@mui/icons-material';

function AddNewGadgetOutlet() {
	const {roomId} = useParams<{roomId: string}>();

	const [room, setRoom] = useState<GetRoomRequest['response'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [snackMessage, setSnackMessage] = useState<string | null>(null);

	useEffect(() => {
		setIsLoading(true);
		request<never, never, GetRoomRequest['response']>(`/rooms/${Number(roomId)}`, {
			method: 'GET',
			successCallback(response) {
				setRoom(response);
				setIsLoading(false);
			},
			errorCallback() {
				setSnackMessage('Failed to fetch room details.');
				setIsLoading(false);
			},
		});
	}, [roomId]);

	return (
		<div className="flex flex-col gap-6 w-full max-w-2xl m-auto min-h-screen">
			{isLoading ? (
				<div className="flex justify-center">
					<CircularProgress size={48} />
				</div>
			) : (
				<>
					<header className="flex justify-between">
						<h2 className="text-4xl font-medium text-gray-800">Add a new Device or Sensor in room {room?.name}</h2>
					</header>

					<Formik
						initialValues={{
							gadgetType: null,
							deviceType: null,
							sensorType: null,
							isSimulated: false,
							gadgetName: '',
							gadgetIp: '',
						}}
						validate={(values) => {
							const errors: Record<string, string> = {};
							if (!values.gadgetType) errors.gadgetType = 'Gadget type is required';

							if (values.gadgetType === GadgetType.DEVICE && !values.deviceType) {
								errors.deviceType = 'Device type is required';
							}
							if (values.gadgetType === GadgetType.SENSOR && !values.sensorType) {
								errors.sensorType = 'Sensor type is required';
							}
							if (!values.gadgetIp && !values.isSimulated) {
								errors.gadgetIp = 'Gadget IP Address is required';
							}

							if (values.gadgetName.length < 3) {
								errors.gadgetName = 'Gadget name must be at least 3 characters long';
							}
							if (!values.isSimulated && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(values.gadgetIp)) {
								errors.gadgetIp = 'Invalid IP Address';
							}

							return errors;
						}}
						onSubmit={(values, {setSubmitting}) => {
							setSubmitting(true);

							request<never, AddGadgetRequest['payload'], AddGadgetRequest['response']>(`/rooms/${roomId}/new-gadget`, {
								method: 'POST',
								body: {
									gadgetType: values.gadgetType as unknown as string,
									isSimulated: values.isSimulated,
									deviceType: values.deviceType as unknown as string,
									sensorType: values.sensorType as unknown as string,
									gadgetName: values.gadgetName,
									gadgetIp: values.gadgetIp,
								},
								successCallback() {
									setSnackMessage('Gadget added successfully');
								},
								errorCallback() {
									setSnackMessage('Failed to add gadget');
								},
							});
							setSubmitting(false);
						}}
					>
						{({values, handleChange, handleBlur, setFieldValue, isSubmitting, errors, touched}) => (
							<Form className="flex flex-col gap-4">
								<section className="flex flex-col gap-2">
									<h4 className="text-2xl font-medium text-gray-800">Step 1. Select gadget type</h4>
									<Select
										placeholder="Select gadget type..."
										options={[
											{value: GadgetType.DEVICE, label: 'Device'},
											{value: GadgetType.SENSOR, label: 'Sensor'},
										]}
										styles={defaultSelectStyles}
										value={values.gadgetType ? {value: values.gadgetType, label: values.gadgetType} : null}
										onChange={(newValue) => {
											const option = newValue as {value: string};
											setFieldValue('gadgetType', option?.value || null);
											setFieldValue('deviceType', null);
											setFieldValue('sensorType', null);
										}}
									/>
									{touched.gadgetType && errors.gadgetType && <Alert severity="warning">{errors.gadgetType}</Alert>}
								</section>

								{values.gadgetType && (
									<section className="flex flex-col gap-2">
										<h4 className="text-2xl font-medium text-gray-800">
											Step 2. Select {values.gadgetType === GadgetType.DEVICE ? 'device' : 'sensor'} type
										</h4>
										<Select
											placeholder={`Select ${values.gadgetType === GadgetType.DEVICE ? 'device' : 'sensor'} type...`}
											options={Object.keys(values.gadgetType === GadgetType.DEVICE ? DeviceType : SensorType).map(
												(type) => ({
													value: type,
													label: type.charAt(0).toUpperCase() + type.slice(1),
												})
											)}
											styles={defaultSelectStyles}
											onChange={(option) =>
												setFieldValue(
													values.gadgetType === GadgetType.DEVICE ? 'deviceType' : 'sensorType',
													(option as {value: string})?.value || null
												)
											}
										/>
										{touched.deviceType && errors.deviceType && <Alert severity="warning">{errors.deviceType}</Alert>}
										{touched.sensorType && errors.sensorType && <Alert severity="warning">{errors.sensorType}</Alert>}
									</section>
								)}

								{(values.deviceType || values.sensorType) && (
									<section className="flex flex-col gap-4">
										<h4 className="text-2xl font-medium text-gray-800">Step 3. Fill in the connection</h4>
										<TextField
											fullWidth
											name="gadgetName"
											label={`${(values.gadgetType as unknown as string).charAt(0).toUpperCase()}${(
												values.gadgetType as unknown as string
											).slice(1)} name`}
											variant="outlined"
											value={values.gadgetName}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{touched.gadgetName && errors.gadgetName && <Alert severity="warning">{errors.gadgetName}</Alert>}
										<div className="flex justify-between items-center">
											<div>
												<div className="font-light text-lg">Simulated device</div>
												<div className="text-sm text-gray-600">Used for testing purposes</div>
											</div>
											<Switch
												checked={values.isSimulated}
												onChange={(e) => {
													setFieldValue('isSimulated', e.target.checked);
													setFieldValue('gadgetIp', '');
												}}
												color="primary"
											/>
										</div>
										<TextField
											fullWidth
											name="gadgetIp"
											label="Gadget IP Address"
											variant="outlined"
											value={values.gadgetIp}
											disabled={values.isSimulated}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{touched.gadgetIp && errors.gadgetIp && <Alert severity="warning">{errors.gadgetIp}</Alert>}
									</section>
								)}

								<Button
									type="submit"
									variant="contained"
									startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <AddCircleOutline />}
									disabled={
										isSubmitting ||
										!values.gadgetType ||
										(!values.deviceType && !values.sensorType) ||
										(!values.isSimulated && !values.gadgetIp) ||
										Object.keys(errors).length > 0
									}
								>
									{isSubmitting ? 'Adding...' : 'Add Gadget'}
								</Button>
							</Form>
						)}
					</Formik>
				</>
			)}

			<Snackbar open={!!snackMessage} autoHideDuration={6000} onClose={() => setSnackMessage(null)}>
				<Alert severity="error" onClose={() => setSnackMessage(null)}>
					{snackMessage}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default AddNewGadgetOutlet;
