import './App.css';
import Navbar from './components/navbar/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/routes/Home';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import CategoriesPage from './components/routes/CategoriesPage';
import Search from './components/routes/Search';
import Login from './components/routes/Login';
import Favorites from './components/routes/Favorites';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/user/user.context';
import SpiritFacts from './components/routes/SpiritFacts';
import CreateDrink from './components/routes/CreateDrink';
import MuiSnackbar from './components/mui-components/snackbar/MuiSnackbar';

function App() {
	const { currentUser, snackbar,snackbarContent } = useContext(UserContext);
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<div className='App'>
				<Routes>
					<Route path='/' element={<Navbar />}>
						<Route
							index
							element={!currentUser ? <Navigate to='/login' /> : <Home />}
						/>
						<Route path='categories/:category' element={<CategoriesPage />} />
						<Route path='search' element={<Search />} />
						<Route path='login' element={<Login />} />
						<Route
							path='favorites'
							element={!currentUser ? <Navigate to='/login' /> : <Favorites />}
						/>
						<Route path='*' element={<Navigate to='/login' />} />
						<Route path='/spirits' element={<SpiritFacts />} />
						<Route path='/create' element={<CreateDrink />} />
					</Route>
				</Routes>
				
					 <MuiSnackbar open={snackbar} snackbarContent={snackbarContent}/>
				
			</div>
			<ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
		</QueryClientProvider>
	);
}

export default App;
