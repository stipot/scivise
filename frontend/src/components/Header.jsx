import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	Menu,
	MenuItem,
	IconButton,
	Box,
	Button,
} from '@mui/material'
import MenuIcon from './icons/MenuIcon'

function Header() {
	const [anchorElNav, setAnchorElNav] = useState(null)
	const navLinks = {
		// Лайки: 'likes',
		// Дизлайки: 'dislikes',
		// Избранное: 'favorites',
		Подборки: 'collections',
	}

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar
					disableGutters
					sx={{ display: 'flex', justifyContent: 'space-between' }}
				>
					<Link to="/" style={{ color: 'white' }}>
						<Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
							Scivise
						</Typography>
					</Link>
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={(e) => setAnchorElNav(e.currentTarget)}
							color="inherit"
						>
							<MenuIcon style={{ width: '30px', height: '30px' }} />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElNav)}
							onClose={() => setAnchorElNav(null)}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							{Object.keys(navLinks).map((link) => (
								<Link key={link} to={`/user/${navLinks[link]}`}>
									<MenuItem onClick={() => setAnchorElNav(null)}>
										<Typography sx={{ textAlign: 'center' }}>{link}</Typography>
									</MenuItem>
								</Link>
							))}
						</Menu>
					</Box>
					<Box
						sx={{
							display: { xs: 'none', md: 'flex' },
						}}
					>
						{Object.keys(navLinks).map((link) => (
							<Link key={link} to={`/user/${navLinks[link]}`}>
								<Button
									onClick={() => setAnchorElNav(null)}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									{link}
								</Button>
							</Link>
						))}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default Header
