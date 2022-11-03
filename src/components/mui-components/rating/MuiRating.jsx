import React, { useEffect, useState, useContext } from 'react';
import {
	Rating,
	Box,
	Typography,
	Button,
	Tooltip,
	Switch,
	FormGroup,
	FormControlLabel,
	TextField,
	List,
	ListItem,
	Stack,
	ListItemText,
	Grid,
} from '@mui/material';
import { ReviewContext } from '../../../context/reviews/review.contex';
import { UserContext } from '../../../context/user/user.context';
import PersonIcon from '@mui/icons-material/Person';
import StarBorderPurple500TwoToneIcon from '@mui/icons-material/StarBorderPurple500TwoTone';
import { checkIfObjectIsEmpty } from '../../../utilities/helpers';

const MuiRating = ({ drinkId }) => {
	const [rating, setRatingValue] = useState(null);
	const [editRatingValue, setEditedRatigValue] = useState(null);
	const { addReview, getNumberOfReviews, editReview } =
		useContext(ReviewContext);
	const { currentUser } = useContext(UserContext);
	const [comment, setComment] = useState(false);
	const [commentText, setCommentText] = useState(null);
	const [switchChecked, setSwitchChecked] = useState(false);
	const [numberOfReviews, setNumberOfReviews] = useState(null);
	const [viewComments, setViewComments] = useState(false);
	const [editDoc, setEditDoc] = useState(false);

	//Needed to pass drinkId as a prop, otherwise rating value persisted to all in muiImage
	useEffect(() => {
		setRatingValue(null);
		setComment(false);
		setSwitchChecked(false);
		setCommentText(null);
		const number = getNumberOfReviews(drinkId, currentUser);
		setNumberOfReviews(number);
	}, [drinkId, getNumberOfReviews, currentUser]);

	const handleAddReview = async () => {
		if (switchChecked && comment) {
			if (!commentText || commentText.length < 5) {
				alert('comment must be longer than 5 characters');
				return;
			}
		}
		if (!rating) {
			alert('Please add a rating');
		} else {
			await addReview(rating, drinkId, currentUser.uid, commentText);
			getNumberOfReviews(drinkId, currentUser);
		}
	};

	const handleEditReview = async (doc) => {
		setEditDoc(true);
		//await editReview(doc)
	};

	return (
		<>
			<Box padding={2}>
				{numberOfReviews && (
					<>
						<Typography component='legend'>{`Total Reviews (${numberOfReviews.results.length})`}</Typography>
						<Stack direction='row' display={'flex'} alignItems='center'>
							<Rating
								value={numberOfReviews['average']}
								precision={0.5}
								readOnly
							/>
							{numberOfReviews.areComments && (
								<Button onClick={() => setViewComments(!viewComments)}>
									{viewComments ? 'Hide Comments' : 'See Comments'}
								</Button>
							)}
						</Stack>
						{viewComments && (
							<List>
								{numberOfReviews.results.map((review, index) => {
									return (
										review.commentText && (
											<ListItem key={index}>
												{!currentUser || currentUser.uid !== review.uid ? (
													<PersonIcon />
												) : (
													<>
														<StarBorderPurple500TwoToneIcon color='primary' />
														<Typography variant='caption'>
															Your Review
														</Typography>
													</>
												)}
												<ListItemText
													sx={{ marginLeft: 2 }}
													primary={review.commentText}
													secondary={review.date}
												/>
											</ListItem>
										)
									);
								})}
							</List>
						)}
					</>
				)}
			</Box>
			<Tooltip
				title={!currentUser ? 'Only logged in users can leave ratings!' : ''}
			>
				<Typography color='red' variant='body1' textAlign={'center'}>
					{numberOfReviews && checkIfObjectIsEmpty(numberOfReviews.userReviewed)
						? `Your review from ${numberOfReviews.userReviewed.date}`
						: 'Rate Me!'}
				</Typography>
			</Tooltip>

			<Box
				padding={2}
				display={'flex'}
				justifyContent={'flex-start'}
				alignItems={'center'}
			>
				{numberOfReviews &&
				checkIfObjectIsEmpty(numberOfReviews.userReviewed) ? (
					<Rating
						value={
							editDoc ? editRatingValue : numberOfReviews.userReviewed.rating
						}
						precision={0.5}
						readOnly={!editDoc}
						onChange={(event, newValue) => {
							setEditedRatigValue(newValue);
						}}
					/>
				) : (
					<Rating
						sx={{ flex: 1 }}
						name='simple-controlled'
						value={rating}
						onChange={(event, newValue) => {
							setRatingValue(newValue);
						}}
						disabled={!currentUser}
					/>
				)}

				<FormGroup sx={{ flex: 1 }}>
					<FormControlLabel
						disabled={!currentUser}
						control={
							<Switch
								onChange={() => {
									setComment(!comment);
									setSwitchChecked(!switchChecked);
								}}
								checked={switchChecked}
							/>
						}
						label='Leave Comment'
					/>
				</FormGroup>
				{!editDoc && (
					<Button
						sx={{ flex: 1 }}
						onClick={
							numberOfReviews &&
							checkIfObjectIsEmpty(numberOfReviews.userReviewed)
								? () => handleEditReview(numberOfReviews.userReviewed.doc)
								: handleAddReview
						}
						variant='outlined'
						disabled={!currentUser}
					>
						{numberOfReviews &&
						checkIfObjectIsEmpty(numberOfReviews.userReviewed)
							? 'Edit'
							: 'Submit'}
					</Button>
				)}
			</Box>
	
			<Box>
				{comment && !editDoc && (
					<TextField
						onChange={(e) => setCommentText(e.target.value)}
						fullWidth
						multiline
					/>
				)}

				{numberOfReviews &&
					numberOfReviews.userReviewed.commentText && editDoc &&
					 (
						<TextField
						onChange={(e) => setCommentText(e.target.value)}
							fullWidth
							multiline
							defaultValue={numberOfReviews.userReviewed.commentText}
						/>
					)}
			</Box>
			{editDoc && (
				<Grid
					container
					sx={{ display: 'flex', justifyContent: 'space-evenly' }}
				>
					<Button onClick={() => editReview()} variant='outlined'>
						Submit Changes
					</Button>
					<Button onClick={() => setEditDoc(false)} variant='outlined'>
						Cancel
					</Button>
				</Grid>
			)}
		</>
	);
};

export default MuiRating;
