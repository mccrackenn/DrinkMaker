import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:4000' });
const liveClient = axios.create({
	baseURL: process.env.REACT_APP_URL,
	headers: {
		'X-RapidAPI-Host': process.env.REACT_APP_HOST,
		'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
	},
});

const pixabayClient = axios.create({
	baseURL:'https://pixabay.com/api/'
})

export const request = async ({ ...options }) => {
	client.defaults.headers.common.Authorization = 'Bearer token';
	const onSuccess = (response) => response;
	const onError = (error) => {
		//optinonally catch error and and add additional logging here
		return error;
	};
	try {
		const response = await client(options);
		return onSuccess(response);
	} catch (error) {
		return onError(error);
	}
};
export const liveRequest = async ({ ...options }) => {
	liveClient.defaults.headers.common.Authorization = 'Bearer token';
	const onSuccess = (response) => response;
	const onError = (error) => {
		//optinonally catch error and and add additional logging here
		return error;
	};
	try {
		const response = await liveClient(options);
		return onSuccess(response);
	} catch (error) {
		return onError(error);
	}
};

export const pixabayRequest = async({...options})=>{
	const onSuccess=(response)=> response
	const onError = error => {
		return error
	}
	try {
		const response = await pixabayClient(options);
		return onSuccess(response);
	} catch (error) {
		return onError
	}
}