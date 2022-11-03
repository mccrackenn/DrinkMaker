import { onSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useReducer } from 'react';
import {
	// createUserDocumentFromAuth,
	onAuthStateChangedListener,
	createUserDocumentFromAuth,
	getUserDocs,
	addUserFavorties,
	removeOneFromFavorites,
	favoritesCollectionRef,
} from '../../utilities/firebase/firebase.utils';
import { createAction } from './reducer.utils';
//Context is just a glorified component that leverages useState
//as the actual value you want to access
export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,
	favorites: {},
	addToFavorites: () => null,
	removeFromFavorites: () => null,
	setSnackbar:()=> null,
	snackbar:false,
	snackbarContent:{}
});

const USER_ACTION_TYPES = {
	SET_CURRENT_USER: 'SET_CURRENT_USER',
	SET_FAVORITES: 'SET_FAVORITES',
	OPEN_SNACKBAR: 'OPEN_SNACKBAR',
	CLOSE_SNACKBAR: 'CLOSE_SNACKBAR'
};

const userReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case USER_ACTION_TYPES.SET_CURRENT_USER:
			return {
				...state,
				currentUser: payload,
			};
		case USER_ACTION_TYPES.SET_FAVORITES:
			return {
				...state,
				favorites: payload,
			};
			case USER_ACTION_TYPES.OPEN_SNACKBAR:
				return {
					...state,
					snackbar:true,
					snackbarContent:payload
				}
			case USER_ACTION_TYPES.CLOSE_SNACKBAR:
				return {
					...state,
					snackbar:false,
					snackbarContent:{}
				}
		default:
			throw new Error(`Unhandled type ${type} in userReducer`);
	}
};

const INITIAL_STATE = {
	currentUser: null,
	favorites: {},
	snackbar:false,
	snackbarContent:{}
};

//Literal functional component
export const UserProvider = ({ children }) => {
	//const [currentUser, setCurrentUser] = useState(null);
	//Always 2 arguments back, first is the state object, the current values being stored by reducer
	const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);
	const { currentUser, favorites,snackbar,snackbarContent } = state;
	const setCurrentUser = (user) => {
		dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
	};
	const setUserFavorites = (favorites) => {
		console.log(favorites);
		dispatch(createAction(USER_ACTION_TYPES.SET_FAVORITES, favorites));
	};
	const addToFavorites = async (drink) => {
		if (!currentUser) {
			alert('Need to be logged in to save favorites');
			return;
		}
		await addUserFavorties(currentUser.uid, drink).catch((error) =>
			console.log('There has been an error')
		);
	};

	const removeFromFavorites = async (id) => {
		removeOneFromFavorites(currentUser.uid, id);
	};

	const setSnackbar=(snackbarObject)=>{
		if(snackbarObject.open === false){
			console.log('close snackbar')
			dispatch(createAction(USER_ACTION_TYPES.CLOSE_SNACKBAR,false))
		}else{
			console.log('in right place')
			dispatch(createAction(USER_ACTION_TYPES.OPEN_SNACKBAR,snackbarObject))
		}

		
	}

	const value = {
		currentUser,
		setCurrentUser,
		addToFavorites,
		favorites,
		removeFromFavorites,
		snackbar,
		setSnackbar,
		snackbarContent,
	};

	useEffect(() => {
		if (!currentUser) {
			return;
		}
		const unsubscribe = onSnapshot(
			favoritesCollectionRef(currentUser.uid),
			(snapshot) => {
				let results = {};
				snapshot.docs.forEach((doc) => {
					results[doc.data().idDrink] = doc.data();
				});
				setUserFavorites(results);
			}
		);

		return unsubscribe;
	}, [currentUser]);

	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener((user) => {
			if (user) {
				createUserDocumentFromAuth(user);
				getUserDocs(user.uid).then((favorites) => setUserFavorites(favorites));
			}
			setCurrentUser(user);
			setUserFavorites([]);
		});

		return unsubscribe;
	}, []);
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
