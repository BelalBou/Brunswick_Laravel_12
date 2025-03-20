import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ListSubheader from "@mui/material/ListSubheader";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import MenuCard from "../MenuCard/MenuCard";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import TabContainer from "../TabContainer/TabContainer";
import DetailsMenu from "../DetailsMenu/DetailsMenu";
import AddCart from "../AddCart/AddCart";
import MenusList from "../MenusList/MenusList";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ICategory from "../../interfaces/ICategory";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import ISupplier from "../../interfaces/ISupplier";
import emptyMenu from "../../images/menu.svg";
import axios from "axios";

const StyledMain = styled('main')({
  flex: 1
});

const StyledLayout = styled('div')({
  width: "auto",
  margin: "0 auto"
});

const StyledCardGrid = styled('div')(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4)
  }
}));

const StyledHeroUnit = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

const StyledListSubHeader = styled(ListSubheader)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(2)
}));

const StyledH5 = styled(Typography)({
  fontWeight: 600
});

const StyledSectionDesktop = styled('div')(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const StyledSectionMobile = styled('div')(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.up("md")]: {
    display: "none"
  }
}));

interface IProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userToken: string;
  userLanguage: string;
  userType: string;
  userValidity: string;
  selected: number;
  dictionnaryList: any[];
  supplierList: ISupplier[];
  categoryList: ICategory[];
  menuList: IMenu[];
  cartList: ICart[];
  orderListTotalCount: number;
  actions: any;
  match: any;
}

