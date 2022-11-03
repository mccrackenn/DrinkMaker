import {
	Card,
	CardContent,
	CardMedia,
	ListItem,
	ListItemText,
	Stack,
	Grid,
	Typography,
	IconButton,
	Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from '../../context/user/user.context';
import { useContext, useState } from 'react';
import MuiRating from './rating/MuiRating';

const DrinkCard = ({ drink, width,height}) => {
	const { addToFavorites, favorites,removeFromFavorites } = useContext(UserContext);
	const handleAdd = async(item) => { 
		await addToFavorites(item)
	 }

	 const handleRemove=async(id)=>{
		removeFromFavorites(id)
	 }
	return (
		<Card
			sx={{
				// maxWidth: 445,
				overflowY:'scroll',
				width: width,
				height: height?height:'90%',
				boxShadow:
					' rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;',
			}}
		>
			<CardMedia
				sx={{ objectFit: 'contain' }}
				component='img'
				height='200'
				image={drink.strDrinkThumb}
			/>
			<CardContent>
				<Typography
					sx={{ textAlign: 'center' }}
					gutterBottom
					variant='h6'
					component='div'
				>
					{drink.strDrink}
				</Typography>

				<Stack direction='row' flexWrap={'wrap'}>
					{Object.entries(drink)
						.filter(([key, value]) => {
							if (
								key.match(/strIngredient/) &&
								value !== null &&
								value !== 'null'
							) {
								return { key, value };
							}
						})
						.map((item,index) => (
							<Grid item xs={3} key={index}>
								<ListItem >
									<ListItemText
										primaryTypographyProps={{ fontSize: '10px' }}
										sx={{ borderBottom: '1px solid rgba(200,200,200)' }}
										primary={item[1]}
										secondary={
											drink[`strMeasure${item[0].slice(-1)}`] !== 'null'
												? drink[`strMeasure${item[0].slice(-1)}`]
												: 'To Preference'
										}
									/>
								</ListItem>
							</Grid>
						))}
				</Stack>
				<Box ml={2} style={{ textAlign: 'left' }}>
					<Typography variant='caption'>{drink.strInstructions}</Typography>
				</Box>
				<Tooltip
					title={
						drink.idDrink in favorites
							? 'Remove From Favorites'
							: 'Add To Your Favorites'
					}
				>
					<IconButton
						color={drink.idDrink in favorites ? 'error' : 'default'}
						onClick={drink.idDrink in favorites ?()=>handleRemove(drink.idDrink)  :()=>handleAdd(drink)}
					>
						<FavoriteIcon fontSize='large' />
					</IconButton>
				</Tooltip>
				<MuiRating drinkId={drink.idDrink}/>
			</CardContent>
		</Card>
	);
};

export default DrinkCard;
