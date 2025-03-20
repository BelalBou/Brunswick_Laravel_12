import React from "react";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantIcon from "@mui/icons-material/Restaurant";
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

interface ManageCategoriesProps {
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

interface ManageCategoriesState {
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

const ManageCategories: React.FC<ManageCategoriesProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  categoryList,
  supplierList,
  menuList,
  userToken,
  userType,
  userLanguage,
  selected,
  actions
}) => {
  const [state, setState] = React.useState<ManageCategoriesState>({
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
    }
  }, [supplierList]);

  const refresh = () => {
    if (userType === "administrator") {
      actions.getDictionnaries();
      actions.getSuppliers();
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
        name: "order",
        title: "Ordre"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  const handleTableRows = () => {
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
                    handleOpenEdit(
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
                    handleOpenDelete(category.id, category.title)
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
    order: number
  ) => {
    setState(prev => ({
      ...prev,
      editId: id,
      editTitle: title,
      editTitleEn: titleEn,
      editOrder: order,
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

  const handleAdd = (title: string, titleEn: string, order: number) => {
    const { selectedSupplier } = state;
    actions.addCategory(title, titleEn, order, selectedSupplier);
    setState(prev => ({
      ...prev,
      openAdd: false,
      added: true
    }));
  };

  const handleEdit = (title: string, titleEn: string, order: number) => {
    const { editId, selectedSupplier } = state;
    actions.editCategory(
      editId,
      title,
      titleEn,
      order,
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
      actions.deleteCategory(deleteId, selectedSupplier);
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
    editOrder,
    deleteTitle,
    selectedSupplier
  } = state;

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title="Catégories"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="La catégorie a bien été ajoutée !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="La catégorie a bien été modifiée !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="La catégorie a bien été supprimée !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddCategory
          supplierList={supplierList}
          onClose={handleCloseAdd}
          onAdd={handleAdd}
        />
      )}
      {openEdit && (
        <EditCategory
          title={editTitle}
          titleEn={editTitleEn}
          order={editOrder}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer une catégorie"
          description={`La catégorie « ${deleteTitle} » sera définitivement perdue !`}
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
                        defaultSorting={[
                          { columnName: "order", direction: "asc" }
                        ]}
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

export default ManageCategories;
