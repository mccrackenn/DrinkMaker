import Snackbar from '@mui/material/Snackbar';
import { Alert, Slide } from '@mui/material';
import { UserContext } from '../../../context/user/user.context';
import { useContext } from 'react';

const MuiSnackbar = ({ open, snackbarContent }) => {
	const { setSnackbar } = useContext(UserContext);

	return (
		<>
			<Slide in={open}  direction='left'>
				<Snackbar
					open={open}
					onClose={() => setSnackbar({ open: false })}
					autoHideDuration={5000}
				>
					<Alert severity={snackbarContent.severity}>
						{snackbarContent.message}
					</Alert>
				</Snackbar>
			</Slide>
		</>
	);
};

export default MuiSnackbar;
