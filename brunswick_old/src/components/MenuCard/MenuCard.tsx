import React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CardHeader from "@material-ui/core/CardHeader";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import MenuCardItem from "../MenuCardItem/MenuCardItem";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) =>
  createStyles({
    gridList: {
      width: "100%",
      paddingLeft: theme.spacing.unit
    },
    card: {
      margin: theme.spacing.unit
    },
    cardHeaderRoot: {
      paddingBottom: theme.spacing.unit,
      alignItems: "flex-start"
    },
    cardHeaderContent: {
      marginTop: `-${theme.spacing.unit}px`
    },
    img: {
      width: "96px",
      height: "96px",
      borderRadius: "3px"
    },
    subtitle1: {
      fontWeight: 550
    },
    body1: {
      wordWrap: "break-word"
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

const MenuCard = ({
  userLanguage,
  menuList,
  classes,
  onOpenAdd
}: IProvidedProps & IProps) => (
  <GridList cellHeight="auto" cols={3} className={classes.gridList}>
    {menuList
      .filter((value, index, self) => self.map(x => x.title).indexOf(value.title) == index)
      .map(menu => (
        <GridListTile key={menu.id}>
          {menuList.filter(x => x.title === menu.title).length > 1 && (
            <MenuCardItem
              menu={menu}
              userLanguage={userLanguage}
              menuList={menuList}
              onOpenAdd={onOpenAdd}
            />
          )}
          {menuList.filter(x => x.title === menu.title).length === 1 && (
            <Card className={classes.card} raised>
              <CardActionArea onClick={() => onOpenAdd(menu)}>
                <CardHeader
                  classes={{
                    root: classes.cardHeaderRoot,
                    content: classes.cardHeaderContent
                  }}
                  action={
                    <img
                      src={
                        menu.picture
                          ? `${S3_BASE_URL}/${menu.picture}`
                          : placeHolderIcon
                      }
                      className={classes.img}
                    />
                  }
                  title={
                    <Typography variant="subtitle1" color="textPrimary">
                      {userLanguage === "en" ? menu.title_en : menu.title}
                    </Typography>
                  }
                  subheader={
                    <>
                      {menu.MenuSize && (
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          gutterBottom
                        >
                          {userLanguage === "en"
                            ? menu.MenuSize.title_en
                            : menu.MenuSize.title}
                        </Typography>
                      )}
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        gutterBottom
                        className={classes.body1}
                      >
                        {userLanguage === "en"
                          ? menu.description_en
                          : menu.description}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        className={classes.subtitle1}
                      >
                        {`${parseFloat(menu.pricing).toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })} €`}
                      </Typography>
                    </>
                  }
                />
              </CardActionArea>
            </Card>
          )}
        </GridListTile>
      ))}
  </GridList>
);

export default withStyles(styles, { withTheme: true })(MenuCard);
