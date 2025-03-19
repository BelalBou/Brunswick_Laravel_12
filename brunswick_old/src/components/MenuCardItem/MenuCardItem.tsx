import React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) =>
  createStyles({
    img: {
      width: "96px",
      height: "96px",
      borderRadius: "3px"
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
    body1: {
      wordWrap: "break-word"
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

const MenusCardItem = ({
  menu,
  userLanguage,
  classes,
  onOpenAdd
}: IProvidedProps & IProps) => (
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
              menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon
            }
            className={classes.img}
          />
        }
        title={
          <>
            <Typography variant="subtitle1" noWrap>
              {userLanguage === "en" ? menu.title_en : menu.title}
            </Typography>
          </>
        }
        subheader={
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.body1}
          >
            {userLanguage === "en" ? menu.description_en : menu.description}
          </Typography>
        }
      />
    </CardActionArea>
  </Card>
);

export default withStyles(styles, { withTheme: true })(MenusCardItem);
