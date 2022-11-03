import {
	Button,
	Modal,
	Box,
	Typography,
	IconButton,
	Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PixabayImageModal = ({ open, setClose, item,setSelection }) => {
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: `${item.webformatWidth}px`,
		height: `${item.webformatHeight}px`,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		padding: 4,
		backgroundImage: `url(${item.webformatURL})`,
	};
	const handleSelection =()=>{
		setClose(false)
		setSelection(item)
	}

	return (
		<div>
			<Modal
				open={open}
				onClose={setClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
					<IconButton
						title='Select and Save'
						size='large'
						sx={{ color: 'whitesmoke', opacity: 1.0 }}
						onClick={handleSelection}
					>
						<Avatar sx={{ backgroundColor: 'black',opacity:1.0 }}>
							<AddIcon  />
						</Avatar>
					</IconButton>
				</Box>
			</Modal>
		</div>
	);
};

export default PixabayImageModal;
