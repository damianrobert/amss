import {ErrorMessage, Form, Formik} from 'formik';
import {AddLocationAlt, Cancel} from '@mui/icons-material';
import {TextField, Alert, Button, CircularProgress, Popover, Tooltip} from '@mui/material';
import {ChromePicker} from 'react-color';
import {useState} from 'react';
import {request} from '../../api/api-handler';
import {CreateNewRoomRequest} from '../../api/manage-rooms/manage-rooms-types';
import {useNavigate} from 'react-router-dom';

function AdminNewRoomForm() {
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

	const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const isPopoverOpen = Boolean(anchorEl);

	return (
		<div className="flex flex-col gap-6 items-center w-lg ">
			<Formik
				initialValues={{newRoomName: '', color: ''}}
				validate={(values) => {
					const errors: {newRoomName?: string; newPassword?: string; newPasswordRepeat?: string} = {};

					if (values.newRoomName.length < 4 || values.newRoomName.length > 84) {
						errors.newRoomName = 'Room name must have between 4 and 84 characters ';
					}

					return errors;
				}}
				onSubmit={(values, {setSubmitting, setValues}) => {
					setSubmitting(true);

					request<never, CreateNewRoomRequest['payload'], CreateNewRoomRequest['response']>('/rooms/new', {
						method: 'POST',
						body: {
							name: values.newRoomName,
							color: values.color,
						},
						successCallback(response) {
							navigate('/rooms/' + response.newRoomId);
						},
						errorCallback() {
							setValues({newRoomName: '', color: ''});
						},
					});
				}}
			>
				{({isSubmitting, handleChange, handleBlur, values, errors, touched, setFieldValue}) => {
					return (
						<Form className="flex flex-col gap-3 w-full ">
							<div className="flex flex-col gap-4 w-full">
								<div className="flex flex-col gap-1">
									<TextField
										autoComplete="new-room-name"
										fullWidth
										id="new-room-name"
										name="newRoomName"
										label="Room name"
										variant="outlined"
										value={values.newRoomName}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{values.newRoomName !== '' && touched.newRoomName && errors.newRoomName && (
										<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
											<ErrorMessage name="newRoomName" />
										</Alert>
									)}
								</div>
								<div className="flex flex-col gap-1">
									<div>Color</div>
									<Tooltip title="Select a color for the room" arrow>
										<div
											onClick={(e) => handleOpenPopover(e)}
											className="h-12 w-12 cursor-pointer rounded-md shadow-md"
											style={{
												background: values.color ?? '#FFFFFF',
												border: `2px solid ${values.color === '#FFFFFF' ? values.color : '#AAA'}`,
											}}
										/>
									</Tooltip>

									<Popover
										open={isPopoverOpen}
										anchorEl={anchorEl}
										onClose={handleClosePopover}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'center',
										}}
									>
										<ChromePicker
											color={values.color ?? '#FFFFFF'}
											onChange={(color) => setFieldValue('color', color.hex)}
										/>
									</Popover>

									{values.color !== '' && touched.color && errors.color && (
										<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
											<ErrorMessage name="color" />
										</Alert>
									)}
								</div>
							</div>
							<div className="mt-4">
								<Button
									type="submit"
									className="w-full"
									variant="contained"
									startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <AddLocationAlt />}
									disabled={isSubmitting || !!errors.newRoomName || !values.newRoomName || !values.color}
								>
									{isSubmitting ? 'Loading...' : 'Create room'}
								</Button>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}

export default AdminNewRoomForm;
