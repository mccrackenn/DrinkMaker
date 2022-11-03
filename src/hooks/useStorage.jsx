import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState, useEffect,useContext } from 'react';
import { UserContext } from '../context/user/user.context';
import storage, { addUserDrinkToDb } from '../utilities/firebase/firebase.utils';

const useStorage = (fileUpload) => {
    const {currentUser} =useContext(UserContext)
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [url, setUrl] = useState(null);
	const {file,drink}=fileUpload

	useEffect(() => {
		const storageRef = ref(storage, `/files/${currentUser.uid}/${file.name}`);
        
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				let percent = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);

				setProgress(percent);
			},
			(err) => {
				console.log(err);
				setError(err);
			},
			async () => {
				getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
					//setUrl(url);
					addUserDrinkToDb(currentUser.uid,{...drink,imageUrl:imageUrl})
					setUrl(imageUrl)
				}
				);
				
			}
		);
	}, [file]);

	return { progress, url, error };
};

export default useStorage;

//FIREBASE STORAGE
// export const handleStorageUpload=async(image)=>{
// 	const storageRef=ref(storage,`/images/${image.name}`)
// 	const uploadTask = uploadBytesResumable(storageRef,image)

// }
