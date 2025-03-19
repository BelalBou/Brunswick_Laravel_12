import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import classNames from "classnames";
import moment from "moment";
import { withStyles, Theme } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import MenusCarriedAwayFilter from "../MenusCarriedAwayFilter/MenusCarriedAwayFilter";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IMenuCarriedAway from "../../interfaces/IMenuCarriedAway";
import IMenu from "../../interfaces/IMenu";
import IOrder from "../../interfaces/IOrder";

const styles = (theme: Theme) => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: ".625rem"
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  layout: {
    width: "auto",
    margin: "0 auto"
  },
  cardGrid: {
    padding: theme.spacing.unit * 4
  },
  main: {
    flex: 1
  }
});

interface IProvidedProps {
  classes: any;
}

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

interface IState {
  edited: boolean;
  selectedDate: moment.Moment;
}

class MenusCarriedAway extends Component<IProvidedProps & IProps, IState> {
  state = {
    edited: false,
    selectedDate: moment()
  };

  componentDidMount() {
    const { isLoginSuccess, userType } = this.props;
    if (isLoginSuccess) {
      this.refresh();
    }
    if (userType === "vendor") {
      this.handleChangeSelected(5);
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const { userToken } = this.props;
    if (userToken !== prevProps.userToken) {
      this.refresh();
    }
  }

  refresh = () => {
    const { selectedDate } = this.state;
    const { userType } = this.props;
    if (userType === "administrator" || userType === "vendor") {
      this.props.actions.getDictionnaries();
      this.props.actions.getOrdersForDate(selectedDate.format("YYYY-MM-DD"));
    }
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  handleChangeArticleCarriedAway = (
    event: React.ChangeEvent<HTMLInputElement>,
    orderId: number,
    menuId: number
  ) => {
    const { selectedDate } = this.state;
    const { checked } = event.target;
    this.props.actions.editArticleCarriedAway(
      orderId,
      menuId,
      checked,
      selectedDate.format("YYYY-MM-DD")
    );
    this.setState({
      edited: true
    });
  };

  handleCloseSnackbarEdited = () => {
    this.setState({
      edited: false
    });
  };

  checkDictionnary = (tag: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  handleTableColumns = () => {
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

  handleTableRows = () => {
    const { orderList } = this.props;
    const objArr: IMenuCarriedAway[] = [];
    if (orderList && orderList.length > 0) {
      orderList.map(order => {
        if (order.Menu && order.Menu.length > 0) {
          order.Menu.map((menu: IMenu) => {
            const obj = {
              not_retrieved: (
                <Checkbox
                  color="secondary"
                  checked={menu.order_menus.article_not_retrieved}
                  onChange={event =>
                    this.handleChangeArticleCarriedAway(
                      event,
                      order.id,
                      menu.id
                    )
                  }
                />
              ),
              client: `${
                order.User.first_name
              } ${order.User.last_name.toUpperCase()}`,
              menu: `${
                menu.order_menus.quantity > 1
                  ? `${menu.order_menus.quantity}x`
                  : ""
              } ${menu.MenuSize ? menu.MenuSize.title : ""} ${menu.title}`
            };
            objArr.push(obj);
          });
        }
      });
    }
    return objArr;
  };

  handleChangeSelectedDate = (selectedDate: moment.Moment) => {
    this.setState({ selectedDate });
    this.props.actions.getOrdersForDate(selectedDate.format("YYYY-MM-DD"));
  };

  render() {
    const { selectedDate, edited } = this.state;
    const {
      isLoginSuccess,
      isListPending,
      isEditSuccess,
      userType,
      selected,
      classes
    } = this.props;
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
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="Le menu a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        <main className={classes.main}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <div className={classes.heroUnit}>
              <MenusCarriedAwayFilter
                selectedDate={selectedDate}
                onChangeSelectedDate={this.handleChangeSelectedDate}
              />
              <Table
                rows={this.handleTableRows()}
                columns={this.handleTableColumns()}
                defaultSorting={[
                  { columnName: "client", direction: "asc" },
                  { columnName: "menu", direction: "asc" }
                ]}
              />
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MenusCarriedAway);
