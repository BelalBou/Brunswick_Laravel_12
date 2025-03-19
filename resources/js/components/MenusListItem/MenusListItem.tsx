import React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) => ({
  img: {
    width: "96px",
    height: "96px",
    borderRadius: "3px"
  },
  typography: {
    marginTop: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  menu: IMenu;
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

const MenusListItem = ({
  menu,
  userLanguage,
  classes,
  onOpenAdd
}: IProvidedProps & IProps) => (
  <>
    <ListItem button onClick={() => onOpenAdd(menu)}>
      <ListItemText
        primary={
          <Typography variant="subtitle1" noWrap>
            {userLanguage === "en" ? menu.title_en : menu.title}
          </Typography>
        }
        secondary={
          <Typography
            color="textSecondary"
            noWrap
            className={classes.typography}
          >
            {userLanguage === "en" ? menu.description_en : menu.description}
          </Typography>
        }
      />
      <ListItemIcon>
        <img
          src={
            menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon
          }
          className={classes.img}
        />
      </ListItemIcon>
    </ListItem>
    <Divider />
  </>
);

export default withStyles(styles, { withTheme: true })(MenusListItem);
