import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { request } from '../utilities/AxiosUtils';

const fetchPopularDrinks = async () => {
	return request({ url: '/drinks' });
};
const fetchCategories = ({ queryKey }) => {
	const pageNumber = queryKey[2];
	return request({
		url: `/categories/${queryKey[1].toLowerCase()}&_limit=8&_page=${pageNumber}`,
	});
};

const fetchCategoriesAll = async ({ queryKey }) => {
	console.log(queryKey);
	return request({
		url: `/categories/${queryKey[1].toLowerCase()}`,
	});
};




const fetchIngData = async ({ queryKey }) => {
	return request({
		url: '/ingredient-search',
	});
	// let data=queryKey[1].map(item => item.label).join(',')
	// console.log(data)

	// return await axios({
	// 	url: 'https://the-cocktail-db.p.rapidapi.com/filter.php',
	// 	method: 'get',
	//     params:{
	//         i:data
	//     },
	//     headers:{
	//         "X-RapidAPI-Key":"9eeea3f340msh7e8aa3b1e3a9966p1a707ejsnd78dbce39bd1",
	//         "X-RapidAPI-Host":"the-cocktail-db.p.rapidapi.com"
	//     }
	// });
};

export const usePopularDrinks = () => {
	return useQuery('popular-drinks', fetchPopularDrinks, {
		refetchOnWindowFocus: false,
		refetchInterval: 300000,
		select: (data) => data.data,
	});
};

//Pagination example
export const useCategories = (category, pageNumber) => {
	return useQuery(['categories', category, pageNumber], fetchCategories, {
		refetchOnWindowFocus: false,
		refetchInterval: 300000,
		select: (data) => data.data,
		keepPreviousData: true,
	});
};

export const useCategoriesAll = (category) => {
	return useQuery(['categories-all', category], fetchCategoriesAll, {
		enabled: false,
		select: (data) => data.data,
	});
};

export const useIngredientsData = (ingData) => {
	return useQuery(['ingredients-data', ingData], fetchIngData, {
		enabled: false,
		select: (data) => data.data,

		//FOR LIVE API!!!
		// select:(data)=> {
		//     console.log(data.data.drinks)
		//     return data.data.drinks
		// }
	});
};


