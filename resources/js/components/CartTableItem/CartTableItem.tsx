import React, { useState, useCallback, useEffect } from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "@mui/icons-material/Info";
import CommentIcon from "@mui/icons-material/Comment";
import BugReportIcon from "@mui/icons-material/BugReport";
import WarningIcon from "@mui/icons-material/Warning";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import { debounce } from 'lodash';

const StyledTableCell = styled(TableCell)({
  border: 0
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const StyledBodyTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center"
}));

const StyledIcon = styled(InfoIcon)(({ theme }) => ({
  marginRight: theme.spacing(1)
}));

const StyledCommentIcon = styled(CommentIcon)({
  color: "rgba(0, 0, 0, 0.54)"
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface CartTableItemProps {
  item: ICart;
  readOnly: boolean;
  userType: string;
  userLanguage: string;
  onEditShoppingCart: (
    item: ICart,
    quantity: number,
    remark: string,
    extras: IExtra[]
  ) => void;
  onDeleteShoppingCart: (item: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const CartTableItem: React.FC<CartTableItemProps> = ({
  item,
  readOnly = false,
  userType,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  checkDictionnary
}): JSX.Element => {
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [remark, setRemark] = useState<string>(item.remark);
  const [expanded, setExpanded] = useState<boolean>(false);

  const emitChange = useCallback((value: string) => {
    onEditShoppingCart(item, quantity, value, []);
  }, [item, quantity, onEditShoppingCart]);

  const debouncedEmitChange = useCallback(
    debounce(emitChange, 500),
    [emitChange]
  );

  useEffect(() => {
    return () => {
      debouncedEmitChange.cancel();
    };
  }, [debouncedEmitChange]);

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    let qty = parseInt(value) > 9999 ? 9999 : parseInt(value);

    setQuantity(qty);

    if (qty > 0) {
      onEditShoppingCart(item, qty, remark, []);
    }
  };

  const handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newRemark = event.target.value;
    setRemark(newRemark);
    debouncedEmitChange(newRemark);
  };

  const handleChangeExpanded = (): void => {
    setExpanded(prev => !prev);
  };

  const handleDeleteShoppingCart = (): void => {
    onDeleteShoppingCart(item);
  };

  return (
    <>
      <TableRow>
        <StyledTableCell>
          <Typography variant="subtitle1">
            <IconButton onClick={handleChangeExpanded}>
              {!expanded && <KeyboardArrowDownIcon />}
              {expanded && <KeyboardArrowUpIcon />}
            </IconButton>{" "}
            {item.menu.title}
          </Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Typography variant="subtitle1">
            {item.menu.menu_size
              ? userLanguage === "en"
                ? item.menu.menu_size.title_en
                : item.menu.menu_size.title
              : "/"}
          </Typography>
        </StyledTableCell>
        {userType !== "supplier" && (
          <StyledTableCell align="right">
            <Typography variant="subtitle1">
              {`${item.menu.pricing.toLocaleString("fr", {
                minimumFractionDigits: 2
              })}`}{" "}
              €
            </Typography>
          </StyledTableCell>
        )}
        <StyledTableCell>
          <Input
            value={quantity}
            type="number"
            inputProps={{ min: "1", max: "9999", step: "1" }}
            disabled={readOnly}
            onChange={handleChangeQuantity}
          />
        </StyledTableCell>
        {userType !== "supplier" && (
          <StyledTableCell>
            <Tooltip title={checkDictionnary("_SUPPRIMER_CE_MENU")}>
              <StyledButton
                color="secondary"
                onClick={handleDeleteShoppingCart}
                disabled={readOnly}
              >
                {checkDictionnary("_SUPPRIMER")}
              </StyledButton>
            </Tooltip>
          </StyledTableCell>
        )}
      </TableRow>
      {item.extras && item.extras.length > 0 && (
        <TableRow>
          <StyledTableCell colSpan={5}>
            <List
              component="nav"
              subheader={
                <ListSubheader component="div">
                  {checkDictionnary("_SUPPLEMENTS")}
                </ListSubheader>
              }
            >
              {item.extras.map(extra => (
                <ListItem key={extra.id}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {`${
                          userLanguage === "en" ? extra.title_en : extra.title
                        } (+ ${(
                          parseFloat(extra.pricing) * quantity
                        ).toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })} €)
                      `}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </StyledTableCell>
        </TableRow>
      )}
      <TableRow>
        <StyledTableCell
          colSpan={5}
          align="center"
        >
          {item.menu.order_menu &&
            item.menu.order_menu[0]?.article_not_retrieved && (
              <StyledTypography
                variant="subtitle1"
                color="secondary"
                align="center"
              >
                <WarningIcon />{" "}
                {checkDictionnary("_ARTICLE_NON_RECUPERE")}
              </StyledTypography>
            )}
          <TextField
            id="outlined-full-width"
            placeholder={checkDictionnary("_REMARQUES")}
            fullWidth
            margin="normal"
            variant="outlined"
            value={remark}
            onChange={handleChangeRemark}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledCommentIcon />
                </InputAdornment>
              )
            }}
            disabled={readOnly}
          />
        </StyledTableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <StyledTableCell colSpan={5}>
            <List>
              {item.menu.description && (
                <ListItem>
                  <StyledBodyTypography
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                  >
                    <StyledIcon />
                    {item.menu.description}
                  </StyledBodyTypography>
                </ListItem>
              )}
            </List>
          </StyledTableCell>
        </TableRow>
      )}
    </>
  );
};

export default CartTableItem;
