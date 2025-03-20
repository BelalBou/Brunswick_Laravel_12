import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import MenuCardItem from "../MenuCardItem/MenuCardItem";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const StyledGrid = styled(Grid)(({ theme }) => ({
  width: "100%",
  paddingLeft: theme.spacing(1)
}));

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  alignItems: "flex-start",
  "& .MuiCardHeader-content": {
    marginTop: `-${theme.spacing(1)}px`
  }
}));

const StyledImg = styled('img')({
  width: "96px",
  height: "96px",
  borderRadius: "3px"
});

const StyledSubtitle1 = styled(Typography)({
  fontWeight: 550
});

const StyledBody1 = styled(Typography)({
  wordWrap: "break-word"
});

interface IProps {
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

const MenuCard: React.FC<IProps> = ({
  userLanguage,
  menuList,
  onOpenAdd
}) => (
  <StyledGrid container spacing={2}>
    {menuList
      .filter((value, index, self) => self.map(x => x.title).indexOf(value.title) === index)
      .map(menu => (
        <Grid item xs={12} sm={6} md={4} key={menu.id}>
          {menuList.filter(x => x.title === menu.title).length > 1 && (
            <MenuCardItem
              menu={menu}
              userLanguage={userLanguage}
              menuList={menuList}
              onOpenAdd={onOpenAdd}
            />
          )}
          {menuList.filter(x => x.title === menu.title).length === 1 && (
            <StyledCard raised>
              <CardActionArea onClick={() => onOpenAdd(menu)}>
                <StyledCardHeader
                  action={
                    <StyledImg
                      src={
                        menu.picture
                          ? `${S3_BASE_URL}/${menu.picture}`
                          : placeHolderIcon
                      }
                      alt={userLanguage === "en" ? menu.title_en : menu.title}
                    />
                  }
                  title={
                    <Typography variant="subtitle1" color="textPrimary">
                      {userLanguage === "en" ? menu.title_en : menu.title}
                    </Typography>
                  }
                  subheader={
                    <>
                      {menu.menu_size && (
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          gutterBottom
                        >
                          {userLanguage === "en"
                            ? menu.menu_size.title_en
                            : menu.menu_size.title}
                        </Typography>
                      )}
                      <StyledBody1
                        variant="body1"
                        color="textSecondary"
                        gutterBottom
                      >
                        {userLanguage === "en"
                          ? menu.description_en
                          : menu.description}
                      </StyledBody1>
                      <StyledSubtitle1
                        variant="subtitle1"
                        color="primary"
                      >
                        {`${parseFloat(menu.pricing.toString()).toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })} €`}
                      </StyledSubtitle1>
                    </>
                  }
                />
              </CardActionArea>
            </StyledCard>
          )}
        </Grid>
      ))}
  </StyledGrid>
);

export default MenuCard;
