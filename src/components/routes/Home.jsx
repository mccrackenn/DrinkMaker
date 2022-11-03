import { CircularProgress, Grid } from '@mui/material';
import MuiImageList from '../mui-components/ImageList';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DrinkCard from '../mui-components/DrinkCard';
import { usePopularDrinks } from '../../hooks/usePopularDrinks';
import { ReviewContext } from '../../context/reviews/review.contex';

const Home = () => {
	const [searchParams] = useSearchParams();
	const [selectedDrink, setSelectedDrink] = useState(null);

	useEffect(() => {
		const currentParams = Object.fromEntries([...searchParams]);
		if (Object.keys(currentParams).length > 0) {
			setSelectedDrink(currentParams);
		}
	}, [searchParams]);

	const handleClick = (item) => {
		setSelectedDrink(item);
	};

	const { data, isLoading, isError, error, isFetching } = usePopularDrinks();

	return (
		<>
		<Grid>
			Welcome To Drink Maker
		</Grid>

			<Grid
				container
				spacing={1}
				sx={{
					marginTop: 2,
				}}
			>
				<Grid
					item
					xs={6}
					sx={{
						display: 'flex',
						// 	alignSelf: 'center',
						justifyContent: 'center',
					}}
				>
					{selectedDrink && (
						<DrinkCard
							width={'70%'}
							drink={selectedDrink}
						/>
					)}
				</Grid>
				<Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
					{isLoading && <CircularProgress size={100} />}
					{data && (
						<>
							<MuiImageList height={'70%'} itemData={data} handleItemClick={handleClick} />
						</>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default Home;
