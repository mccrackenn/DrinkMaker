import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import DrinkCard from '../DrinkCard';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const MuiModal = ({open, modalDrink,setClose}) => {
    console.log(open)
	return (
		<div>
			<Modal
				open={open}
				onClose={setClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
                    <DrinkCard drink={modalDrink} width={'90%'} height={500}/>
				</Box>
			</Modal>
		</div>
	);
};

export default MuiModal;
