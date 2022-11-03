import {
	collection,
	connectFirestoreEmulator,
	onSnapshot,
} from 'firebase/firestore';
import { createContext, useEffect, useReducer } from 'react';
import {
	addReviewToDb,
	collectionRef,
	getReviews,
} from '../../utilities/firebase/firebase.utils';
import { formatDate } from '../../utilities/helpers';
import { createAction } from '../user/reducer.utils';

const REVIEW_ACTION_TYPES = {
	SET_REVIEWS: 'SET_REVIEWS',
	SET_RATING: 'SET_RATING',
};

export const ReviewContext = createContext({
	reviews: [],
	rating: null,
	setRating: () => null,
	addReview: () => null,
	getNumberOfReviews: () => null,
    editReview:async()=>null
});

const reviewReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case REVIEW_ACTION_TYPES.SET_REVIEWS:
			return {
				...state,
				reviews: payload,
			};

		case REVIEW_ACTION_TYPES.SET_RATING:
			return {
				...state,
				rating: payload,
			};

		default:
			throw new Error(`Unhandled type ${type} in reviewReducer`);
	}
};

const INITIAL_STATE = {
	reviews: [],
	rating: null,
};

export const ReviewProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reviewReducer, INITIAL_STATE);
	const { reviews, rating } = state;

	const setReviews = (reviews) => {
		dispatch(createAction(REVIEW_ACTION_TYPES.SET_REVIEWS, reviews));
	};

	const addReview = async (rating, drinkId, userId, commentText) => {
		await addReviewToDb(rating, drinkId, userId, commentText);
	};

    const editReview =async(drinkId)=>{
        console.log(drinkId)
    }

	const getNumberOfReviews = (id, currentUser) => {
		let avgRating = 0;
		let areComments = false;
	
		let userReviewed={};
		let results = reviews
			.filter((review) => review.drinkId === id)
			.map((item) => {
				avgRating += item.rating;
				if (item.commentText) areComments = true;
                if(currentUser && currentUser.uid === item.userId){
                userReviewed={
                    date: formatDate(new Date(item.createdAt.toDate())),
					commentText: item.commentText,
                    rating:item.rating,
                    uid:item.userId,
                    doc:item.id
                    }
                    return userReviewed
                }else   
				return {
					date: formatDate(new Date(item.createdAt.toDate())),
					commentText: item.commentText,
                    rating:item.rating,
                    uid:item.userId,
                    doc:item.id


                   
				};
			});
		return {
			results,
			average: avgRating / results.length,
			areComments,
            userReviewed
		};
	};

	const setRating = (value) => {
		dispatch(createAction(REVIEW_ACTION_TYPES.SET_RATING, value));
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(collectionRef('reviews'), (snapshot) => {
			let results = [];
			snapshot.docs.forEach((doc) => {
				results.push({ ...doc.data(), id: doc.id });
			});
			console.log(results);
			setReviews(results);
		});
		return unsubscribe;
	}, []);

	const value = {
		reviews,
		setReviews,
		setRating,
		rating,
		addReview,
		getNumberOfReviews,
        editReview,
	};
	return (
		<ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
	);
};
