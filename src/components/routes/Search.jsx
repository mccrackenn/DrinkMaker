import { Button, Grid, Box, Typography, Card } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useCallback, useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { liveRequest, request } from '../../utilities/AxiosUtils';
import debounce from 'lodash.debounce';
import {
	useIngredientsData,
	useSearchIngByName,
} from '../../hooks/usePopularDrinks';
import MuiImageList from '../mui-components/ImageList';
import DrinkCard from '../mui-components/DrinkCard';
import AsyncSelectHelper from '../../utilities/AsyncSelectHelper';
import axios from 'axios';
import {
	addCollectionAndDocuments,
	getIngredientsData,
} from '../../utilities/firebase/firebase.utils';
import { createSearchParams, useNavigate } from 'react-router-dom';

const quickSearchData = [
	{ title: 'Vodka', url: './images/vodka.jpg' },
	{ title: 'Gin', url: './images/gin.jpg' },
	{ title: 'Tequila', url: './images/tequila.jpg' },
	{ title: 'Whiskey', url: './images/whiskey.jpg' },
	{ title: 'Sake', url: './images/sake.jpg' },
];

const Search = () => {
	const [activeChip, setactiveChip] = useState(null);
	const [selectValue, setSelectValue] = useState([]);
	const [oneItem, setOneItem] = useState(null);
	const { data, refetch } = useIngredientsData(selectValue);
	const [ingData, setIngData] = useState(null);
	const navigate = useNavigate();

	//Submit button handler for React-Select Multi
	const handleIngSubmit = () => {
		if (!selectValue.length) {
			alert('Must have input to submit');
			return;
		}
		refetch();
	};

	const handleQuickSearch = async (name) => {
		// const response = await request({url:`tequila`})
		// console.log(response)
		// if(response.status === 200){

		// }
		// const params=(response.data[0])

		//FOR LIVE API RESULTS
		//1st request to get spirit information, 2nd is to get the drinks with that spirit
		try {
			const getIngData = await liveRequest({
				url: `/search.php`,
				params: { i: name },
			});
			if (getIngData.status === 200) {
				try {
					const getIngDrinks = await liveRequest({
						url: '/filter.php',
						params: { i: name },
					});
					console.log(getIngData.data.ingredients[0])
					console.log(getIngDrinks.data.drinks)

					navigate('/spirits',{
						state:{
							ingData:getIngData.data.ingredients[0],
							drinks:getIngDrinks.data.drinks
						}
					})

				} catch (error) {
					console.log(error)
				}
			}
		} catch (error) {
			console.log(error);
		}

		//const params1 = response[0].data.ingredients[0];

		// console.log(params);
		// navigate({
		// 	pathname: '/spirits',
		// 	search: `?${createSearchParams(params)}`,
		// });
	};

	useEffect(() => {
		console.log('getting data');
		getIngredientsData().then((data) => setIngData(data.data));

		// // let results = [];
		// // const getData = async () => {
		// // 	const data = await axios.get('../loaddata.json');
		// // 	results = data.data.ingredients.map((ing) => {
		// // 		return ing.strIngredient1;
		// // 	});
		// // 	setIngData(results)
		// // };
		// getData();
	}, []);

	const handleItemClick = async (item) => {
		const drink = await request({ url: `/drinks?q=11000` });
		setOneItem(drink.data[0]);
		// try {
		// 	const response = await liveRequest({
		// 		url: '/lookup.php',
		// 		params: { i: item.idDrink },
		// 	});
		// 	setOneItem(response.data.drinks[0]);
		// } catch (error) {
		// 	console.log(error.message);
		// }
	};
	const clearFilters = (all = true) => {
		setactiveChip('');
		setSelectValue([]);
		setOneItem(null);
	};

	const loadOptions = useCallback(
		debounce((inputText, callback) => {
			getAsyncOptions(inputText).then((options) => callback(options));
		}, 1000),
		[]
	);

	const getAsyncOptions = async (inputText) => {
		console.log(inputText);
		const foundDrinks = await request({ url: `ingredients?q=${inputText}` });
		const options = foundDrinks.data.map((ing) => ({
			value: ing,
			label: ing.strIngredient1,
		}));
		return options;
	};

	return (
		<>
			<Box textAlign={'center'}>
				<Typography alignContent={'center'} variant='h4'>
					Search Page
				</Typography>
				<Typography variant='caption'>
					Search for Drinks by Drink Name
				</Typography>
			</Box>
			<Grid container marginTop={4} sx={{ justifyContent: 'start' }}>
				<Chip
					sx={{ marginLeft: 2 }}
					color={activeChip === 'Drink Name' ? 'primary' : 'default'}
					onClick={() =>
						activeChip === 'Drink Name'
							? clearFilters()
							: setactiveChip('Drink Name')
					}
					label='Drink Name'
				/>
				<Chip
					sx={{ marginLeft: 2 }}
					color={activeChip === 'Ingredient' ? 'primary' : 'default'}
					onClick={() =>
						activeChip === 'Ingredient'
							? clearFilters()
							: setactiveChip('Ingredient')
					}
					label='Drink Ingredient'
				/>
				<Chip
					sx={{ marginLeft: 2 }}
					color={activeChip === 'Quick Search' ? 'primary' : 'default'}
					onClick={() =>
						activeChip === 'Quick Search'
							? setactiveChip('')
							: setactiveChip('Quick Search')
					}
					label='Quick Search'
				/>
			</Grid>

			{activeChip === 'Drink Name' && ingData && (
				<Grid container padding={2} mt={2}>
					<Grid item xs={4}>
						<AsyncSelectHelper
							ingData={ingData}
							selectionHandler={(item) => setOneItem(item)}
						/>
					</Grid>
				</Grid>
			)}

			{activeChip === 'Ingredient' && (
				<Grid padding={2} container sx={{ marginTop: 2, display: 'flex' }}>
					<Grid item xs={4}>
						<AsyncSelect
							loadOptions={loadOptions}
							isMulti={true}
							onChange={(val) => setSelectValue(val)}
							placeholder={'Add one or more ingredients'}
						/>
					</Grid>
					<Button onClick={handleIngSubmit} variant='outlined'>
						Submit
					</Button>
					<Button
						sx={{ marginLeft: 1 }}
						onClick={clearFilters}
						variant='outlined'
					>
						Clear
					</Button>
				</Grid>
			)}

			{activeChip === 'Quick Search' && (
				<Grid
					container
					mt={4}
					sx={{ display: 'flex', justifyContent: 'space-evenly' }}
				>
					{quickSearchData.map((item) => (
						<Grid key={item.title}>
							<Typography fontWeight={900} textAlign={'center'}>
								{item.title}
							</Typography>
							<Card
								onClick={() => handleQuickSearch(item.title)}
								key={item.title}
								sx={{
									width: 400,
									height: 270,
									border: '1px solid grey',
									backgroundImage: `url(${item.url})`,
									cursor: 'pointer',
									borderRadius: '50% 20% / 10% 40%',
								}}
							></Card>
						</Grid>
					))}
				</Grid>
			)}

			<Grid container display={'flex'} justifyContent={'space-evenly'}>
				{data && (
					<MuiImageList itemData={data} handleItemClick={handleItemClick} />
				)}
				{oneItem && (
					<Grid item xs={4} marginTop={2}>
						<DrinkCard drink={oneItem} />
					</Grid>
				)}
			</Grid>
		</>
	);
};

export default Search;
