import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CartTableItem from "../CartTableItem/CartTableItem";
import CartEmpty from "../CartEmpty/CartEmpty";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";

const StyledTable = styled(Table)({
  width: "100%"
});

interface CartTableProps {
  cartList: ICart[];
  readOnly: boolean;
  userType: string;
  userLanguage: string;
  onEditShoppingCart: (
    cart: ICart,
    quantity: number,
    remark: string,
    extras: IExtra[]
  ) => void;
  onDeleteShoppingCart: (cart: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const CartTable: React.FC<CartTableProps> = ({
  cartList,
  readOnly,
  userType,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  checkDictionnary
}): JSX.Element => (
  <>
    {cartList && cartList.length > 0 && (
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>Menu</TableCell>
            <TableCell>{checkDictionnary("_TAILLE")}</TableCell>
            {userType !== "supplier" && (
              <TableCell align="right">{checkDictionnary("_PRIX")}</TableCell>
            )}
            <TableCell>{checkDictionnary("_QUANTITE")}</TableCell>
            {userType !== "supplier" && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {cartList.map(cart => (
            <CartTableItem
              key={cart.menu.id}
              item={cart}
              readOnly={readOnly}
              userType={userType}
              userLanguage={userLanguage}
              onEditShoppingCart={onEditShoppingCart}
              onDeleteShoppingCart={onDeleteShoppingCart}
              checkDictionnary={checkDictionnary}
            />
          ))}
        </TableBody>
      </StyledTable>
    )}
    {(!cartList || cartList.length === 0) && (
      <CartEmpty checkDictionnary={checkDictionnary} />
    )}
  </>
);

export default CartTable;
