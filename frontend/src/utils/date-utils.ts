export const formatSecondsToMMSS = (seconds: number): string => {
	if (seconds < 0) {
		throw new Error('Seconds cannot be negative.');
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60 == 60 ? 0 : (seconds % 60).toFixed(0);

	const minutesStr = minutes.toString().padStart(2, '0');
	const secondsStr = remainingSeconds.toString().padStart(2, '0');

	return `${minutesStr}:${secondsStr}`;
};
