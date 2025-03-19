import React, { Component } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import InfoIcon from "@material-ui/icons/Info";
import CommentIcon from "@material-ui/icons/Comment";
import BugReportIcon from "@material-ui/icons/BugReport";
import WarningIcon from "@material-ui/icons/Warning";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import { debounce } from 'lodash';

const styles = (theme: Theme) => ({
  body1: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing.unit
  },
  commentIcon: {
    color: "rgba(0, 0, 0, 0.54)"
  },
  button: {
    margin: theme.spacing.unit
  },
  tableCell: {
    border: 0
  },
  subtitle1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
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

interface IState {
  quantity: number;
  remark: string;
  expanded: boolean;
}

class CartTableItem extends Component<IProvidedProps & IProps, IState> {
  private emitChangeDebounced: any;

  constructor(props: IProvidedProps & IProps) {
    super(props);
    this.handleChangeRemark = this.handleChangeRemark.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 500);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  static defaultProps = {
    readOnly: false
  };

  state = {
    quantity: this.props.item.quantity,
    remark: this.props.item.remark,
    expanded: false
};

  handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const { remark } = this.state;

    let qty = 0;

    if (parseInt(value) > 9999) {
      qty=9999;
    } else {
      qty = parseInt(value);
    }

    this.setState({
      quantity: qty
    });

    const quantity = qty;
    const { item, onEditShoppingCart } = this.props;

    if (quantity > 0) {
      onEditShoppingCart(item, quantity, remark, []);
    }

  };

  handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>) => {
    const remark = event.target.value;
  
    this.setState({
      remark: remark
    });

    this.emitChangeDebounced(remark);
  };

  emitChange(value:any) { 
    const { quantity } = this.state;
    const { item, onEditShoppingCart } = this.props;
    const remark = value;
  
    onEditShoppingCart(item, quantity, remark, []); 
    //this.props.onChange(value);
  }
  
    handleChangeExpanded = () => {
    this.setState(state => {
      this.setState({
        expanded: !state.expanded
      });
    });
  };

  handleEditShoppingCart = () => {
    const { quantity, remark } = this.state;
    const { item, onEditShoppingCart } = this.props;
    if (quantity > 0) {
      onEditShoppingCart(item, quantity, remark, []);
    }
  };

  handleDeleteShoppingCart = () => {
    const { item, onDeleteShoppingCart } = this.props;
    onDeleteShoppingCart(item);
  };

  render() {
    const { quantity, remark, expanded } = this.state;
    const { item, readOnly, userType, userLanguage, classes } = this.props;
    return (
      <>
        <TableRow>
          <TableCell className={classes.tableCell}>
            <Typography variant="subtitle1">
              <IconButton onClick={this.handleChangeExpanded}>
                {!expanded && <KeyboardArrowDownIcon />}
                {expanded && <KeyboardArrowUpIcon />}
              </IconButton>{" "}
              {userLanguage === "en" ? item.menu.title_en : item.menu.title}
            </Typography>
          </TableCell>
          <TableCell className={classes.tableCell}>
            <Typography variant="subtitle1">
              {item.menu.MenuSize
                ? userLanguage === "en"
                  ? item.menu.MenuSize.title_en
                  : item.menu.MenuSize.title
                : "/"}
            </Typography>
          </TableCell>
          {userType !== "supplier" && (
            <TableCell align="right" className={classes.tableCell}>
              <Typography variant="subtitle1">
                {`${parseFloat(item.menu.pricing).toLocaleString("fr", {
                  minimumFractionDigits: 2
                })}`}{" "}
                €
              </Typography>
            </TableCell>
          )}
          <TableCell className={classes.tableCell}>
            <Input
              value={quantity}
              type="number"
              inputProps={{ min: "1", max: "9999", step: "1" }}
              disabled={readOnly}
              onChange={this.handleChangeQuantity}
            />
          </TableCell>
          {userType !== "supplier" && (
            <TableCell className={classes.tableCell}>
              <Tooltip
                title={this.props.checkDictionnary("_SUPPRIMER_CE_MENU")}
              >
                <Button
                  color="secondary"
                  className={classes.button}
                  onClick={this.handleDeleteShoppingCart}
                  disabled={readOnly}
                >
                  {this.props.checkDictionnary("_SUPPRIMER")}
                </Button>
              </Tooltip>
            </TableCell>
          )}
        </TableRow>
        {item.extras && item.extras.length > 0 && (
          <TableRow>
            <TableCell colSpan={5} className={classes.tableCell}>
              <List
                component="nav"
                subheader={
                  <ListSubheader component="div">
                    {this.props.checkDictionnary("_SUPPLEMENTS")}
                  </ListSubheader>
                }
              >
                {item.extras.map(extra => (
                  <ListItem key={extra.id} button>
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
            </TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell
            colSpan={5}
            className={expanded ? classes.tableCell : ""}
            align="center"
          >
            {item.menu.order_menus &&
              item.menu.order_menus.article_not_retrieved && (
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  align="center"
                  className={classes.subtitle1}
                >
                  <WarningIcon />{" "}
                  {this.props.checkDictionnary("_ARTICLE_NON_RECUPERE")}
                </Typography>
              )}
            <TextField
              id="outlined-full-width"
              placeholder={this.props.checkDictionnary("_REMARQUES")}
              fullWidth
              margin="normal"
              variant="outlined"
              value={remark}
              onChange={this.handleChangeRemark}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CommentIcon className={classes.commentIcon} />
                  </InputAdornment>
                )
              }}
              disabled={readOnly}
            />
          </TableCell>
        </TableRow>
        {expanded && (
          <TableRow>
            <TableCell colSpan={5}>
              <List>
                {item.menu.description && (
                  <ListItem>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      gutterBottom
                      className={classes.body1}
                    >
                      <InfoIcon className={classes.icon} />
                      {userLanguage === "en"
                        ? item.menu.description_en
                        : item.menu.description}
                    </Typography>
                  </ListItem>
                )}
                {item.menu.Allergy && item.menu.Allergy.length > 0 && (
                  <ListItem>
                    <Typography
                      variant="body1"
                      color="secondary"
                      gutterBottom
                      className={classes.body1}
                    >
                      <BugReportIcon
                        color="secondary"
                        className={classes.icon}
                      />
                      {item.menu.Allergy.map(allergy =>
                        userLanguage === "en"
                          ? allergy.description_en
                          : allergy.description
                      ).join(", ")}
                    </Typography>
                  </ListItem>
                )}
              </List>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
}

export default withStyles(styles)(CartTableItem);
