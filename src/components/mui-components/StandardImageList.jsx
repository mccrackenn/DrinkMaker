import React, { useState } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import PixabayImageModal from './modal/PixabayImageModal';

const StandardImageList = ({ itemData,setSelection }) => {
	const [open, setClose] = useState(false);
    const [item, setItem] = useState(null)

    const handleClick=(item)=>{
        console.log(item)
        setClose(true)
        setItem(item)
    }


	return (
		<>
			<ImageList variant='masonry' cols={4} gap={5}>
				{itemData.map((item) => (
					<ImageListItem
						key={item.id}
						onClick={()=>handleClick(item)}
						sx={{ cursor: 'pointer' }}
					>
						<img
							src={`${item.previewURL}?`}
							srcSet={`${item.previewURL}?`}
							alt={item.user}
							loading='lazy'
						/>
					</ImageListItem>
				))}
			</ImageList>
			{item && <PixabayImageModal setSelection={setSelection} open={open} item={item} setClose={()=>setClose(false)}/>}
		</>
	);
};

export default StandardImageList;
