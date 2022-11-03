import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { request } from '../../utilities/AxiosUtils';
import { useNavigate, createSearchParams } from 'react-router-dom';

const DrinkSearch = () => {
	const navigate = useNavigate();
    
	const [selectedValue, setselectedValue] = useState([]);
	const handleChange = (selectedOption, actionMeta) => {
	
		const params = selectedOption.value;
		navigate({
			pathname: '/',
			search: `?${createSearchParams(params)}`,
		});
	};

	const colorStyles = {
		control: (styles) => ({ ...styles, width: 300 }),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			return { ...styles, color: 'black' };
		},
	};
	const loadOptions =useCallback(debounce((inputText, callback) => {
        getAsyncOptions(inputText).then((options)=>callback(options))
	}, 3000),[]);

    const getAsyncOptions = async (inputText) => {
        const foundDrinks = await request({ url: `search-drinks?q=${inputText}` });
        const options = foundDrinks.data.map((drink) => ({
			value: drink,
			label: drink.strDrink,
		}));
        return options
    }

	return (
		<AsyncSelect
			styles={colorStyles}
			loadOptions={loadOptions}
			handleChange={handleChange}
			onChange={handleChange}
            value={selectedValue}
			placeholder={'Search by Name'}
		/>
	);
};

export default DrinkSearch;
