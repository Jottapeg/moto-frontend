import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Container,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { Link as RouterLink } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ffffff',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
}));

const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: '#333333',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Comprar', path: '/comprar' },
    { text: 'Vender', path: '/vender' },
    { text: 'Financiamento', path: '/financiamento' },
    { text: 'Sobre', path: '/sobre' },
    { text: 'Contato', path: '/contato' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: theme.palette.primary.main, fontWeight: 700 }}>
        MotoMarket
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={RouterLink} 
            to={item.path} 
            key={item.text}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button component={RouterLink} to="/login">
          <ListItemText primary="Entrar" />
        </ListItem>
        <ListItem button component={RouterLink} to="/cadastro">
          <ListItemText primary="Cadastrar" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Logo variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none' }}>
              <DirectionsBikeIcon />
              MotoMarket
            </Logo>
            
            {!isMobile && (
              <Box sx={{ display: 'flex' }}>
                {menuItems.map((item) => (
                  <NavButton 
                    key={item.text} 
                    component={RouterLink} 
                    to={item.path}
                  >
                    {item.text}
                  </NavButton>
                ))}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <>
                  <NavButton component={RouterLink} to="/login">
                    Entrar
                  </NavButton>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={RouterLink} 
                    to="/cadastro"
                    sx={{ ml: 1 }}
                  >
                    Cadastrar
                  </Button>
                </>
              )}
              
              <IconButton
                color="primary"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem component={RouterLink} to="/perfil" onClick={handleProfileMenuClose}>Meu Perfil</MenuItem>
                <MenuItem component={RouterLink} to="/meus-anuncios" onClick={handleProfileMenuClose}>Meus Anúncios</MenuItem>
                <MenuItem component={RouterLink} to="/mensagens" onClick={handleProfileMenuClose}>Mensagens</MenuItem>
                <MenuItem component={RouterLink} to="/favoritos" onClick={handleProfileMenuClose}>Favoritos</MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>Sair</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