const Menus: React.FC<IProps> = ({
  isLoginSuccess,
  isListPending,
  userToken,
  userLanguage,
  userType,
  userValidity,
  selected,
  dictionnaryList,
  supplierList,
  categoryList,
  menuList,
  cartList,
  orderListTotalCount,
  actions,
  match
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState(1);
  const [shoppingCartOrdered, setShoppingCartOrdered] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState("");
  const [detailsSize, setDetailsSize] = useState("");
  const [detailsDescription, setDetailsDescription] = useState("");
  const [detailsAllergies, setDetailsAllergies] = useState<string[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [addMenu, setAddMenu] = useState<IMenu | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(tick, 60000);
    if (isLoginSuccess && userToken !== "") {
      refresh();
    }
    handleChangeSelected(1);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (userToken) {
      refresh();
    }
  }, [userToken]);

  useEffect(() => {
    if (supplierList && supplierList.length > 0) {
      actions.getCategoriesSupplier(supplierList[0].id);
      actions.getMenusSupplier(supplierList[0].id);
      setSelectedSupplier(supplierList[0].id);
    }
  }, [supplierList]);

  const tick = async () => {
    let res = await axios({
      method: "get",
      url: "/api/users/check_validity",
      withCredentials: true
    });
    let { data } = await res;
    let userValidity = data;
    if (userValidity === "not valid") {
      actions.logout();
    }
  };

  const refresh = () => {
    tick();
    const {
      getDictionnaries,
      getSuppliers,
      getOrdersTotalCountForCustomer
    } = actions;
    getDictionnaries();
    getSuppliers();
    getOrdersTotalCountForCustomer();
  };

  const handleChangeSelectedSupplier = (
    event: React.SyntheticEvent,
    value: number
  ) => {
    setSelectedSupplier(value);
    actions.getCategoriesSupplier(value);
    actions.getMenusSupplier(value);
  };

  const handleChangeSelected = (selected: number) => {
    actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleAddShoppingCart = (item: ICart) => {
    let shoppingCartCopy = [...cartList];
    let exist = shoppingCartCopy.filter(x => x.menu.id === item.menu.id);
    if (exist && exist.length > 0) {
      exist[0].quantity += item.quantity;
      shoppingCartCopy = shoppingCartCopy.filter(
        x => x.menu.id !== item.menu.id
      );
      shoppingCartCopy.push(exist[0]);
    } else {
      shoppingCartCopy.push(item);
    }
    actions.setCartList(shoppingCartCopy);
    localStorage.setItem("cartList", JSON.stringify(shoppingCartCopy));
    setRedirectTo("/cart/success");
  };

  const handleCloseSnackbarOrdered = () => {
    setShoppingCartOrdered(false);
  };

  const handleOpenDetails = (
    title: string,
    size: string,
    description: string,
    allergies: string[]
  ) => {
    setOpenDetails(true);
    setDetailsTitle(title);
    setDetailsSize(size);
    setDetailsDescription(description);
    setDetailsAllergies(allergies);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleOpenAdd = (menu: IMenu) => {
    setOpenAdd(true);
    setAddMenu(menu);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const getDictionaryValue = (tag: string) => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  const searchResults = menuList.filter(
    x =>
      x.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      x.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (x.menu_size
        ? x.menu_size.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.menu_size.title_en.toLowerCase().includes(searchTerm.toLowerCase())
        : false) ||
      x.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      x.description_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      x.category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      x.category.title_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }
  if (userType === "supplier") {
    return <Navigate to="/orders" replace />;
  }
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      cartItems={cartList ? cartList.length : 0}
      orderItems={orderListTotalCount || 0}
      selected={selected}
      search
      title="Menus"
      onLogout={handleLogout}
      onSearch={handleSearch}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {shoppingCartOrdered && match.params.id === "success" && (
        <SnackbarAction
          success
          message={getDictionaryValue("_COMMANDE_SUCCES")}
          onClose={handleCloseSnackbarOrdered}
        />
      )}
      {openDetails && (
        <DetailsMenu
          title={detailsTitle}
          size={detailsSize}
          description={detailsDescription}
          allergies={detailsAllergies}
          onClose={handleCloseDetails}
        />
      )}
      {openAdd && addMenu && (
        <AddCart
          menu={addMenu}
          menus={menuList.filter(x => x.title === addMenu.title)}
          userLanguage={userLanguage}
          onAdd={handleAddShoppingCart}
          onClose={handleCloseAdd}
          checkDictionnary={getDictionaryValue}
        />
      )}
      <StyledMain>
        <StyledLayout>
          <StyledCardGrid>
            <StyledHeroUnit>
              <Tabs
                value={selectedSupplier}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                onChange={handleChangeSelectedSupplier}
              >
                {supplierList
                  .filter(supplier =>
                    userType !== "vendor"
                      ? supplier.for_vendor_only !== true
                      : true
                  )
                  .map(supplier => (
                    <Tab
                      key={supplier.id}
                      label={supplier.name}
                      icon={<RestaurantIcon />}
                      value={supplier.id}
                    />
                  ))}
              </Tabs>
              {supplierList.map(supplier => (
                <React.Fragment key={supplier.id}>
                  {selectedSupplier === supplier.id && (
                    <TabContainer>
                      {searchTerm && searchTerm !== '' && searchResults.length === 0 && (
                        <div>
                          <br /><br />
                          <Typography
                            variant="h6"
                            align="left"
                            color="textPrimary"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            {getDictionaryValue("_NO_RESULTS_FOR_YOUR_SEARCH")} :
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            align="left"
                            color="textSecondary"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            <i>{searchTerm}</i>
                          </Typography>
                        </div>
                      )}

                      {categoryList.map(category => (
                        <React.Fragment key={category.id}>
                          {searchResults.filter(
                            menu => menu.category_id === category.id
                          ).length > 0 && (
                            <>
                              <StyledListSubHeader disableSticky>
                                <StyledH5 variant="h5">
                                  {userLanguage === "en"
                                    ? category.title_en
                                    : category.title}
                                </StyledH5>
                              </StyledListSubHeader>
                              <StyledSectionDesktop>
                                <MenuCard
                                  userLanguage={userLanguage}
                                  menuList={searchResults
                                    .filter(
                                      menu => menu.category_id === category.id
                                    )
                                    .sort((a, b) =>
                                      a.title.localeCompare(b.title)
                                    )}
                                  onOpenAdd={handleOpenAdd}
                                />
                              </StyledSectionDesktop>
                              <StyledSectionMobile>
                                <MenusList
                                  userLanguage={userLanguage}
                                  menuList={searchResults
                                    .filter(
                                      menu => menu.category_id === category.id
                                    )
                                    .sort((a, b) =>
                                      a.title.localeCompare(b.title)
                                    )}
                                  onOpenAdd={handleOpenAdd}
                                />
                              </StyledSectionMobile>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </TabContainer>
                  )}
                </React.Fragment>
              ))}
            </StyledHeroUnit>
          </StyledCardGrid>
        </StyledLayout>
      </StyledMain>
      <Footer />
    </MenuBar>
  );
};

export default Menus;
