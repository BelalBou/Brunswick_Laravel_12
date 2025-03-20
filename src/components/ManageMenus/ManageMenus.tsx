import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import AddMenu from "../AddMenu/AddMenu";
import EditMenu from "../EditMenu/EditMenu";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import TabContainer from "../TabContainer/TabContainer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IAllergy from "../../interfaces/IAllergy";
import ICategory from "../../interfaces/ICategory";
import IMenuSize from "../../interfaces/IMenuSize";
import ISupplier from "../../interfaces/ISupplier";
import IMenu from "../../interfaces/IMenu";
import IExtra from "../../interfaces/IExtra";

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
    padding: theme.spacing.unit * 4
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
  supplierList: ISupplier[];
  menuList: IMenu[];
  categoryList: ICategory[];
  allergyList: IAllergy[];
  menuSizeList: IMenuSize[];
  extraList: IExtra[];
  userToken: string;
  userType: string;
  userSupplierId: number;
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
  editDescription: string;
  editDescriptionEn: string;
  editSizeId: number;
  editPricing: number;
  editCategoryId: number;
  editAllergyIds: number[];
  editExtraIds: number[];
  editPictureName: string;
  deleteId: number;
  deleteTitle: string;
  selectedSupplier: number;
}

class ManageMenus extends Component<IProvidedProps & IProps, IState> {
  state = {
    openAdd: false,
    openEdit: false,
    openDelete: false,
    added: false,
    edited: false,
    deleted: false,
    editId: -1,
    editTitle: "",
    editTitleEn: "",
    editDescription: "",
    editDescriptionEn: "",
    editSizeId: 0,
    editPricing: 0,
    editCategoryId: 1,
    editAllergyIds: [],
    editExtraIds: [],
    editPictureName: "",
    deleteId: -1,
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
        this.props.actions.getExtrasSupplier(selectedSupplier);
      }
    }
  }

  refresh = () => {
    const { userType } = this.props;
    if (userType === "administrator") {
      this.props.actions.getDictionnaries();
      this.props.actions.getSuppliers();
      this.props.actions.getAllergies();
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
    this.props.actions.getCategoriesSupplier(value);
    this.props.actions.getMenusSupplier(value);
    this.props.actions.getExtrasSupplier(value);
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
        name: "size",
        title: "Taille"
      },
      {
        name: "category",
        title: "Catégorie"
      },
      {
        name: "pricing",
        title: "Prix"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  handleTableRows = () => {
    const { menuList } = this.props;
    if (menuList && menuList.length > 0) {
      return menuList.map(menu => {
        const obj = {
          title: menu.title,
          titleEn: menu.title_en,
          description: menu.description,
          size: menu.MenuSize ? menu.MenuSize.title : "/",
          pricing: `${parseFloat(menu.pricing).toLocaleString("fr", {
            minimumFractionDigits: 2
          })} €`,
          category: menu.Category ? menu.Category.title : "/",
          action: (
            <>
              <Tooltip title="Éditer ce menu">
                <IconButton
                  color="primary"
                  onClick={() =>
                    this.handleOpenEdit(
                      menu.id,
                      menu.title,
                      menu.title_en,
                      menu.description,
                      menu.description_en,
                      menu.menu_size_id,
                      parseFloat(menu.pricing),
                      menu.category_id,
                      menu.Allergy,
                      menu.Extra,
                      menu.picture
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer ce menu">
                <IconButton
                  color="secondary"
                  onClick={() => this.handleOpenDelete(menu.id, menu.title)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )
        };
        return obj;
      });
    }
    return [];
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
    description: string,
    descriptionEn: string,
    sizeId: number,
    pricing: number,
    categoryId: number,
    allergies: IAllergy[],
    extras: IExtra[],
    picture: string
  ) => {
    this.setState({
      editId: id,
      editTitle: title,
      editTitleEn: titleEn,
      editDescription: description,
      editDescriptionEn: descriptionEn,
      editSizeId: sizeId,
      editPricing: pricing,
      editCategoryId: categoryId,
      editAllergyIds:
        allergies && allergies.length > 0
          ? allergies.map(allergy => allergy.id)
          : [],
      editExtraIds:
        extras && extras.length > 0 ? extras.map(extra => extra.id) : [],
      editPictureName: picture,
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
    sizeId: number,
    pricing: number,
    description: string,
    descriptionEn: string,
    categoryId: number,
    allergyIds: number[],
    extraIds: number[],
    picture: File | null,
    addPicture: boolean
  ) => {
    const { selectedSupplier } = this.state;
    if (categoryId > 0 && selectedSupplier > 0) {
      this.props.actions.addMenu(
        title,
        titleEn,
        sizeId,
        pricing,
        description,
        descriptionEn,
        categoryId,
        allergyIds,
        extraIds,
        picture,
        addPicture,
        selectedSupplier
      );
    }
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (
    title: string,
    titleEn: string,
    sizeId: number,
    pricing: number,
    description: string,
    descriptionEn: string,
    categoryId: number,
    allergyIds: number[],
    extraIds: number[],
    picture: File | null,
    editPicture: boolean
  ) => {
    const { editId, selectedSupplier } = this.state;
    this.props.actions.editMenu(
      editId,
      title,
      titleEn,
      sizeId,
      pricing,
      description,
      descriptionEn,
      categoryId,
      allergyIds,
      extraIds,
      picture,
      editPicture,
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
      this.props.actions.deleteMenu(deleteId, selectedSupplier);
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
      editDescription,
      editDescriptionEn,
      editSizeId,
      editPricing,
      editCategoryId,
      editAllergyIds,
      editExtraIds,
      editPictureName,
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
      classes,
      theme,
      supplierList,
      categoryList,
      allergyList,
      menuSizeList,
      extraList
    } = this.props;
    if (!isLoginSuccess || userType !== "administrator") {
      return <Redirect to="/login" />;
    }
    return (
      <MenuBar
        isLoginSuccess={isLoginSuccess}
        isListPending={isListPending}
        userType={userType}
        selected={selected}
        title="Menus"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="Le menu a bien été ajouté !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="Le menu a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="Le menu a bien été supprimé !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddMenu
            categoryList={categoryList}
            allergyList={allergyList}
            menuSizeList={menuSizeList}
            extraList={extraList}
            onClose={this.handleCloseAdd}
            onAdd={this.handleAdd}
          />
        )}
        {openEdit && (
          <EditMenu
            title={editTitle}
            titleEn={editTitleEn}
            description={editDescription}
            descriptionEn={editDescriptionEn}
            sizeId={editSizeId}
            pricing={editPricing}
            categoryId={editCategoryId}
            allergyIds={editAllergyIds}
            extraIds={editExtraIds}
            pictureName={editPictureName}
            categoryList={categoryList}
            allergyList={allergyList}
            menuSizeList={menuSizeList}
            extraList={extraList}
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer un menu"
            description={`Le menu « ${deleteTitle} » sera définitivement perdu !`}
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

export default withStyles(styles, { withTheme: true })(ManageMenus);
