import styled from 'styled-components';
import { ReactComponent as MartiniLogo } from '../../assets/martini.svg';
import { motion } from 'framer-motion';
import { useState, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import DrinkSearch from '../react-select/DrinkSearch';
import MuiDrawer from '../mui-components/MuiDrawer';
import { UserContext } from '../../context/user/user.context';
import { signOutUser } from '../../utilities/firebase/firebase.utils';

const Navbar = () => {
	const { currentUser } = useContext(UserContext);

	return (
		<div>
			<NavbarContainer>
				<div className='container'>
					<motion.div
						animate={{ rotate: [0, 360, 0, 360], x: [0, 150, 0, 150, 0] }}
						transition={{ repeat: 2, duration: 2 }}
					>
						<Logo />
					</motion.div>
					<div>Drink Maker</div>
					<DrinkSearch />
					<ul className='nav'>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/search'>Detailed Search</Link>
						</li>
						<li>
							{currentUser ? (
								<Link onClick={signOutUser}>Sign Out</Link>
							) : (
								<Link to='/login'>Login</Link>
							)}
						</li>
				
					</ul>
					<MuiDrawer />
				</div>
			</NavbarContainer>
			<Outlet />
		</div>
	);
};

export default Navbar;

const NavbarContainer = styled.div`
	background-image: linear-gradient(to right, #141e30, #243b55);
	color: #fff;
	height: 80px;

	.container {
		display: flex;
		align-items: center;
		margin: 0 auto;
		padding: 0 20px;
		justify-content: space-between;
	}
	ul li {
		margin-left: 20px;
	}
	ul {
		display: flex;
		list-style-type: none;
	}
	li {
		margin-left: 20px;
	}
	a {
		color: #fff;
		text-decoration: none;
		font-size: 18px;
	}
`;

const Logo = styled(MartiniLogo)`
	width: 120px;
	height: 75px;
`;
