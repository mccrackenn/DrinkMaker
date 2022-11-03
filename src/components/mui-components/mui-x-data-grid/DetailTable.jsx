import { Button, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';





const DetailsTable = ({ rows,handleClick }) => {
    const columns=[
        {field:'strDrink',headerName:'Drink',flex:2},
        {field:'link',headerName:'Link',flex:1,renderCell:(params)=>
            <Tooltip title="Click for Recipe Info">
                <IconButton onClick={()=>handleClick(params.id)}>
                    <InfoIcon />
                </IconButton>
            </Tooltip>
        }
    ]

	const getRowId = (params) => params.idDrink;
	return (
		// <Box sx={{width:'80%',height:'70vh',margin:'auto'}}>
		// 	<h2>Table</h2>
        <Box  sx={{height:'550px'}}>
			{rows && (
				<DataGrid
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "black",
                            color: "white",
                            fontSize: 12
                          },
                          "& .MuiSvgIcon-root":{
                              color:'silver'
                          },
                          justifyItems:'center'
                    }}
					getRowId={getRowId}
					rows={rows}
					columns={columns}
					rowsPerPageOptions={[10]}
					pageSize={25}
					checkboxSelection={false}
                    disableSelectionOnClick
                    
                    // onRowClick={(param)=> {
                    //     console.log(param)
                  
                    // }}
				/>
			)}
		</Box>
	);
};

export default DetailsTable;
