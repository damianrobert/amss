import React, {useEffect, useState} from 'react';
import {Box, TextField} from '@mui/material';

type OTPInputProps = {
	length?: number;
	otpFilledCallback: (otp: string) => void;
};

const OTPInput = ({length = 6, otpFilledCallback}: OTPInputProps) => {
	const [otp, setOtp] = useState(Array(length).fill(''));

	const handleChange = (value: string | string[], index: number) => {
		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);

		if (value && index < length - 1) {
			const nextInput = document.getElementById(`otp-input-${index + 1}`);
			nextInput?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-input-${index - 1}`);
			prevInput?.focus();
		}
	};

	useEffect(() => {
		if (otp.every((item) => typeof item === 'string' && /^[0-9]$/.test(item))) {
			console.log('otp', otp);
			otpFilledCallback(otp.join(''));
			setOtp(Array(length).fill(''));
			const input = document.getElementById(`otp-input-0`);
			input?.focus();
		}
	}, [otp]);

	return (
		<Box display="flex" gap={1} justifyContent="center">
			{otp.map((digit, index) => (
				<TextField
					key={index}
					id={`otp-input-${index}`}
					value={digit}
					onChange={(e) => handleChange(e.target.value, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					variant="outlined"
					inputProps={{
						style: {textAlign: 'center', width: '21px', height: '40px', fontSize: '1.5rem', fontWeight: 'bold'},
					}}
				/>
			))}
		</Box>
	);
};

export default OTPInput;
