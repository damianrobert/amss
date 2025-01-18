import {useContext, useEffect, useState} from 'react';
import Select from 'react-select';
import {Form, Formik} from 'formik';
import {AddCircleOutline} from '@mui/icons-material';
import {Alert, Button, CircularProgress, Snackbar, TextField} from '@mui/material';

import {defaultSelectStyles} from '../../../../../../../components/select/DefaultSelectStyle';
import {isValidCronExpression, TriggerType, TriggerCondition} from '../../../../../../../utils/TriggerUtils';
import {RoomContext} from '../../../../../../../context/RoomContext';
import {request} from '../../../../../../../api/api-handler';
import {GetAllRoomSensorsRequest} from '../../../../../../../api/manage-rooms/manage-rooms-types';
import {CreateScheduleTriggerRequest} from '../../../../../../../api/automations/AutomationsTypes';

function NewRoomTriggerPage() {
	const {getSelectedRoomId} = useContext(RoomContext);

	const [allSensors, setAllSensors] = useState<GetAllRoomSensorsRequest['response']['sensors'] | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [snackMessage, setSnackMessage] = useState<string | null>(null);

	useEffect(() => {
		setIsLoading(true);
		const roomId = getSelectedRoomId();
		request<never, never, GetAllRoomSensorsRequest['response']>(`/rooms/${Number(roomId)}/all-sensors`, {
			method: 'GET',
			successCallback(response) {
				setAllSensors(response.sensors);
				setIsLoading(false);
			},
			errorCallback() {
				setSnackMessage('Failed to fetch room details.');
				setIsLoading(false);
			},
		});
	}, [getSelectedRoomId]);

	const roomSensorsOptions = allSensors?.map((sensor) => ({value: sensor.id, label: sensor.name})) ?? [];

	return (
		<div className="flex flex-col gap-6 w-full max-w-2xl m-auto min-h-screen">
			{isLoading || !allSensors ? (
				<div className="flex justify-center">
					<CircularProgress size={48} />
				</div>
			) : (
				<>
					<header className="flex justify-between">
						<h2 className="text-4xl font-medium text-gray-800">Create a new trigger</h2>
					</header>

					<Formik
						initialValues={{
							triggerType: '',
							cronExp: '',
							selectedSensorId: '',
							condition: '',
							conditionValue: '',
						}}
						validate={(values) => {
							const errors: Record<string, string> = {};
							if (!values.triggerType) errors.triggerType = 'Trigger type is required';

							if (values.triggerType === TriggerType.SCHEDULE && !values.cronExp) {
								errors.cron_exp = 'Cron expression is required';
							}

							if (
								values.triggerType === TriggerType.SCHEDULE &&
								values.cronExp &&
								!isValidCronExpression(values.cronExp)
							) {
								errors.cron_exp = 'Invalid cron expression';
							}

							if (values.triggerType === TriggerType.SENSOR && !values.selectedSensorId) {
								errors.selectedSensorId = 'Sensor is required';
							}

							if (values.triggerType === TriggerType.SENSOR && !values.condition) {
								errors.condition = 'Condition is required';
							}

							if (values.triggerType === TriggerType.SENSOR && !values.conditionValue) {
								errors.conditionValue = 'Condition value is required';
							}

							return errors;
						}}
						onSubmit={(values, {setSubmitting}) => {
							setSubmitting(true);

							if (values.triggerType === TriggerType.SENSOR) {
								if (!values.selectedSensorId || !values.condition || !values.conditionValue) {
									setSnackMessage('Please fill all the fields');
									setSubmitting(false);
									return;
								}
							}

							if (values.triggerType === TriggerType.SCHEDULE) {
								if (!values.cronExp || !isValidCronExpression(values.cronExp)) {
									setSnackMessage('Invalid cron expression');
									setSubmitting(false);
									return;
								}
							}

							request<never, CreateScheduleTriggerRequest['payload'], CreateScheduleTriggerRequest['response']>(
								`/automations/triggers/new`,
								{
									method: 'POST',
									body: {
										roomId: getSelectedRoomId() ?? -1,
										triggerType: values.triggerType,
										cronExp: values.cronExp,
										selectedSensorId: values.selectedSensorId,
										condition: values.condition as TriggerCondition,
										conditionValue: values.conditionValue,
									},
									successCallback() {
										setSnackMessage('Trigger added successfully');
									},
									errorCallback() {
										setSnackMessage('Failed to add trigger');
									},
								}
							);
							setSubmitting(false);
						}}
					>
						{({values, handleChange, handleBlur, setFieldValue, isSubmitting, errors, touched}) => (
							<Form className="flex flex-col gap-4">
								<section className="flex flex-col gap-2">
									<h4 className="text-2xl font-medium text-gray-800">Step 1. Select trigger type</h4>
									<Select
										placeholder="Select trigger type..."
										options={[
											{value: TriggerType.SCHEDULE, label: 'Schedule'},
											{value: TriggerType.SENSOR, label: 'Sensor'},
										]}
										styles={defaultSelectStyles}
										value={values.triggerType ? {value: values.triggerType, label: values.triggerType} : null}
										onChange={(newValue) => {
											const option = newValue as {value: string};
											setFieldValue('triggerType', option?.value || null);
											setFieldValue('cronExp', null);
											setFieldValue('selectedSensorId', null);
											setFieldValue('condition', null);
											setFieldValue('conditionValue', null);
										}}
									/>
									{touched.triggerType && errors.triggerType && <Alert severity="warning">{errors.triggerType}</Alert>}
								</section>

								{values.triggerType && values.triggerType === TriggerType.SCHEDULE && (
									<section className="flex flex-col gap-2">
										<h4 className="text-2xl font-medium text-gray-800">Step 2. Select trigger schedule</h4>

										<TextField
											fullWidth
											name="cronExp"
											label="Cron Expression"
											variant="outlined"
											value={values.cronExp}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{touched.cronExp && errors.cronExp && <Alert severity="warning">{errors.cronExp}</Alert>}
									</section>
								)}

								{values.triggerType && values.triggerType === TriggerType.SENSOR && (
									<section className="flex flex-col gap-4">
										<h4 className="text-2xl font-medium text-gray-800">Step 2. Select the sensor</h4>
										<Select
											placeholder="Select sensor type..."
											options={roomSensorsOptions}
											styles={defaultSelectStyles}
											value={
												values.selectedSensorId
													? roomSensorsOptions.find((s) => s.value === Number(values.selectedSensorId))
													: null
											}
											onChange={(newValue) => {
												const option = newValue as {value: string};
												console.log(option);
												setFieldValue('selectedSensorId', option?.value || null);
											}}
										/>
										{touched.selectedSensorId && errors.selectedSensorId && (
											<Alert severity="warning">{errors.selectedSensorId}</Alert>
										)}
									</section>
								)}

								{values.triggerType && values.triggerType === TriggerType.SENSOR && values.selectedSensorId != null && (
									<section className="flex flex-col gap-4">
										<h4 className="text-2xl font-medium text-gray-800">Step 3. Define the trigger</h4>

										<Select
											placeholder="Select condition..."
											options={[
												{value: 'EQUALS', label: 'Equals'},
												{value: 'GREATER_THAN', label: 'Greater Than'},
												{value: 'LESS_THAN', label: 'Less Than'},
											]}
											styles={defaultSelectStyles}
											value={values.condition ? {value: values.condition, label: values.condition} : null}
											onChange={(newValue) => {
												const option = newValue as {value: string};
												setFieldValue('condition', option?.value || null);
											}}
										/>

										<TextField
											fullWidth
											name="conditionValue"
											label="Value"
											variant="outlined"
											value={values.conditionValue}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{touched.condition && errors.condition && <Alert severity="warning">{errors.condition}</Alert>}
										{touched.conditionValue && errors.conditionValue && (
											<Alert severity="warning">{errors.conditionValue}</Alert>
										)}
									</section>
								)}

								<Button
									type="submit"
									variant="contained"
									startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <AddCircleOutline />}
									disabled={
										isSubmitting ||
										!values.triggerType ||
										(values.triggerType === TriggerType.SCHEDULE && !values.cronExp) ||
										(values.triggerType === TriggerType.SENSOR &&
											!values.selectedSensorId &&
											!values.condition &&
											!values.conditionValue) ||
										Object.keys(errors).length > 0
									}
								>
									{isSubmitting ? 'Adding...' : 'Add new trigger'}
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

export default NewRoomTriggerPage;
