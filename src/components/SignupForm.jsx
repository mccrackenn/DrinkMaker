
import { Grid,TextField,Box,Button } from "@mui/material"
import { useState } from "react"
import { createAuthUserWithEmailandPassword, createUserDocumentFromAuth } from "../utilities/firebase/firebase.utils"

const defaultFormFields={
    email:'',
    displayName:'',
    password:'',
    confirmPassword:''
}
const errorFormFields={
    emailError:'',
    displayNameError:'',
    passwordError:'',
    confirmPasswordError:''
}


const  SignupForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields)
    const { email,displayName, password,confirmPassword } = formFields;
    const [error, setError] = useState(errorFormFields)
    const {emailError,displayNameError,passwordError,confirmPasswordError}=error

    const resetFormFields = () => { 
        setFormFields(defaultFormFields)
     }


    const handleSubmit = async (e) => {
		e.preventDefault();
		setError(errorFormFields);
		if (
			email === '' ||
			!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
		) {
            setError({...error,emailError:'Invalid email'});
            ;
			return;
		}
        if(password.length <  8){
          setError({passwordError:'Password is too short'})
          return
        }
        if(confirmPassword !== password){
            setError({ ...error,confirmPasswordError:"Passwords do not match"})
            return
        }
        if(displayName.length < 3){
            setError({...error,displayNameError:'Display Name Must be at least 3 characters'})
            return
        }
        try {
            const {user}= await createAuthUserWithEmailandPassword(email,password)
            await createUserDocumentFromAuth(user,{displayName})
            resetFormFields()
            
        } catch (err) {
            if(err && err.message === 'Firebase: Error (auth/email-already-in-use).'){
                setError({...error,emailError:'email already in use'})
                return
            }
        }
        
	};
    const handleChange = (event) => {
		const { name, value } = event.target;

		setFormFields({
			...formFields,
			[name]: value,
		});
	};

  return (
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

    <Grid xs={12} item>
    <h2>Sign-Up</h2>
        <TextField
            onChange={handleChange}
            value={email}
            variant={'standard'}
            name='email'
            fullWidth
            label='Email'
            type='text'
            placeholder='Email'
            error={emailError !==''}
            helperText={error.email !==''?emailError:''}
            onFocus={() => setError({...error,emailError:''})}
        />
    </Grid>
    <Grid xs={12} item>
        <TextField
            onChange={handleChange}
            value={displayName}
            variant={'standard'}

            name='displayName'
            fullWidth
            label='Display Name'
            type='text'
            placeholder='Enter a Display Name'
            required
            error={displayNameError !== ''}
            helperText={error.displayName !== ''?displayNameError:''}
            onFocus={() => setError({...error,displayNameError:''})}

        />
    </Grid>
    <Grid xs={12} item>
        <TextField
            onChange={handleChange}
            variant={'standard'}

            value={password}
            name='password'
            fullWidth
            label='Password'
            type='password'
            placeholder='Password'
            required
            error={passwordError !== ''}
            helperText={error.password !== ''?passwordError:''}
            onFocus={() => setError({...error,passwordError:''})}

        />
    </Grid>
    <Grid xs={12} item>
        <TextField
            onChange={handleChange}
            variant={'standard'}

            value={confirmPassword}
            name='confirmPassword'
            fullWidth
            label='Confirm Password'
            type='password'
            placeholder='Confirm Password'
            required
            error={confirmPasswordError !== ''}
            helperText={error.confirmPassword !== ''?confirmPasswordError:''}
            onFocus={() => setError({...error,confirmPasswordError:''})}
        />
    </Grid>
    <Grid item >
        <Button type='submit' flex={1} fullWidth={true} >
            Create
        </Button>
    </Grid>
</Grid>
  )
}
 export default SignupForm