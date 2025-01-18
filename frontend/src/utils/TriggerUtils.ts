export enum TriggerType {
	SCHEDULE = 'SCHEDULE',
	SENSOR = 'SENSOR',
}

export enum TriggerCondition {
	EQUALS = 'EQUALS',
	GREATER_THAN = 'GREATER_THAN',
	LESS_THAN = 'LESS_THAN',
}

export const isValidCronExpression = (expression: string): boolean => {
	const cronRegex = /^\s*([*/0-9,-]+)\s+([*/0-9,-]+)\s+([*/0-9,-]+)\s+([*/A-Z,-]+)\s+([*/0-9A-Z,-]+)\s*$/i;

	const match = expression.match(cronRegex);
	if (!match) return false;

	const [_, minute, hour, dayOfMonth, month, dayOfWeek] = match;

	const isValidRange = (field: string, min: number, max: number): boolean => {
		const parts = field.split(',');
		return parts.every((part) => {
			if (part === '*') return true;
			if (part.includes('/')) {
				const [range, step] = part.split('/');
				if (!step || isNaN(Number(step))) return false;
				return range === '*' || isValidRange(range, min, max);
			}
			if (part.includes('-')) {
				const [start, end] = part.split('-').map(Number);
				return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
			}
			return !isNaN(Number(part)) && Number(part) >= min && Number(part) <= max;
		});
	};

	return (
		isValidRange(minute, 0, 59) &&
		isValidRange(hour, 0, 23) &&
		isValidRange(dayOfMonth, 1, 31) &&
		isValidRange(month, 1, 12) &&
		isValidRange(dayOfWeek, 0, 7)
	);
};
