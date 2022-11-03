import { Grid, TextField,  Container, Button } from '@mui/material';
import {  useState,useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import {
	signInWithGooglePopup,
	signInUsersWithEmailPassword,
} from '../../utilities/firebase/firebase.utils';
import SignupForm from '../SignupForm';

const defaultFormFields = {
	email: '',
	password: '',
};

const Login = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const navigate = useNavigate();
	const { email, password } = formFields;

	const [emailError, setEmailError] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setEmailError(false);
		if (
			email === '' ||
			!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
		) {
			setEmailError(true);
			return;
		}
		try {
			await signInUsersWithEmailPassword(email, password);
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormFields({
			...formFields,
			[name]: value,
		});
	};

	const signInWithGoogle = async () => {
		await signInWithGooglePopup();
		navigate('/');
	};

	return (
		<Container
			sx={{
				display: 'flex',
				marginTop: 10,
			}}
		>
			<Grid
				container
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
				}}
			>
				<Grid
					container
					component='form'
					onSubmit={handleSubmit}
					spacing={1}
					sx={{
						width: '70%',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Grid xs={12} item >
					<h2>Sign-In</h2>
						<TextField
							onChange={handleChange}
							value={email}
							name='email'
							variant={'standard'}

							fullWidth
							label='Email'
							type='text'
							placeholder='Email'
							error={emailError}
							helperText={emailError ? 'Invalid Email' : ''}
							onFocus={() => setEmailError(false)}
						/>
					</Grid>
					<Grid xs={12} item>
						<TextField
							onChange={handleChange}
							value={password}
							name='password'
							variant={'standard'}

							fullWidth
							label='Password'
							type='password'
							placeholder='Password'
							required
						/>
					</Grid>
					<Grid item sx={{ display: 'flex' }}>
						<Button type='submit' flex={1} fullWidth={true} >
							Sign-In
						</Button>
						<Button
							type='button'
							onClick={signInWithGoogle}
							flex={1}
							fullWidth={true}
							
						>
							Sign-In With Google
						</Button>
					</Grid>
				</Grid>
			</Grid>

			<Grid
				container
				spacing={1}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<SignupForm />
			</Grid>
		</Container>
	);
};

export default Login;
