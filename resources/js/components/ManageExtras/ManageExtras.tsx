import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import AddExtra from "../AddExtra/AddExtra";
import EditExtra from "../EditExtra/EditExtra";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import TabContainer from "../TabContainer/TabContainer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISupplier from "../../interfaces/ISupplier";
import IExtra from "../../interfaces/IExtra";
import IMenuSize from "../../interfaces/IMenuSize";

const styles = (theme: Theme) => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: ".625rem"
  },
  layout: {
    width: "auto",
    margin: "0 auto"
  },
  cardGrid: {
    padding: theme.spacing(4)
  },
  main: {
    flex: 1
  }
});

interface IProvidedProps {
  classes: any;
  theme: Theme;
}

interface IProps {
  isLoginSuccess: boolean;
  isAddSuccess: boolean;
  isEditSuccess: boolean;
  isDeleteSuccess: boolean;
  isListPending: boolean;
  dictionnaryList: any[];
  extraList: IExtra[];
  supplierList: ISupplier[];
  menuSizeList: IMenuSize[];
  userToken: string;
  userType: string;
  userLanguage: string;
  selected: number;
  actions: any;
}

interface IState {
  openAdd: boolean;
  openEdit: boolean;
  openDelete: boolean;
  added: boolean;
  edited: boolean;
  deleted: boolean;
  editId: number;
  editTitle: string;
  editTitleEn: string;
  editPricing: number;
  editMenuSizeId: number;
  deleteId: number;
  deleteTitle: string;
  selectedSupplier: number;
}

class ManageExtras extends Component<IProvidedProps & IProps, IState> {
  state = {
    openAdd: false,
    openEdit: false,
    openDelete: false,
    added: false,
    edited: false,
    deleted: false,
    editId: -1,
    deleteId: -1,
    editTitle: "",
    editTitleEn: "",
    editPricing: 0,
    editMenuSizeId: 0,
    deleteTitle: "",
    selectedSupplier: 1
  };

