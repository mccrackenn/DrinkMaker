export const formatDate = (date) => { 
    let year = date.getFullYear().toString()
    let month=(date.getMonth()+1).toString();
    let day= date.getDate()
    if (month.length < 2) month='0'+month
    if (day.length < 2) day='0'+month

    return month+"-"+day+"-"+year
 }

 export const checkIfObjectIsEmpty=(obj)=> Object.keys(obj).length > 0

 export const drinkCategories = [
	{
		value: 'Ordinary Drink',
        label:"Ordinary Drink"
	},
	{
		value: 'Cocktails',
        label:"Cocktails"
	},
	{
		value: 'Shake',
        label:"Shake"
	},
	{
		value: 'Other/Unknown',
        label:"Other/Unknown"
	},
	{
		value: 'Cocoa',
        label:"Cocoa"
	},
	{
		value: 'Shot',
        label:"Shot"
	},
	{
		value: 'Coffee / Tea',
        label:"Coffee/Tea"
	},
	{
		value: 'Homemade Liqueur',
        label:"Homemade Liquer"
	},
	{
		value: 'Punch / Party Drink',
        label:"Punch / Party Drink"
	},
	{
		value: 'Beers',
        label:"Beers"
	},
	{
		value: 'Soft Drink',
        label:"Soft Drink"
	},
];
     
 