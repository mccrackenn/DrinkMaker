import {
	Card,
	CardContent,
	CardHeader,
	Container,
	Divider,
	List,
	ListItem,
	ListItemText,
	Stack,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/user/user.context';
import DrinkCard from '../mui-components/DrinkCard';
import { ReviewContext } from '../../context/reviews/review.contex';
import { getUserMadeDrinks } from '../../utilities/firebase/firebase.utils';
import { Box } from '@mui/system';

const Favorites = () => {
	const { favorites, currentUser } = useContext(UserContext);
	const { reviews } = useContext(ReviewContext);
	const [myDrinks, setMyDrinks] = useState([]);
	useEffect(() => {
		getUserMadeDrinks(currentUser.uid).then((drinks) => setMyDrinks(drinks));
	}, [currentUser.uid]);

	return (
		<>
			{/* <div>
				{reviews &&
					reviews.filter((review) => review.userId === currentUser.uid).map(review => (
            <div>{review.drinkId}</div>
          ))}
			</div> */}

			<Container spacing={2} sx={{ display: 'flex', gap: '6em', marginTop: 4 }}>
				<Card sx={{ flex: 1, height: 300, border: '1px solid orange' }}>
					<CardHeader
						sx={{ textAlign: 'center',color:'white',backgroundColor:'orange' }}
						title='My Drinks'
					></CardHeader>
					<Divider sx={{ background: 'orange' }} />
					<CardContent>
						{myDrinks && (
							<List>
								{myDrinks.map((drink) => (
									<ListItem key={drink.id}>
										<ListItemText primary={drink.drink.drinkName} />
									</ListItem>
								))}
							</List>
						)}
					</CardContent>
				</Card>
				<Card sx={{ flex: 1 }}>
					<CardHeader
						sx={{ textAlign: 'center',color:'white',backgroundColor:'orange' }}
						title='My Reviews'
					></CardHeader>
					<Divider />
				</Card>
			</Container>

			<Stack
				mt={2}
				direction={'row'}
				height={'60vh'}
				sx={{
					display: 'flex',
					justifyContent: 'space-evenly',
					flexWrap: 'wrap',
					gap: 3,
				}}
			>
				{favorites &&
					Object.entries(favorites).map(([key, value]) => {
						return (
							<DrinkCard key={key} drink={value} height={'50vh'} width={400} />
						);
					})}
			</Stack>
		</>
	);
};

export default Favorites;
