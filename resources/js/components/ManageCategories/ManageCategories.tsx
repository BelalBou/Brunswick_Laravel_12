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
import AddCategory from "../AddCategory/AddCategory";
import EditCategory from "../EditCategory/EditCategory";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import TabContainer from "../TabContainer/TabContainer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ICategory from "../../interfaces/ICategory";
import IMenu from "../../interfaces/IMenu";
import ISupplier from "../../interfaces/ISupplier";

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
  categoryList: ICategory[];
  supplierList: ISupplier[];
  menuList: IMenu[];
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
  deleteId: number;
  editTitle: string;
  editTitleEn: string;
  deleteTitle: string;
  editOrder: number;
  selectedSupplier: number;
}

class ManageCategories extends Component<IProvidedProps & IProps, IState> {
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
    editOrder: 10,
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
        this.props.actions.getCategoriesSupplier(selectedSupplier);
        this.props.actions.getMenusSupplier(selectedSupplier);
      }
    }
  }

  refresh = () => {
    const { userType } = this.props;
    if (userType === "administrator") {
      this.props.actions.getDictionnaries();
      this.props.actions.getSuppliers();
    }
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  handleChangeSupplier = (event: React.ChangeEvent<{}>, value: number) => {
    this.setState({ selectedSupplier: value });
    this.props.actions.getCategoriesSupplier(value);
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
        name: "order",
        title: "Ordre"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  handleTableRows = () => {
    const { categoryList, menuList } = this.props;
    if (categoryList && categoryList.length > 0) {
      return categoryList.map(category => {
        const obj = {
          title: category.title,
          titleEn: category.title_en,
          order: category.order,
          action: (
            <>
              <Tooltip title="Éditer cette catégorie">
                <IconButton
                  color="primary"
                  onClick={() =>
                    this.handleOpenEdit(
                      category.id,
                      category.title,
                      category.title_en,
                      category.order
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer cette catégorie">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    this.handleOpenDelete(category.id, category.title)
                  }
                  disabled={
                    menuList.filter(x => x.category_id === category.id).length >
                    0
                  }
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
    order: number
  ) => {
    this.setState({
      editId: id,
      editTitle: title,
      editTitleEn: titleEn,
      editOrder: order,
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

  handleAdd = (title: string, titleEn: string, order: number) => {
    const { selectedSupplier } = this.state;
    this.props.actions.addCategory(title, titleEn, order, selectedSupplier);
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (title: string, titleEn: string, order: number) => {
    const { editId, selectedSupplier } = this.state;
    this.props.actions.editCategory(
      editId,
      title,
      titleEn,
      order,
      selectedSupplier
    );
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  handleDelete = () => {
    const { deleteId, selectedSupplier } = this.state;
    if (deleteId > 0) {
      this.props.actions.deleteCategory(deleteId, selectedSupplier);
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
      editOrder,
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
        title="Catégories"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="La catégorie a bien été ajoutée !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="La catégorie a bien été modifiée !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="La catégorie a bien été supprimée !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddCategory
            supplierList={supplierList}
            onClose={this.handleCloseAdd}
            onAdd={this.handleAdd}
          />
        )}
        {openEdit && (
          <EditCategory
            title={editTitle}
            titleEn={editTitleEn}
            order={editOrder}
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer une catégorie"
            description={`La catégorie « ${deleteTitle} » sera définitivement perdue !`}
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
                          { columnName: "order", direction: "asc" }
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

export default withStyles(styles, { withTheme: true })(ManageCategories);
