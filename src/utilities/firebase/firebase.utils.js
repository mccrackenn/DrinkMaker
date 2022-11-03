import { initializeApp } from 'firebase/app';

import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from 'firebase/auth';

import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	writeBatch,
	serverTimestamp,
	onSnapshot,
	collection,
	query,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBNF4kTzfZDqk3TGjZy1gIDndNnZhb6ky8',
	authDomain: 'drinkmaker-cf2ef.firebaseapp.com',
	projectId: 'drinkmaker-cf2ef',
	storageBucket: 'drinkmaker-cf2ef.appspot.com',
	messagingSenderId: '467665059301',
	appId: '1:467665059301:web:19e9b8c1e9f45f6b53030c',
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export default storage;
export const db = getFirestore();
export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const onAuthStateChangedListener = (callback) => {
	console.log(callback);
	onAuthStateChanged(auth, callback);
};

export const signOutUser = async () => signOut(auth);

export const signInUsersWithEmailPassword = async (email, password) => {
	if (!email || !password) {
		return;
	}
	return await signInWithEmailAndPassword(auth, email, password);
};

export const createAuthUserWithEmailandPassword = async (email, password) => {
	if (!email || !password) {
		return;
	}
	return await createUserWithEmailAndPassword(auth, email, password);
};

export const createUserDocumentFromAuth = async (
	userAuth,
	additionalInformation = {}
) => {
	if (!userAuth) return;
	const userDocRef = doc(db, 'users', userAuth.uid);

	const userSnapshot = await getDoc(userDocRef);

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log('Error creating the user', error.message);
		}
	}
	return userDocRef;
};

//Ingredient Data stored in Firestore on one doc, in an array of Strings
export const getIngredientsData = async () => {
	const docRef = doc(db, 'ingredients', 'wpp90Bap0Mi6hNAZopXr');
	return getDoc(docRef).then((snapshot) => snapshot.data());
};

export const getUserDocs = async (uid) => {
	const userRef = doc(db, 'users', uid);
	const collectionRef = collection(userRef, 'favorites');
	const q = query(collectionRef);
	const a = await getDocs(q);
	let results = {};
	a.forEach((doc) => {
		results[doc.data().idDrink] = doc.data();
	});
	return results;
};
export const getUserDocsSnapshot = async (uid) => {
	const userRef = doc(db, 'users', uid);
	const collectionRef = collection(userRef, 'favorites');
	onSnapshot(collectionRef, (snapshot) => {
		let results = {};
		snapshot.docs.forEach((doc) => {
			results[doc.data().idDrink] = doc.data();
		});
		console.log(snapshot.docs);
		return results;
	});
};

export const addUserFavorties = async (uid, drink) => {
	const userRef = doc(db, 'users', uid);
	const collectionRef = collection(userRef, 'favorites');
	const myDoc = await setDoc(doc(collectionRef, drink.idDrink), drink);
	console.log(myDoc);

	//setting a custom Id
};
export const favoritesCollectionRef = (uid) => {
	const userRef = doc(db, 'users', uid);
	return collection(userRef, 'favorites');
};

export const collectionRef = (coll) => {
	return collection(db, coll);
};

export const removeOneFromFavorites = (uid, id) => {
	const userRef = doc(db, 'users', uid);
	const collectionRef = collection(userRef, 'favorites');
	const docRef = doc(collectionRef, id);
	deleteDoc(docRef);
};

export const getUserMadeDrinks = async (uid) => {
	const userRef = doc(db, 'users', uid);
	const collectionRef = collection(userRef, 'myDrinks');
	let results = [];
	await getDocs(collectionRef).then(snapshot => 
		snapshot.docs.forEach(doc => {
			results.push({ ...doc.data(), id: doc.id });
		})
		
	);
	return results
};

//Reviews
export const getReviews = () => {
	const colRef = collection(db, 'reviews');
	getDocs(colRef).then((snapshot) => {
		let results = [];
		snapshot.docs.forEach((doc) => {
			results.push({ ...doc.data(), id: doc.id });
		});
		console.log(results);
		return results;
	});
};

export const addReviewToDb = async (rating, drinkId, userId, commentText) => {
	await addDoc(collection(db, 'reviews'), {
		drinkId,
		rating,
		userId,
		commentText,
		createdAt: new Date(),
	});
};
export const editReviewToDb = async (doc) => {
	const docRef = doc(db, 'reviews', doc);
	await updateDoc(docRef, {});
};

export const addUserDrinkToDb = async (uid, drink) => {
	const userRef = doc(db, 'users', uid);
	const collectionRef = collection(userRef, 'myDrinks');
	try {
		const response = await addDoc(collectionRef, {
			drink,
		});
		if (response.type === 'document') {
			return 'success';
		}
	} catch (error) {
		if (error) {
			return 'error';
		}
	}
};

// export const addCollectionAndDocuments = async (
// 	collectionKey,
// 	objectsToAdd,
// 	field
// ) => {
// 	console.log(objectsToAdd)

// 	const docData={data:objectsToAdd}
// 	await addDoc(collection(db,'ingredients'),docData)
// 	// const collectionRef = collection(db, collectionKey);
// 	// //transaction, represents a successful unit of work to a DB
// 	// //a successful transaction is storing all objects to a collection
// 	// //a batch is what we get from the writeBatch method imported from FireStore
// 	// const batch = writeBatch(db);
// 	// //Attach many writes, deletes, sets to the batch
// 	// objectsToAdd.forEach((object) => {
// 	// 	const docRef = doc(collectionRef, object.title.toLowerCase());
// 	// 	batch.set(docRef, object);
// 	// });

// 	// await batch.commit();
// 	// console.log('done');
// };
