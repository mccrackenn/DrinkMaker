import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { request } from '../utilities/AxiosUtils';

const AsyncSelectHelper = ({ selectionHandler, ingData }) => {
	const handleChange = (selectedOption, actionMeta) => {
		const params = selectedOption.value;
		console.log(params);
		selectionHandler(params);
	};

	const loadOptions = useCallback(
		debounce((inputText, callback) => {
			getAsyncOptions(inputText).then((options) => callback(options));
		}, 1000),
		[]
	);

	const getAsyncOptions = async (inputText) => {
		const foundDrinks = ingData.filter((option) =>
			option.toLowerCase().includes(inputText.toLowerCase())
		);
		//await request({ url: `search-drinks?q=${inputText}` });
		const options = foundDrinks.map((drink) => ({
			value: drink,
			label: drink,
		}));
		return options;
	};

	return (
		<AsyncSelect
			loadOptions={loadOptions}
			onChange={handleChange}
			placeholder={'Enter Drink Name'}
		/>
	);
};

export default AsyncSelectHelper;