  componentDidMount() {
    const { isLoginSuccess } = this.props;
    if (isLoginSuccess) {
      this.refresh();
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const { userToken, supplierList } = this.props;
    const { selectedSupplier } = this.state;
    if (userToken !== prevProps.userToken) {
      this.refresh();
    }
    if (supplierList !== prevProps.supplierList) {
      if (supplierList && supplierList.length > 0) {
        this.props.actions.getExtrasSupplier(selectedSupplier);
        this.props.actions.getMenusSupplier(selectedSupplier);
      }
    }
  }

  refresh = () => {
    const { userType } = this.props;
    if (userType === "administrator") {
      this.props.actions.getDictionnaries();
      this.props.actions.getSuppliers();
      this.props.actions.getMenuSizes();
    }
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  handleChangeSupplier = (event: React.FormEvent<{}>, value: number) => {
    this.setState({ selectedSupplier: value });
    this.props.actions.getExtrasSupplier(value);
    this.props.actions.getMenusSupplier(value);
  };

  handleCloseSnackbarAdded = () => {
    this.setState({
      added: false
    });
  };

  handleCloseSnackbarEdited = () => {
    this.setState({
      edited: false
    });
  };

  handleCloseSnackbarDeleted = () => {
    this.setState({
      deleted: false
    });
  };

  checkDictionnary = (tag: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  handleTableColumns = () => {
    return [
      {
        name: "title",
        title: "Libellé FR"
      },
      {
        name: "titleEn",
        title: "Libellé EN"
      },
      {
        name: "pricing",
        title: "Prix"
      },
      {
        name: "menuSize",
        title: "Taille de menus"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  handleTableRows = () => {
    const { extraList } = this.props;
    if (extraList && extraList.length > 0) {
      return extraList.map(extra => {
        const obj = {
          title: extra.title,
          titleEn: extra.title_en,
          pricing: `${parseFloat(extra.pricing).toLocaleString("fr", {
            minimumFractionDigits: 2
          })} €`,
          menuSize: extra.MenuSize ? extra.MenuSize.title : "/",
          action: (
            <>
              <Tooltip title="Éditer ce supplément">
                <IconButton
                  color="primary"
                  onClick={() =>
                    this.handleOpenEdit(
                      extra.id,
                      extra.title,
                      extra.title_en,
                      parseFloat(extra.pricing),
                      extra.menu_size_id || 0
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer ce supplément">
                <IconButton
                  color="secondary"
                  onClick={() => this.handleOpenDelete(extra.id, extra.title)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )
        };
        return obj;
      });
    } else {
      return [];
    }
  };

  handleOpenAdd = () => {
    this.setState({
      openAdd: true
    });
  };

  handleOpenEdit = (
    id: number,
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => {
    this.setState({
      editId: id,
      editTitle: title,
      editTitleEn: titleEn,
      editPricing: pricing,
      editMenuSizeId: menuSizeId,
      openEdit: true
    });
  };

  handleOpenDelete = (id: number, title: string) => {
    this.setState({
      deleteId: id,
      deleteTitle: title,
      openDelete: true
    });
  };

  handleCloseAdd = () => {
    this.setState({
      openAdd: false
    });
  };

  handleCloseEdit = () => {
    this.setState({
      openEdit: false
    });
  };

  handleCloseDelete = () => {
    this.setState({
      openDelete: false
    });
  };

  handleAdd = (
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => {
    const { selectedSupplier } = this.state;
    this.props.actions.addExtra(
      title,
      titleEn,
      pricing,
      selectedSupplier,
      menuSizeId
    );
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => {
    const { editId, selectedSupplier } = this.state;
    this.props.actions.editExtra(
      editId,
      title,
      titleEn,
      pricing,
      selectedSupplier,
      menuSizeId
    );
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  handleDelete = () => {
    const { deleteId, selectedSupplier } = this.state;
    if (deleteId > 0) {
      this.props.actions.deleteExtra(deleteId, selectedSupplier);
      this.setState({
        openDelete: false,
        deleted: true
      });
    }
  };

  render() {
    const {
      openAdd,
      openEdit,
      openDelete,
      added,
      edited,
      deleted,
      editTitle,
      editTitleEn,
      editPricing,
      editMenuSizeId,
      deleteTitle,
      selectedSupplier
    } = this.state;
    const {
      isLoginSuccess,
      isListPending,
      isAddSuccess,
      isEditSuccess,
      isDeleteSuccess,
      userType,
      selected,
      supplierList,
      menuSizeList,
      classes,
      theme
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
        title="Suppléments"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="Le supplément a bien été ajouté !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="Le supplément a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="Le supplément a bien été supprimé !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddExtra
            menuSizeList={menuSizeList}
            onClose={this.handleCloseAdd}
            onAdd={this.handleAdd}
          />
        )}
        {openEdit && (
          <EditExtra
            title={editTitle}
            titleEn={editTitleEn}
            pricing={editPricing}
            menuSizeId={editMenuSizeId}
            menuSizeList={menuSizeList}
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer un supplément"
            description={`Le supplément « ${deleteTitle} » sera définitivement perdu !`}
            onClose={this.handleCloseDelete}
            onDelete={this.handleDelete}
            checkDictionnary={this.checkDictionnary}
          />
        )}
        <main className={classes.main}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <div className={classes.heroUnit}>
              <Tabs
                value={selectedSupplier}
                onChange={this.handleChangeSupplier}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                {supplierList.map(supplier => (
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
                    <TabContainer dir={theme.direction}>
                      <Table
                        add
                        rows={this.handleTableRows()}
                        columns={this.handleTableColumns()}
                        defaultSorting={[
                          { columnName: "title", direction: "asc" }
                        ]}
                        onAddedRowsChange={this.handleOpenAdd}
                      />
                    </TabContainer>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ManageExtras);
