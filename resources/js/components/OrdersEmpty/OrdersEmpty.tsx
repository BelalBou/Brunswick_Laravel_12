import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import emptyCart from "../../images/empty-cart.svg";

const StyledDiv = styled('div')({
  textAlign: "center",
  display: "block",
  width: "100%"
});

const StyledH5 = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(4)
}));

const StyledImg = styled('img')(({ theme }) => ({
  width: "128px",
  paddingTop: theme.spacing(6)
}));

const StyledBody2 = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(2)
}));

interface IProps {
  checkDictionnary: (tag: string) => string;
}

const OrdersEmpty: React.FC<IProps> = ({ checkDictionnary }) => (
  <StyledDiv>
    <StyledImg src={emptyCart} alt="Panier vide" />
    <StyledH5
      variant="h5"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      {checkDictionnary("_COMMANDES_VIDE")}
      <StyledBody2
        variant="body2"
        color="textSecondary"
        gutterBottom
        paragraph
      >
        {checkDictionnary("_SI_PASSER_COMMANDE")}
      </StyledBody2>
    </StyledH5>
  </StyledDiv>
);

export default OrdersEmpty;
