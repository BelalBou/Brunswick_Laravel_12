import React from "react";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

const StyledMain = styled("main")({
  flex: 1
});

const StyledLayout = styled("div")({
  width: "auto",
  margin: "0 auto"
});

const StyledCardGrid = styled("div")(({ theme }) => ({
  padding: theme.spacing(4)
}));

const StyledHeroUnit = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

interface ManageMenusProps {
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

interface ManageMenusState {
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

const ManageMenus: React.FC<ManageMenusProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  supplierList,
  menuList,
  categoryList,
  allergyList,
  menuSizeList,
  extraList,
  userToken,
  userType,
  userSupplierId,
  userLanguage,
  selected,
  actions
}) => {
  const [state, setState] = React.useState<ManageMenusState>({
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
  });

  React.useEffect(() => {
    if (isLoginSuccess) {
      refresh();
    }
  }, [isLoginSuccess]);

  React.useEffect(() => {
    refresh();
  }, [userToken]);

  React.useEffect(() => {
    if (supplierList && supplierList.length > 0) {
      actions.getCategoriesSupplier(state.selectedSupplier);
      actions.getMenusSupplier(state.selectedSupplier);
      actions.getExtrasSupplier(state.selectedSupplier);
    }
  }, [supplierList]);

  const refresh = () => {
    if (userType === "administrator") {
      actions.getDictionnaries();
      actions.getSuppliers();
      actions.getAllergies();
      actions.getMenuSizes();
    }
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleChangeSelected = (selected: number) => {
    actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  const handleChangeSupplier = (event: React.SyntheticEvent, value: number) => {
    setState(prev => ({
      ...prev,
      selectedSupplier: value
    }));
    actions.getCategoriesSupplier(value);
    actions.getMenusSupplier(value);
    actions.getExtrasSupplier(value);
  };

  const handleCloseSnackbarAdded = () => {
    setState(prev => ({
      ...prev,
      added: false
    }));
  };

  const handleCloseSnackbarEdited = () => {
    setState(prev => ({
      ...prev,
      edited: false
    }));
  };

  const handleCloseSnackbarDeleted = () => {
    setState(prev => ({
      ...prev,
      deleted: false
    }));
  };

  const getDictionaryValue = (tag: string) => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  const handleTableColumns = () => {
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

  const handleTableRows = () => {
    if (menuList && menuList.length > 0) {
      return menuList.map(menu => {
        const obj = {
          title: menu.title,
          titleEn: menu.title_en || "",
          description: menu.description,
          size: menu.menu_size ? menu.menu_size.title : "/",
          pricing: `${Number(menu.pricing).toLocaleString("fr", {
            minimumFractionDigits: 2
          })} €`,
          category: menu.category ? menu.category.title : "/",
          action: (
            <>
              <Tooltip title="Éditer ce menu">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenEdit(
                      menu.id,
                      menu.title,
                      menu.title_en || "",
                      menu.description,
                      menu.description_en || "",
                      menu.menu_size_id,
                      Number(menu.pricing),
                      menu.category_id,
                      menu.allergies || [],
                      menu.extras || [],
                      menu.picture || ""
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer ce menu">
                <IconButton
                  color="secondary"
                  onClick={() => handleOpenDelete(menu.id, menu.title)}
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

  const handleOpenAdd = () => {
    setState(prev => ({
      ...prev,
      openAdd: true
    }));
  };

  const handleOpenEdit = (
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
    setState(prev => ({
      ...prev,
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
    }));
  };

  const handleOpenDelete = (id: number, title: string) => {
    setState(prev => ({
      ...prev,
      deleteId: id,
      deleteTitle: title,
      openDelete: true
    }));
  };

  const handleCloseAdd = () => {
    setState(prev => ({
      ...prev,
      openAdd: false
    }));
  };

  const handleCloseEdit = () => {
    setState(prev => ({
      ...prev,
      openEdit: false
    }));
  };

  const handleCloseDelete = () => {
    setState(prev => ({
      ...prev,
      openDelete: false
    }));
  };

  const handleAdd = (
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
    const { selectedSupplier } = state;
    if (categoryId > 0 && selectedSupplier > 0) {
      actions.addMenu(
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
    setState(prev => ({
      ...prev,
      openAdd: false,
      added: true
    }));
  };

  const handleEdit = (
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
    const { editId, selectedSupplier } = state;
    actions.editMenu(
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
    setState(prev => ({
      ...prev,
      openEdit: false,
      edited: true
    }));
  };

  const handleDelete = () => {
    const { deleteId, selectedSupplier } = state;
    if (deleteId > 0) {
      actions.deleteMenu(deleteId, selectedSupplier);
      setState(prev => ({
        ...prev,
        openDelete: false,
        deleted: true
      }));
    }
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }

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
  } = state;

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title="Menus"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="Le menu a bien été ajouté !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="Le menu a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="Le menu a bien été supprimé !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddMenu
          categoryList={categoryList}
          allergyList={allergyList}
          menuSizeList={menuSizeList}
          extraList={extraList}
          onClose={handleCloseAdd}
          onAdd={handleAdd}
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
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer un menu"
          description={`Le menu « ${deleteTitle} » sera définitivement perdu !`}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
          checkDictionnary={getDictionaryValue}
        />
      )}
      <StyledMain>
        <StyledLayout>
          <StyledCardGrid>
            <StyledHeroUnit>
              <Tabs
                value={selectedSupplier}
                onChange={handleChangeSupplier}
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
                    <TabContainer>
                      <Table
                        add
                        rows={handleTableRows()}
                        columns={handleTableColumns()}
                        onAddedRowsChange={handleOpenAdd}
                      />
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

export default ManageMenus;
