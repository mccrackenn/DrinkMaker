import {
	Button,
	Grid,
	TextField,
	Input,
	FormGroup,
	FormControlLabel,
	Switch,
	Typography,
} from '@mui/material';
import Select from 'react-select';
import { drinkCategories } from '../../utilities/helpers';
import { useEffect, useState, useContext } from 'react';
import ProgressBar from '../ProgressBar';
import {
	addUserDrinkToDb,
	getIngredientsData,
} from '../../utilities/firebase/firebase.utils';
import AsyncSelect from 'react-select/async';
import IngModal from '../mui-components/modal/IngModal';
import ImageOptionDrinkCreate from '../ImageOptionDrinkCreate';
import PixabaySearch from '../PixabaySearch';
import { Stack } from '@mui/system';
import { UserContext } from '../../context/user/user.context';
import MuiSnackbar from '../mui-components/snackbar/MuiSnackbar';

const defaultFormFields = {
	drinkName: '',
	drinkCategory: '',
	drinkIngredients: [],
	drinkInstructions: '',
	otherIngredients: '',
	file: null,
	url: null,
};

const formErrors = {
	drinkNameError: null,
	drinkCategoryError: null,
	drinkIngredientsError: null,
	drinkInstructionsError: null,
	otherIngredientsError: null,
	fileError: null,
};

