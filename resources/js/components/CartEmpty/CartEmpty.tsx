import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import emptyCart from "../../images/empty-cart.svg";

const Container = styled('div')({
  display: "block",
  width: "100%"
});

const StyledImage = styled('img')(({ theme }) => ({
  width: "128px",
  paddingTop: theme.spacing(6)
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(4)
}));

const BodyTypography = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(2)
}));

interface CartEmptyProps {
  checkDictionnary: (tag: string) => string;
}

const CartEmpty: React.FC<CartEmptyProps> = ({ checkDictionnary }): JSX.Element => (
  <Container>
    <StyledImage src={emptyCart} alt="Empty cart" />
    <TitleTypography
      variant="h5"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      {checkDictionnary("_PANIER_VIDE")}
      <BodyTypography
        variant="body2"
        color="textSecondary"
        gutterBottom
        paragraph
      >
        {checkDictionnary("_SI_REMPLIR_PANIER")}
      </BodyTypography>
    </TitleTypography>
  </Container>
);

export default CartEmpty;
