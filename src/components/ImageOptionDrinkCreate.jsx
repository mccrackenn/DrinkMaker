import { Radio,RadioGroup,FormControlLabel,FormControl, FormLabel } from "@mui/material"

const ImageOptionDrinkCreate = ({radioValue,setRadioValue}) => {
  return (
    <FormControl>
        <FormLabel>Image Option</FormLabel>
        <RadioGroup
            value={radioValue}
            onChange={(e)=>setRadioValue(e.target.value) }
        >
        <FormControlLabel value="upload" control={<Radio  />} label="Upload Your Own Image" />
        <FormControlLabel value="search" control={<Radio />} label="Search Free Pixabay Images" />
        </RadioGroup>
    </FormControl>


  )
}

export default ImageOptionDrinkCreate