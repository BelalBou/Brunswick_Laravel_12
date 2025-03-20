import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CartTableItem from "../CartTableItem/CartTableItem";
import CartEmpty from "../CartEmpty/CartEmpty";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";

interface IProps {
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

const CartTable = ({
  cartList,
  readOnly,
  userType,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  checkDictionnary
}: IProps) => (
  <>
    {cartList && cartList.length > 0 && (
      <Table>
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
      </Table>
    )}
    {(!cartList || cartList.length === 0) && (
      <CartEmpty checkDictionnary={checkDictionnary} />
    )}
  </>
);

export default CartTable;
