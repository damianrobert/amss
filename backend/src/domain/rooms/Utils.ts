// No alpha values
export const isValidHexColor = (input: string): boolean => {
	const hexPattern = /^#[0-9A-Fa-f]{6}$/;
	return hexPattern.test(input);
};
