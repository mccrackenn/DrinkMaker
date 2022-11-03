import {
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Typography,
} from '@mui/material';

const MuiImageList = ({ itemData,handleItemClick,height }) => {
	return (
		<>
			{/* <ImageList sx={{ width: 700, height: 500 }} cols={3} rowHeight={164}>
				{itemData.map((item) => (
					<ImageListItem key={item.img}>
						<img
							src={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2`}
							alt={item.title}
							loading='lazy'
						/>
					</ImageListItem>
				))}
			</ImageList> */}

			<ImageList
			
				variant='woven'
				sx={{
					width: 700,
					height: 600,
					boxShadow:
						' rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;',
				}}
				cols={3}
				gap={8}
			>
				<Typography sx={{ alignSelf: 'center' }}>Popular Drinks</Typography>

				{itemData.map((item) => (
					<ImageListItem key={item.idDrink}>
						<img
							src={`${item.strDrinkThumb}`}
							alt={item.title}
							loading='lazy'
						/>
						<ImageListItemBar
							title={item.strDrink}
							sx={{ cursor: 'pointer' }}
							onClick={() => handleItemClick(item)}
						/>
					</ImageListItem>
				))}
			</ImageList>
		</>
	);
};

export default MuiImageList;
