import { useEffect } from 'react';
import useStorage from '../hooks/useStorage';

const ProgressBar = ({ fileUpload, setFile}) => {
	const { url, progress } = useStorage(fileUpload);

    useEffect(()=>{
        if(url){
            setFile(null)
        }
    },[url,setFile])

	return (
		<div className='progress-bar' style={{ width: progress + '%' }}>
			Progress
		</div>
	);
};

export default ProgressBar;
