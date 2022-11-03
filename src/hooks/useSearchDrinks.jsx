import axios from 'axios';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

const fetchSearchDrinks = async ({ queryKey }) => {
    console.log(queryKey)
	// return request({url:`/search-drinks/q=${}`})
};

export const useSearchDrinks = (drink) => {
	
    return useQuery(['search-drinks',drink],fetchSearchDrinks)


};