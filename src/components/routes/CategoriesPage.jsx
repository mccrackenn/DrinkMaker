import { Container, Grid, Box, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCategories, useCategoriesAll } from '../../hooks/usePopularDrinks';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import DetailsTable from '../mui-components/mui-x-data-grid/DetailTable';
import DrinkCard from '../mui-components/DrinkCard';
import { liveRequest } from '../../utilities/AxiosUtils';

const CategoriesPage = () => {
	const params = useParams();
	const [pageNumber, setPageNumber] = useState(1);
	const [tableView, setTableView] = useState(false);
	const [oneItem, setOneItem] = useState(null);

	const { data, isLoading, isFetching, isError, error } = useCategories(
		params.category,
		pageNumber
	);

	const { data: allCategoriesData, refetch } = useCategoriesAll(
		params.category
	);

	//Show table and hide Image view
	const handleTableClick = () => {
		if (!allCategoriesData) {
			refetch();
		}
		setTableView(!tableView);
	};

	const handleRowInfoClick = async (item) => {
		try {
			const response = await liveRequest({
				url: '/lookup.php',
				params: { i: item },
			});
			console.log(response);
			setOneItem(response.data.drinks[0]);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Grid container>
			{data && (
				<Grid item xs={12}>
					{!tableView && (
						<>
							<Button
								disabled={pageNumber === 1}
								onClick={() => setPageNumber((page) => page - 1)}
							>
								Previous Page
							</Button>
							<Button
								disabled={data.length % 8 !== 0}
								onClick={() => setPageNumber((page) => page + 1)}
							>
								Next Page
							</Button>
						</>
					)}
					<Button onClick={handleTableClick}>
						{tableView ? 'Image View' : 'Table View'}
					</Button>
				</Grid>
			)}

			{tableView && allCategoriesData ? (
				<Grid container display={'flex'} justifyContent={'space-around'} mt={2}>
					<Grid item xs={5}>
						<DetailsTable
							handleClick={handleRowInfoClick}
							rows={allCategoriesData}
						/>
					</Grid>
					<Grid item xs={4}>
						{oneItem && <DrinkCard drink={oneItem} />}
					</Grid>
				</Grid>
			) : (
				data && (
					<Grid
						container
						marginTop={4}
						marginBottom={4}
						rowGap={6}
						columnGap={2}
						display={'flex'}
						justifyContent={'space-evenly'}
					>
						{data.map((drink) => (
							<Grid
								component={motion.div}
								whileHover={{
									scale: 1.3,
									transition: { duration: 1 },
								}}
								sx={{
									border: '1px solid grey',
									height: '15em',
									backgroundImage: `url(${drink.strDrinkThumb})`,
									backgroundSize: 'cover',
									alignContent: 'center',
									padding: 0,
								}}
								item
								xs={2.5}
								key={drink.idDrink}
							>
								<Box
									sx={{
										width: '100%',
										backgroundColor: 'black',
									}}
									alignItems={'end'}
								>
									<Typography
										sx={{
											color: 'white',
											backgroundColor: '#988C8C',
											opacity: 0.6,
											fontWeight: 'bold',
										}}
										variant='h6'
									>
										{drink.strDrink}
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				)
			)}
		</Grid>
	);
};

export default CategoriesPage;
