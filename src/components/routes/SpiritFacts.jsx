import { Box, Button, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { request,liveRequest } from '../../utilities/AxiosUtils';
import MuiImageList from '../mui-components/ImageList';
import MuiModal from '../mui-components/modal/MuiModal';
import DetailsTable from '../mui-components/mui-x-data-grid/DetailTable';

const SpiritFacts = ({ spirit }) => {
	const [searchParams] = useSearchParams();
	const [selectedDrink, setSelectedDrink] = useState(null);
	const [itemData, setItemData] = useState(null);
	const [tableView, setTableView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDrink, setModalDrink] = useState(null)
	const location = useLocation();
	console.log(location);

	// useEffect(() => {
	// 	const currentParams = Object.fromEntries([...searchParams]);
	// 	if (Object.keys(currentParams).length > 0) {
	// 		setSelectedDrink(currentParams);
	// 	}
	// }, [searchParams]);

	useEffect(() => {
		console.log(location);
		setSelectedDrink(location.state.ingData);
		setItemData(location.state.drinks);
	}, [location]);
  

	const handleItemClick = async (item) => {
		const drink = await request({ url: `/drinks?q=11000` });
		setModalDrink(drink.data[0]);
    setModalOpen(true)
		// try {
    //   const response = await liveRequest({
    //     url: '/lookup.php',
		// 		params: { i: item },
		// 	});
		// 	setModalDrink(response.data.drinks[0]);
    //   setModalOpen(true)
		// } catch (error) {
		// 	console.log(error.message);
		// }
	};

	return (
		<Grid container padding={2}>
			{selectedDrink && (
				<Grid
					margin={'0 auto'}
					item
					xs={12} lg={6}
					borderRadius={3}
					border={'1px solid grey'}
					sx={{
						color: 'hsl(0, 0%, 10%',
					}}
				>
					<Box
						sx={{
							padding: '2rem 0',
							backgroundImage: 'linear-gradient(to right, #141e30, #243b55)',
							color: 'hsl(300, 50%, 90%)',
							borderRadius: 3,
						}}
					>
						<Typography fontWeight={800} textAlign={'center'} variant='h4'>
							{selectedDrink.strIngredient}
						</Typography>
					</Box>
					<Box padding={2}>
						<Typography fontSize={'1.2rem'} lineHeight={1.3} variant='body'>
							{selectedDrink.strDescription}
						</Typography>
					</Box>
				</Grid>
			)}

			{itemData && (
				<Grid item xs={5}>
					<Button onClick={()=> setTableView(!tableView)} fullWidth variant='outlined'>
						{tableView?'Image View': 'Table View'}
					</Button>

				{tableView?	<DetailsTable rows={itemData} handleClick={(item) => handleItemClick(item)}/>
        :<MuiImageList
						itemData={itemData}
						handleItemClick={(item) => handleItemClick(item)}
					/>}
          <MuiModal modalDrink={modalDrink} open={modalOpen} setClose={()=> setModalOpen(false)} />
				</Grid>
			)}
		</Grid>
	);
};

export default SpiritFacts;
