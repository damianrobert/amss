import axios, {AxiosError, AxiosRequestHeaders, AxiosResponse} from 'axios';

const API = axios.create({
	baseURL: 'http://localhost:8080/',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${localStorage.getItem('authToken')}`,
	},
});

type RequestDetails<ParamsType, BodyType, ResponseType> = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	params?: ParamsType;
	headers?: AxiosRequestHeaders;
	successCallback: (response: ResponseType) => void;
	errorCallback: (error: Error) => void;
} & ({method: 'POST' | 'PUT' | 'DELETE'; body?: BodyType} | {method: 'GET'; body?: never});

export const request = async <
	RequestParamsType extends Record<string, string | number | string>,
	RequestBodyType,
	RequestResponseType
>(
	API_URL: string,
	details: RequestDetails<RequestParamsType, RequestBodyType, RequestResponseType>
): Promise<void> => {
	let fullURL;
	if (details.params) {
		const keys = Object.keys(details.params);

		fullURL = `${API_URL}?${keys.map((key) => `${key}=${details.params?.[key]}`).join('&')}`;
	}

	try {
		let response: AxiosResponse;
		switch (details.method) {
			case 'GET':
				response = await API.get(fullURL ?? API_URL, {headers: details.headers});
				break;
			case 'POST':
				response = await API.post(fullURL ?? API_URL, details.body, {headers: details.headers});
				break;
			case 'PUT':
				response = await API.put(fullURL ?? API_URL, details.body, {headers: details.headers});
				break;
			case 'DELETE':
				response = await API.delete(fullURL ?? API_URL, {headers: details.headers});
				break;
		}

		details.successCallback(response?.data);
	} catch (error: unknown) {
		details.errorCallback(error as Error | AxiosError);
	}
};
