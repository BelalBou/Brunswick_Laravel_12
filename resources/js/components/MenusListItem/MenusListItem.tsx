import React from "react";
import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1)
}));

const StyledImg = styled('img')({
  width: "96px",
  height: "96px",
  borderRadius: "3px"
});

interface IProps {
  menu: IMenu;
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

const MenusListItem: React.FC<IProps> = ({
  menu,
  userLanguage,
  onOpenAdd
}) => (
  <>
    <ListItem button onClick={() => onOpenAdd(menu)}>
      <ListItemText
        primary={
          <Typography variant="subtitle1" noWrap>
            {userLanguage === "en" ? menu.title_en : menu.title}
          </Typography>
        }
        secondary={
          <StyledTypography color="textSecondary" noWrap>
            {userLanguage === "en" ? menu.description_en : menu.description}
          </StyledTypography>
        }
      />
      <ListItemIcon>
        <StyledImg
          src={
            menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon
          }
          alt={userLanguage === "en" ? menu.title_en : menu.title}
        />
      </ListItemIcon>
    </ListItem>
    <Divider />
  </>
);

export default MenusListItem;
