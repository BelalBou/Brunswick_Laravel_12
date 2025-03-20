import React from "react";
import { styled } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";

const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)(({ theme }) => ({
  marginRight: theme.spacing(2)
}));

interface CartListItemProps {
  cart: ICart;
  userLanguage: string;
  onOpenEdit: (cart: ICart) => void;
}

const calculateTotalExtras = (extras: IExtra[]): number => {
  if (!extras || extras.length === 0) return 0;
  return extras.reduce((total: number, extra: IExtra) => total + parseFloat(extra.pricing), 0);
};

const CartListItem: React.FC<CartListItemProps> = ({
  cart,
  userLanguage,
  onOpenEdit
}): JSX.Element => {
  const menuPrice = cart.menu.pricing;
  const extrasPrice = calculateTotalExtras(cart.extras);
  const totalPricing = (cart.quantity * menuPrice + cart.quantity * extrasPrice).toFixed(2);

  return (
    <>
      <ListItemButton onClick={() => onOpenEdit(cart)}>
        <ListItemAvatar>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {cart.quantity}x
          </Typography>
        </ListItemAvatar>
        <ListItemText
          primary={userLanguage === "en" ? cart.menu.title : cart.menu.title}
          secondary={
            <>
              {cart.menu.menu_size
                ? userLanguage === "en"
                  ? cart.menu.menu_size.title_en
                  : cart.menu.menu_size.title
                : "/"}
              {cart.remark && (
                <>
                  <br />
                  {cart.remark}
                </>
              )}
            </>
          }
        />
        <StyledListItemSecondaryAction>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {parseFloat(totalPricing).toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </Typography>
        </StyledListItemSecondaryAction>
      </ListItemButton>
      <Divider />
    </>
  );
};

export default CartListItem;
