import React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";

const styles = (theme: Theme) => ({
  listItemSecondaryAction: {
    marginRight: theme.spacing.unit * 2
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  cart: ICart;
  userLanguage: string;
  onOpenEdit: (cart: ICart) => void;
}

function calculateTotalExtras(extras: IExtra[]) {
  let totalPricingArray = [];
  let totalPricing = 0;
  if (extras && extras.length > 0) {
    totalPricingArray = extras.map(extra => {
      return parseFloat(extra.pricing);
    });
    totalPricing = totalPricingArray.reduce((a: number, b: number) => a + b, 0);
  }
  return totalPricing;
}

function CartListItem({
  cart,
  userLanguage,
  classes,
  onOpenEdit
}: IProvidedProps & IProps) {
  const totalPricing =
    cart.quantity * parseFloat(cart.menu.pricing) +
    cart.quantity * calculateTotalExtras(cart.extras);
  return (
    <>
      <ListItem button onClick={() => onOpenEdit(cart)}>
        <ListItemAvatar>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {cart.quantity}x
          </Typography>
        </ListItemAvatar>
        <ListItemText
          primary={userLanguage === "en" ? cart.menu.title_en : cart.menu.title}
          secondary={
            <>
              {cart.menu.MenuSize
                ? userLanguage === "en"
                  ? cart.menu.MenuSize.title_en
                  : cart.menu.MenuSize.title
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
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
}

export default withStyles(styles, { withTheme: true })(CartListItem);
