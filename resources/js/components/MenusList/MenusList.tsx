import React, { Fragment } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import MenusListItem from "../MenusListItem/MenusListItem";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const StyledList = styled(List)({
  width: "100%"
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1)
}));

const StyledPriceTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 550
}));

const StyledImg = styled('img')({
  width: "96px",
  height: "96px",
  borderRadius: "3px"
});

interface IProps {
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

const MenusList: React.FC<IProps> = ({
  userLanguage,
  menuList,
  onOpenAdd
}) => (
  <StyledList>
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
                      {menu.menu_size && (
                        <StyledTypography color="textSecondary">
                          {userLanguage === "en"
                            ? menu.menu_size.title_en
                            : menu.menu_size.title}
                        </StyledTypography>
                      )}
                      <StyledTypography color="textSecondary" noWrap>
                        {menu.description ? (
                          <>
                            {menu.description}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                      </StyledTypography>
                      <StyledPriceTypography variant="subtitle1" color="primary">
                        {menu.pricing.toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })}{" "}
                        €
                      </StyledPriceTypography>
                    </>
                  }
                />
                <ListItemIcon>
                  <StyledImg
                    src={
                      menu.picture
                        ? `${S3_BASE_URL}/${menu.picture}`
                        : placeHolderIcon
                    }
                    alt={menu.title}
                  />
                </ListItemIcon>
              </ListItem>
              <Divider />
            </>
          )}
        </Fragment>
      ))}
  </StyledList>
);

export default MenusList;
