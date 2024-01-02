import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import HouseIcon from '@mui/icons-material/House';
import MessageIcon from '@mui/icons-material/Message';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';

const handleHouseClick = () => {
    // need to code the routing here
    console.log('Home icon clicked');
  };

const handleMessageClick = () => {
    // need to code the routing here
    console.log('Home icon clicked');
  };

const handleCalendarClick = () => {
    // need to code the routing here
    console.log('Home icon clicked');
  };

const handleSettingsClick = () => {
    // need to code the routing here
    console.log('Home icon clicked');
  };


function NavBar() {
  return (
    <AppBar position="fixed" style={{ top: 'auto', bottom: 0 }}>
      <Toolbar style={{ flexDirection: 'row' }}>
        <IconButton onClick={handleHouseClick} edge="start" >
          <HouseIcon />
        </IconButton>
        <IconButton onClick={handleMessageClick} color="inherit" aria-label="search">
          <MessageIcon />
        </IconButton>
        <IconButton onClick={handleCalendarClick} color="inherit" aria-label="account">
          <CalendarMonthIcon />
        </IconButton>
        <IconButton onClick={handleSettingsClick} color="inherit" aria-label="account">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;