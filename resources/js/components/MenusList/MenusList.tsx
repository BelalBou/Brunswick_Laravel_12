import React, { Fragment } from "react";
import classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import MenusListItem from "../MenusListItem/MenusListItem";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) => ({
  list: {
    width: "100%"
  },
  margin: {
    marginTop: theme.spacing.unit
  },
  img: {
    width: "96px",
    height: "96px",
    borderRadius: "3px"
  },
  subtitle1: {
    fontWeight: 550
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

const MenusList = ({
  userLanguage,
  menuList,
  classes,
  onOpenAdd
}: IProvidedProps & IProps) => (
  <List className={classes.list}>
    {menuList
      .filter(menu =>
        menu.menu_size_id
          ? menu.menu_size_id === menuList[0].menu_size_id
          : true
      )
      .map(menu => (
        <Fragment key={menu.id}>
          {menuList.filter(x => x.title === menu.title).length > 1 && (
            <MenusListItem
              menu={menu}
              userLanguage={userLanguage}
              menuList={menuList}
              onOpenAdd={onOpenAdd}
            />
          )}
          {menuList.filter(x => x.title === menu.title).length === 1 && (
            <>
              <ListItem button onClick={() => onOpenAdd(menu)}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" noWrap>
                      {menu.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      {menu.MenuSize && (
                        <Typography
                          color="textSecondary"
                          className={classes.margin}
                        >
                          {userLanguage === "en"
                            ? menu.MenuSize.title_en
                            : menu.MenuSize.title}
                        </Typography>
                      )}
                      <Typography
                        color="textSecondary"
                        className={classes.margin}
                        noWrap
                      >
                        {menu.description ? (
                          <>
                            {menu.description}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        className={classNames(
                          classes.subtitle1,
                          classes.margin
                        )}
                      >
                        {parseFloat(menu.pricing).toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })}{" "}
                        €
                      </Typography>
                    </>
                  }
                />
                <ListItemIcon>
                  <img
                    src={
                      menu.picture
                        ? `${S3_BASE_URL}/${menu.picture}`
                        : placeHolderIcon
                    }
                    className={classes.img}
                  />
                </ListItemIcon>
              </ListItem>
              <Divider />
            </>
          )}
        </Fragment>
      ))}
  </List>
);

export default withStyles(styles, { withTheme: true })(MenusList);
