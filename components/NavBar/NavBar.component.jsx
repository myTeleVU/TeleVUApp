import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import HouseIcon from '@mui/icons-material/House';
import MessageIcon from '@mui/icons-material/Message';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';




const handleHouseClick = () => {
    // need to code the routing here
    console.log('Home icon clicked');
  };

const handleMessageClick = () => {
    // need to code the routing here
    console.log('Message icon clicked');
  };

const handleCalendarClick = () => {
    // need to code the routing here
    console.log('Calendar icon clicked');
  };

const handleSettingsClick = () => {
    // need to code the routing here
    console.log('Settings icon clicked');
  };


function NavBar() {
  return (
    <Box >
      <Toolbar >
        <IconButton onClick={handleHouseClick} >
          <HouseIcon />
        </IconButton>
        <IconButton onClick={handleMessageClick} >
          <MessageIcon />
        </IconButton>
        <IconButton onClick={handleCalendarClick} >
          <CalendarMonthIcon />
        </IconButton>
        <IconButton onClick={handleSettingsClick} >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </Box>
  );
}

export default NavBar;