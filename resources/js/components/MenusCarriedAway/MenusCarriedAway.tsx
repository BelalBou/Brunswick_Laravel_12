import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import MenusCarriedAwayFilter from "../MenusCarriedAwayFilter/MenusCarriedAwayFilter";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IMenuCarriedAway from "../../interfaces/IMenuCarriedAway";
import IMenu from "../../interfaces/IMenu";
import IOrder from "../../interfaces/IOrder";

const StyledMain = styled('main')({
  flex: 1
});

const StyledLayout = styled('div')({
  width: "auto",
  margin: "0 auto"
});

const StyledCardGrid = styled('div')(({ theme }) => ({
  padding: theme.spacing(4)
}));

const StyledHeroUnit = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

interface IProps {
  isLoginSuccess: boolean;
  isAddSuccess: boolean;
  isEditSuccess: boolean;
  isDeleteSuccess: boolean;
  isListPending: boolean;
  dictionnaryList: any[];
  orderList: IOrder[];
  userToken: string;
  userType: string;
  userLanguage: string;
  selected: number;
  actions: any;
}

const MenusCarriedAway: React.FC<IProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  orderList,
  userToken,
  userType,
  userLanguage,
  selected,
  actions
}) => {
  const [edited, setEdited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    if (isLoginSuccess) {
      refresh();
    }
    if (userType === "vendor") {
      handleChangeSelected(5);
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      refresh();
    }
  }, [userToken]);

  const refresh = () => {
    if (userType === "administrator" || userType === "vendor") {
      actions.getDictionnaries();
      actions.getOrdersForDate(selectedDate.format("YYYY-MM-DD"));
    }
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleChangeSelected = (selected: number) => {
    actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  const handleChangeArticleCarriedAway = (menu: IMenu, order: IOrder) => {
    const updatedMenu = {
      ...menu,
      order_menu: [{
        ...menu.order_menu[0],
        article_not_retrieved: !menu.order_menu[0].article_not_retrieved
      }]
    };
    actions.editArticleCarriedAway(
      order.id,
      menu.id,
      !menu.order_menu[0].article_not_retrieved,
      selectedDate.format("YYYY-MM-DD")
    );
    setEdited(true);
  };

  const handleCloseSnackbarEdited = () => {
    setEdited(false);
  };

  const getDictionaryValue = (tag: string) => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  const handleTableColumns = () => {
    return [
      {
        name: "not_retrieved",
        title: "Non récupéré"
      },
      {
        name: "client",
        title: "Client"
      },
      {
        name: "menu",
        title: "Menu"
      }
    ];
  };

  const handleTableRows = () => {
    const objArr: IMenuCarriedAway[] = [];
    if (orderList && orderList.length > 0) {
      orderList.map(order => {
        if (order.Menu && order.Menu.length > 0) {
          order.Menu.map((menu: IMenu) => {
            const obj = {
              not_retrieved: (
                <Checkbox
                  color="primary"
                  checked={menu.order_menu[0].article_not_retrieved}
                  onChange={() => handleChangeArticleCarriedAway(menu, order)}
                />
              ),
              client: `${
                order.User.first_name
              } ${order.User.last_name.toUpperCase()}`,
              menu: `${menu.title} (${menu.order_menu[0].quantity})`
            };
            objArr.push(obj);
          });
        }
      });
    }
    return objArr;
  };

  const handleChangeSelectedDate = (selectedDate: moment.Moment | null) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
      actions.getOrdersForDate(selectedDate.format("YYYY-MM-DD"));
    }
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title="Non-réception des commandes"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="Le menu a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      <StyledMain>
        <StyledLayout>
          <StyledCardGrid>
            <StyledHeroUnit>
              <MenusCarriedAwayFilter
                selectedDate={selectedDate}
                onChangeSelectedDate={handleChangeSelectedDate}
              />
              <Table
                rows={handleTableRows()}
                columns={handleTableColumns()}
                defaultSorting={[
                  { columnName: "client", direction: "asc" },
                  { columnName: "menu", direction: "asc" }
                ]}
              />
            </StyledHeroUnit>
          </StyledCardGrid>
        </StyledLayout>
      </StyledMain>
      <Footer />
    </MenuBar>
  );
};

export default MenusCarriedAway;
