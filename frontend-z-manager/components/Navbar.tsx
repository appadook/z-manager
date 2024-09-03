'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';


const pages = ['Dashboard', 'Buckets', 'Planner'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Navbar() {
  
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  
  

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div className='m-10'>
    <AppBar position="static" 
    className="w-full shadow-lg rounded-lg h-24 justify-center flex text-3xl">
      <Container maxWidth="xl">
        <Toolbar disableGutters className='gap-5'>
          <AdbIcon className="hidden md:flex mr-2" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            className="mr-2 hidden md:flex font-mono font-bold tracking-wider text-white"
          >
            Z-MANAGER
          </Typography>

          <Box className="flex-grow flex md:hidden">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              className="block md:hidden"
            >
              {pages.map((page) => (
                <Link href={`/${page}`} key={page} passHref>
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                    
                        <Typography className='text-center'>{page}</Typography>
                    </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <AdbIcon className="flex md:hidden mr-2" />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            className="mr-2 flex md:hidden flex-grow font-mono font-bold tracking-wider text-white"
          >
            Z-MANAGER
          </Typography>
          <Box className="flex-grow hidden md:flex">
            {pages.map((page) => (
              <Link href={`/${page}`} key={page} passHref>
                <Button
                key={page}
                onClick={handleCloseNavMenu}
                className="my-2 text-white block hover:bg-gray-700 transition duration-300 ease-in-out"
                >
                    {page}
                </Button>
              </Link>
            ))}
          </Box>
          <Box className="flex-grow-0">
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} className="p-0">
                <Avatar alt="" src="/public/next.svg" />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              className="mt-11"
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography className="text-center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </div>
  );
}
