import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/user/user.context';
import { ReviewProvider } from './context/reviews/review.contex';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<UserProvider>
			<ReviewProvider>
				<App />
			</ReviewProvider>
		</UserProvider>
	</BrowserRouter>
);
