import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

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

const StyledBody1 = styled(Typography)({
  wordWrap: "break-word"
});

interface IProps {
  menu: IMenu;
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

const MenuCardItem: React.FC<IProps> = ({
  menu,
  userLanguage,
  onOpenAdd
}) => (
  <StyledCard raised>
    <CardActionArea onClick={() => onOpenAdd(menu)}>
      <StyledCardHeader
        action={
          <StyledImg
            src={
              menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon
            }
            alt={userLanguage === "en" ? menu.title_en : menu.title}
          />
        }
        title={
          <Typography variant="subtitle1" noWrap>
            {userLanguage === "en" ? menu.title_en : menu.title}
          </Typography>
        }
        subheader={
          <StyledBody1
            variant="body1"
            color="textSecondary"
          >
            {userLanguage === "en" ? menu.description_en : menu.description}
          </StyledBody1>
        }
      />
    </CardActionArea>
  </StyledCard>
);

export default MenuCardItem;
