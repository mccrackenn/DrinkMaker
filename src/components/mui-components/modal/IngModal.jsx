import { useState } from 'react';
import { Button, Modal, Box, Typography, Grid, TextField } from '@mui/material';
import Select from 'react-select';

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

const options = [
	{ value: 'ounce(s)', label: 'ounce(s)' },
	{ value: 'shot(s)', label: 'shot(s)' },

	{ value: 'liter(s)', label: 'liter(s)' },
	{ value: 'mls', label: 'mls' },
	{ value: 'dash', label: 'dash' },
	{ value: 'tbs', label: 'tbs' },
	{ value: 'tsp', label: 'tsp' },
];

const fieldValuesFields = {

	amount: '',
	measurement: '',
};

const fieldErrors={
    amount:false,
    measurement:false
}

const IngModal = ({ open, setClose, modalValue, returnValues }) => {
	const [fieldValues, setFieldValues] = useState(fieldValuesFields);
	const { amount, measurement } = fieldValues;
    const [error, setError] = useState(fieldErrors)

	const handleSubmit = () => {
        if(amount === '' || amount < 1){
            setError({...error,amount:true})
            return
        }
        returnValues({
            ...fieldValues,
            name:modalValue
        })
        setClose()
    };

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFieldValues({
			...fieldValues,
			[name]: Number(value),
		});
	};
	return (
		<div>
			<Modal
				open={open}
				onClose={setClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
					{modalValue}
					<div style={{ display: 'flex' }}>
						<Grid item xs={3}>
							<TextField
								onChange={handleChange}
                                onFocus={()=>setError(fieldErrors)}
								size='small'
								placeholder='value'
								type='number'
								name='amount'
								error={error.amount}
                                helperText={error.amount?'Cannot be blank or less than 0':''}
							/>
						</Grid>
						<Grid item xs={3}>
							<Select
                            
								options={options}
								onChange={(value) =>
									setFieldValues({ ...fieldValues, measurement: value.value })
								}
							/>
						</Grid>
						<Button onClick={handleSubmit} variant='outlined'>
							Submit
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default IngModal;
