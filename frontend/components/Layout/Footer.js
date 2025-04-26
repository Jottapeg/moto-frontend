import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#555555',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  display: 'block',
  marginBottom: theme.spacing(1),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: '#555555',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  marginRight: theme.spacing(1),
}));

const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Logo variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
              <DirectionsBikeIcon />
              MotoMarket
            </Logo>
            <Typography variant="body2" color="textSecondary" paragraph>
              A melhor plataforma para compra e venda de motos no Brasil. Conectamos compradores e vendedores de forma segura e eficiente.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SocialIcon aria-label="facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon aria-label="twitter">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon aria-label="youtube">
                <YouTubeIcon />
              </SocialIcon>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Navegação</FooterTitle>
            <FooterLink component={RouterLink} to="/comprar">Comprar</FooterLink>
            <FooterLink component={RouterLink} to="/vender">Vender</FooterLink>
            <FooterLink component={RouterLink} to="/financiamento">Financiamento</FooterLink>
            <FooterLink component={RouterLink} to="/tabela-fipe">Tabela FIPE</FooterLink>
            <FooterLink component={RouterLink} to="/blog">Blog</FooterLink>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Suporte</FooterTitle>
            <FooterLink component={RouterLink} to="/ajuda">Central de Ajuda</FooterLink>
            <FooterLink component={RouterLink} to="/contato">Contato</FooterLink>
            <FooterLink component={RouterLink} to="/dicas-seguranca">Dicas de Segurança</FooterLink>
            <FooterLink component={RouterLink} to="/politica-privacidade">Política de Privacidade</FooterLink>
            <FooterLink component={RouterLink} to="/termos-uso">Termos de Uso</FooterLink>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="subtitle1">Contato</FooterTitle>
            <Typography variant="body2" color="textSecondary" paragraph>
              Av. Paulista, 1000 - Bela Vista
              <br />
              São Paulo - SP, 01310-100
              <br />
              <br />
              <strong>Email:</strong> contato@motomarket.com.br
              <br />
              <strong>Telefone:</strong> (11) 3456-7890
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            &copy; {new Date().getFullYear()} MotoMarket. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
