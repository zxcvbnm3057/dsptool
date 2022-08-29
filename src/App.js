import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import Box from '@mui/material/Box';

import Requestions from './components/Requestions';

const App = () => {
  return (
    <Box height="100%" width="100%" bgcolor="#1e2938 !important"    >
      <AppBar position="static" sx={{ backgroundColor: "#4b4e56" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src={require('./logo_dsp.png')} alt="logo" style={{ height: 50 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                ml: 1,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              量化计算器
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Requestions />
    </Box>
  );
};
export default App;
