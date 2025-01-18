import {useContext, useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';

import {AuthContext} from '../../context/AuthContext';
import {Avatar, Chip, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem} from '@mui/material';
import React from 'react';
import {Logout, Menu as MenuIcon} from '@mui/icons-material';
import AsideMenu from '../../components/aside-menu/AsideMenu';

function DashboardWrapper() {
	const {user, logoutCallback} = useContext(AuthContext);

	const [isDesktop, setDesktop] = useState(window.innerWidth > 1024);

	const updateMedia = () => {
		setDesktop(window.innerWidth > 1024);
	};

	useEffect(() => {
		window.addEventListener('resize', updateMedia);
		return () => window.removeEventListener('resize', updateMedia);
	});

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [openDrawer, setOpenDrawer] = useState(false);

	return (
		<div className="flex flex-row h-screen">
			{isDesktop ? (
				<div className="w-[433px]">
					<AsideMenu />
				</div>
			) : (
				<Drawer
					sx={{
						maxWidth: '90%',
						width: '433px',
						minHeight: 'max-content',
						height: '100%',
						flexShrink: 0,

						'& .MuiDrawer-paper': {
							maxWidth: '90%',
							width: '433px',
							minHeight: 'max-content',
							height: '100%',
							boxSizing: 'border-box',
							bgcolor: '#111827',
						},
					}}
					open={openDrawer}
					onClose={() => setOpenDrawer(false)}
				>
					<AsideMenu />
				</Drawer>
			)}
			<div className="flex flex-col items-center w-full bg-gray-100 text-black h-full overflow-y-scroll">
				<header className="flex flex-row items-center justify-between w-full h-20 min-h-20 px-7 py-1 shadow-sm">
					<div>
						{!isDesktop && (
							<IconButton size="large" onClick={() => setOpenDrawer(true)}>
								<MenuIcon />
							</IconButton>
						)}
					</div>
					<div className="hover:cursor-pointer" onClick={handleClick}>
						<Avatar sx={{width: 54, height: 54}}>
							{user?.firstName.charAt(0)} {user?.lastName.charAt(0)}
						</Avatar>
					</div>
					<Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose}>
						<div className="flex flex-col gap-2 px-6 py-4 min-w-72">
							<div>
								<div className="flex flex-row justify-between items-center gap-7">
									<div className="text-xl font-semibold">
										{user?.firstName} {user?.lastName}
									</div>

									{user?.isAdmin ? <Chip label="Admin" color="primary" /> : <Chip label="Standard" color="secondary" />}
								</div>
								<div className="text-lg ">{user?.email}</div>
							</div>

							<Divider />

							<MenuItem onClick={() => logoutCallback()}>
								<ListItemIcon>
									<Logout fontSize="small" />
								</ListItemIcon>
								Logout
							</MenuItem>
						</div>
					</Menu>
				</header>
				<main className="px-4 py-6 w-full overflow-y-scroll">
					<div className="max-w-[1440px] mx-auto">{<Outlet />}</div>
				</main>
			</div>
		</div>
	);
}

export default DashboardWrapper;
