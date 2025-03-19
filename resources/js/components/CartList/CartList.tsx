import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import CartListItem from "../CartListItem/CartListItem";
import CartEmpty from "../CartEmpty/CartEmpty";
import ICart from "../../interfaces/ICart";

const styles = () => ({
  list: {
    width: "100%"
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  cartList: ICart[];
  userLanguage: string;
  onOpenEdit: (cart: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const CartList = ({
  userLanguage,
  cartList,
  classes,
  onOpenEdit,
  checkDictionnary
}: IProvidedProps & IProps) => (
  <>
    {cartList && cartList.length > 0 && (
      <List className={classes.list}>
        {cartList.map(cart => (
          <CartListItem
            key={cart.menu.id}
            cart={cart}
            userLanguage={userLanguage}
            onOpenEdit={onOpenEdit}
          />
        ))}
      </List>
    )}
    {(!cartList || cartList.length === 0) && (
      <CartEmpty checkDictionnary={checkDictionnary} />
    )}
  </>
);

export default withStyles(styles, { withTheme: true })(CartList);