const CreateDrink = () => {
	const { currentUser,setSnackbar } = useContext(UserContext);
	const [formFields, setFormFields] = useState(defaultFormFields);
	const {
		drinkName,
		drinkCategory,
		drinkIngredients,
		drinkInstructions,
		otherIngredients,
		file,
		url,
	} = formFields;
	const [ingData, setIngData] = useState(null);
	const [fileUpload, setFileUpload] = useState(null);
	const [error, setError] = useState(formErrors);
	const {
		drinkNameError,
		drinkCategoryError,
		drinkIngredientsError,
		drinkInstructionsError,
		fileError,
	} = error;
	const [openModal, setOpenModal] = useState(false);
	const [modalValue, setModalValue] = useState(null);
	const [switchChecked, setSwitchChecked] = useState(false);
	const [radioValue, setRadioValue] = useState(null);
	const [searching, setSearching] = useState(false);


	const allowedImgTypes = ['image/png', 'image/jpeg'];

	const loadOptions = (searchValue, callback) => {
		const filteredOptions = ingData.filter((option) =>
			option.label.toLowerCase().includes(searchValue.toLowerCase())
		);
		callback(filteredOptions);
	};

	const handleSubmit = async (e) => {
		console.log('submitting');
		e.preventDefault();
		if (drinkName.length < 2) {
			setError({
				...error,
				drinkNameError: 'Drink Name must be at least 3 characters',
			});
			return;
		}
		if (drinkCategory === '') {
			setError({
				...error,
				drinkCategoryError: 'Please select a drink category',
			});
			return;
		}
		if (drinkIngredients.length < 1) {
			setError({
				...error,
				drinkIngredientsError: 'Drink must have at least one ingredient',
			});
			return;
		}
		if (drinkInstructions.length < 10) {
			setError({
				...error,
				drinkInstructionsError:
					'Drink Directions/Description must be at least 10 characters',
			});
			return;
		}
		//User has loaded a local file and there is no error, save image to FireStore Storage and save imageUrl
		if (file && !fileError) {
			console.log(file);
			setFileUpload({
				file,
				drink: {
					drinkName,
					drinkCategory,
					drinkIngredients,
				},
			});
		} else {
			const response = await addUserDrinkToDb(currentUser.uid, {
				drinkName,
				drinkCategory,
				drinkIngredients,
				imageUrl: !url ? null : url,
			});
			if (response === 'success') {
				setSnackbar({
					open:true,
					message:'Drink Successfully Saved',
					severity:'success'
				})
				setTimeout(()=>{
					setFormFields(defaultFormFields)
					setRadioValue(null)
				},4000)
			}
			if (response === 'error') {
				setSnackbar({
					open:true,
					message:'Error, please try again, contact IT if errors reoccurs',
					severity:'error'
				})
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
	const fileHandler = (e) => {
		let selected = e.target.files[0];
		if (selected && allowedImgTypes.includes(selected.type)) {
			//setFile(selected);
			setFormFields({ ...formFields, file: selected });
			setError({ ...error, fileError: '' });
		} else {
			setFormFields({ ...formFields, file: null });
			setError({
				...error,
				fileError: 'Please Select an image file type of png or jpeg',
			});
		}
	};
	//Use Effect for when user has picked an image, but then switch to Pixabay Search, clears out file selection
	useEffect(() => {
		if (radioValue === 'search' && file) {
			console.log('use effect render');
			setFormFields({ ...formFields, file: null });
		}
	}, [radioValue, file, formFields]);

	useEffect(() => {
		let results = [];
		getIngredientsData().then((data) =>
			data.data.map((item) => results.push({ value: item, label: item }))
		);
		setIngData(results);
	}, []);

	const handleModalIngAdd = async (value, act) => {
		const { action } = act;
		let result;
		if (action === 'select-option') {
			setModalValue(act.option.value);
			setOpenModal(true);
		}
		if (action === 'remove-value') {
			result = drinkIngredients.filter(
				(item) => act.removedValue.value !== item.name
			);
			setFormFields({ ...formFields, drinkIngredients: result });
		}
		if (action === 'clear')
			setFormFields({ ...formFields, drinkIngredients: [] });
	};



	return (
		<Grid
			container
			sx={{
				display: 'flex',
				justifyContent: 'center',
				marginBottom: 10,
				width: '100%',
			}}
		>
			<Grid
				item
				xs={9}
				component='form'
				onSubmit={handleSubmit}
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					marginTop: '4em',
					rowGap: '1.5em',
					marginLeft: '1.5em',
				}}
			>
				<Grid item xs={4}>
					<label>Label</label>
					<TextField
						name='drinkName'
						variant='filled'
						value={drinkName}
						label='Enter Drink Name'
						onChange={handleChange}
						type='text'
						error={drinkNameError ? true : false}
						helperText={drinkNameError ? drinkNameError : ''}
						onFocus={() => setError({ ...error, drinkNameError: null })}
						fullWidth
					/>
				</Grid>
				<Grid item xs={4}>
					<Select
						onChange={(e) => {
							setFormFields({ ...formFields, drinkCategory: e.value });
							setError({ ...error, drinkCategoryError: null });
						}}
						value={drinkCategory.value}
						placeholder='Choose Drink Category'
						name='drinkCategory'
						options={drinkCategories}
					/>
					{drinkCategoryError && (
						<Typography color='red'>{drinkCategoryError}</Typography>
					)}
				</Grid>

				<Grid item xs={6}>
					{ingData && (
						<AsyncSelect
							isMulti
							loadOptions={loadOptions}
							placeholder='Search and Add One or More Ingredients'
							onChange={(value, action) => {
								handleModalIngAdd(value, action);
								setError({ ...error, drinkIngredientsError: null });
							}}
						/>
					)}
					{drinkIngredientsError && (
						<Typography color='red'>{drinkIngredientsError}</Typography>
					)}
					{openModal && (
						<IngModal
							open={openModal}
							modalValue={modalValue}
							returnValues={(returnValues) =>
								setFormFields({
									...formFields,
									drinkIngredients: [...drinkIngredients, returnValues],
								})
							}
							setClose={() => setOpenModal(false)}
						/>
					)}
					{drinkIngredients.length > 0 && (
						<>
							<p>
								Current Ingredients:
								{drinkIngredients.map((item, index) => (
									<em key={index}>
										{index !== drinkIngredients.length - 1
											? `${item.name}-${item.amount} ${item.measurement}, `
											: `${item.name}-${item.amount} ${item.measurement}`}
									</em>
								))}
							</p>
						</>
					)}
				</Grid>

				<Grid xs={9} item>
					<FormGroup>
						<FormControlLabel
							control={
								<Switch onChange={() => setSwitchChecked(!switchChecked)} />
							}
							label='Add your own ingredients if not found in Search'
						/>
					</FormGroup>
				</Grid>

				<Grid xs={6} item>
					{switchChecked && (
						<div style={{ display: 'flex' }}>
							<TextField
								sx={{ flex: 2 }}
								placeholder='Enter Ingredient'
								variant='filled'
								value={otherIngredients}
								name='otherIngredients'
								onChange={handleChange}
							/>
							<Button
								sx={{ flex: 1 }}
								onClick={() => {
									setModalValue(otherIngredients);
									setFormFields({ ...formFields, otherIngredients: '' });
									setOpenModal(true);
								}}
								variant='contained'
								type='button'
							>
								Add
							</Button>
						</div>
					)}
				</Grid>

				<Grid item xs={6}>
					<TextField
						fullWidth
						multiline
						variant='filled'
						placeholder='Enter Directions/Description'
						name='drinkInstructions'
						value={drinkInstructions}
						onChange={handleChange}
						error={drinkInstructionsError}
						helperText={drinkInstructionsError ? drinkInstructionsError : ''}
						onFocus={() => setError({ ...error, drinkInstructionsError: null })}
					/>
				</Grid>

				<Grid item xs={12}>
					{!url && (
						<ImageOptionDrinkCreate
							radioValue={radioValue}
							setRadioValue={setRadioValue}
						/>
					)}
				</Grid>

				<Grid item xs={9}>
					{radioValue === 'upload' && (
						<Input type='file' onChange={fileHandler} />
					)}
					{file && <span>{file.name}</span>}
					{fileError && <span style={{ color: 'red' }}>{fileError}</span>}
					{fileUpload && (
						<ProgressBar fileUpload={fileUpload} setFile={setFileUpload} />
					)}
				</Grid>

				{url && radioValue !== 'upload' && (
					<Stack>
						<Grid item xs={3}>
							<Typography variant='caption'>Selection</Typography>
						</Grid>
						<Grid item xs={3}>
							<img
								width={url.previewWidth * 1.5}
								height={url.previewHeight * 1.5}
								src={url.previewURL}
								alt={url.tags}
							/>
						</Grid>
						<Button
							sx={{ width: url.previewWidth * 1.5 }}
							onClick={() => setFormFields({ ...formFields, url: null })}
							variant='contained'
						>
							Clear Selection
						</Button>
					</Stack>
				)}

				<Grid item xs={12}>
					{radioValue === 'search' && !url && (
						<PixabaySearch
							searching={searching}
							setSearching={setSearching}
							setSelection={(selection) =>
								setFormFields({ ...formFields, url: selection })
							}
						/>
					)}
				</Grid>

				<Grid item xs={6}>
					<Button
						fullWidth
						disabled={searching}
						variant='contained'
						type='submit'
					>
						Submit
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default CreateDrink;
