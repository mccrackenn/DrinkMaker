import { Grid, MenuItem, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { ReactComponent as PixabayLogo } from '../assets/pixabay-logo.svg';
import { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { pixabayRequest } from '../utilities/AxiosUtils';
import StandardImageList from './mui-components/StandardImageList';
import { CircularProgress } from '@mui/material';

const PixabaySearch = ({ setSelection, searching, setSearching }) => {
	const [pageNumber, setPageNumber] = useState(1);
	const [pixabayData, setPixabayData] = useState(null);

	const loadOptions = useCallback(
		debounce((inputText) => {
			setSearching(true);
			getAsyncOptions(inputText.target.value).then((options) => {
				setPixabayData(options);
				setSearching(false);
			});
		}, 2000),
		[]
	);

	const handleSelection = (selection) => {
		setSelection(selection);
	};

	const getAsyncOptions = async (inputText) => {
		const data = await pixabayRequest({
			params: {
				key: '23477729-ef27f725dcfb61e09f7cd377f',
				lang: 'en',
				q: inputText,
				image_type: 'photo',
				page: pageNumber,
			},
		});
		console.log(data);
		return data.data.hits;
		// const options = foundDrinks.data.map((ing) => ({
		// 	value: ing,
		// 	label: ing.strIngredient1,
		// }));
		// return options;
	};

	return (
		<Grid
			spacing={2}
			container
			sx={{ display: 'flex', justifyContent: 'flex-start' }}
		>
			<Grid item xs={6}>
				<Stack sx={{ display: 'flex', alignItems: 'center', rowGap: 1 }}>
					<h3>Search Free Images in Pixabay</h3>
					<PixabayLogo width='120' height='120' />
					<TextField
						onFocus={() => setSearching(true)}
						onBlur={()=> setSearching(false)}
						fullWidth
						label='Enter Search Text'
						name='search'
						placeholder='Search'
						onChange={(val) => loadOptions(val)}
					>
						
					</TextField>
					{searching &&  <CircularProgress />}
						
				</Stack>
			</Grid>
			<Grid item xs={7}>
				{pixabayData && (
					<StandardImageList
						itemData={pixabayData}
						setSelection={handleSelection}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default PixabaySearch;
