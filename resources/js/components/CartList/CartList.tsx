import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import CartListItem from "../CartListItem/CartListItem";
import CartEmpty from "../CartEmpty/CartEmpty";
import ICart from "../../interfaces/ICart";

const StyledList = styled(List)({
  width: "100%"
});

interface CartListProps {
  cartList: ICart[];
  userLanguage: string;
  onOpenEdit: (cart: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const CartList: React.FC<CartListProps> = ({
  userLanguage,
  cartList,
  onOpenEdit,
  checkDictionnary
}): JSX.Element => (
  <>
    {cartList && cartList.length > 0 && (
      <StyledList>
        {cartList.map(cart => (
          <CartListItem
            key={cart.menu.id}
            cart={cart}
            userLanguage={userLanguage}
            onOpenEdit={onOpenEdit}
          />
        ))}
      </StyledList>
    )}
    {(!cartList || cartList.length === 0) && (
      <CartEmpty checkDictionnary={checkDictionnary} />
    )}
  </>
);

export default CartList;
