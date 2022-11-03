import {
	Drawer,
	Typography,
	IconButton,
	List,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const drinkCategories = [
	{
		strCategory: 'Ordinary Drink',
	},
	{
		strCategory: 'Cocktails',
	},
	{
		strCategory: 'Shake',
	},
	{
		strCategory: 'Other/Unknown',
	},
	{
		strCategory: 'Cocoa',
	},
	{
		strCategory: 'Shot',
	},
	{
		strCategory: 'Coffee / Tea',
	},
	{
		strCategory: 'Homemade Liqueur',
	},
	{
		strCategory: 'Punch / Party Drink',
	},
	{
		strCategory: 'Beers',
	},
	{
		strCategory: 'Soft Drink',
	},
];

export const MuiDrawer = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<>
			<IconButton
				sx={{ color: 'white' }}
				size='large'
				edge='start'
				aria-label='logo'
				onClick={() => setIsDrawerOpen(true)}
			>
				<MenuIcon />
			</IconButton>
			<Drawer
				anchor='right'
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				PaperProps={{
					sx: {
						backgroundColor: '#c5d3e0',
					},
				}}
			>
				<Box p={2} width='250px' textAlign='center' role='presentation'>
					<Typography variant='h6'>Options</Typography>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							aria-controls='panel1a-content'
							id='panel1a-header'
						>
							<Typography sx={{ fontWeight: 'bold' }}>
								Drink Categories
							</Typography>
						</AccordionSummary>
						{drinkCategories.map((category) => (
							<AccordionDetails
								sx={{ cursor: 'pointer', textAlign: 'start' }}
								key={category.strCategory}
							>
								<StyledLink
									onClick={() => setIsDrawerOpen(false)}
									to={`/categories/${category.strCategory}`}
								>
									{category.strCategory}{' '}
								</StyledLink>
							</AccordionDetails>
						))}
					</Accordion>

					<Accordion>
						<AccordionSummary expandIcon={<ExpandMore />}>
							<Typography>
								<StyledLink
									onClick={() => setIsDrawerOpen(false)}
									to='/favorites'
								>
									My Favorites
								</StyledLink>
							</Typography>
						</AccordionSummary>
					</Accordion>

					<Accordion>
						<Box padding={2}>
							<Typography textAlign={'start'} sx={{ fontWeight: 'bold' }}>
								
								<StyledLink onClick={() => setIsDrawerOpen(false)} to='/create'>Create a Drink</StyledLink>
							</Typography>
						</Box>
					</Accordion>
				</Box>
			</Drawer>
		</>
	);
};
export default MuiDrawer;

const StyledLink = styled(Link)`
	color: black;
	text-decoration: none;
	font-size: 14px;
	font-weight: 200;
	list-style-type: none;
	:hover {
		color:navy;
	}
`;
