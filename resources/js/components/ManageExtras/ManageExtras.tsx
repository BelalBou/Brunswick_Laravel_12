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
import AddExtra from "../AddExtra/AddExtra";
import EditExtra from "../EditExtra/EditExtra";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import TabContainer from "../TabContainer/TabContainer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISupplier from "../../interfaces/ISupplier";
import IExtra from "../../interfaces/IExtra";
import IMenuSize from "../../interfaces/IMenuSize";

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

interface ManageExtrasProps {
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

interface ManageExtrasState {
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

const ManageExtras: React.FC<ManageExtrasProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  extraList,
  supplierList,
  menuSizeList,
  userToken,
  userType,
  userLanguage,
  selected,
  actions
}) => {
  const [state, setState] = React.useState<ManageExtrasState>({
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
      actions.getExtrasSupplier(state.selectedSupplier);
      actions.getMenusSupplier(state.selectedSupplier);
    }
  }, [supplierList]);

  const refresh = () => {
    if (userType === "administrator") {
      actions.getDictionnaries();
      actions.getSuppliers();
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
    actions.getExtrasSupplier(value);
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

  const handleTableRows = () => {
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
                    handleOpenEdit(
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
                  onClick={() => handleOpenDelete(extra.id, extra.title)}
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
    pricing: number,
    menuSizeId: number
  ) => {
    setState(prev => ({
      ...prev,
      editId: id,
      editTitle: title,
      editTitleEn: titleEn,
      editPricing: pricing,
      editMenuSizeId: menuSizeId,
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
    pricing: number,
    menuSizeId: number
  ) => {
    const { selectedSupplier } = state;
    actions.addExtra(
      title,
      titleEn,
      pricing,
      selectedSupplier,
      menuSizeId
    );
    setState(prev => ({
      ...prev,
      openAdd: false,
      added: true
    }));
  };

  const handleEdit = (
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => {
    const { editId, selectedSupplier } = state;
    actions.editExtra(
      editId,
      title,
      titleEn,
      pricing,
      selectedSupplier,
      menuSizeId
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
      actions.deleteExtra(deleteId, selectedSupplier);
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
    editPricing,
    editMenuSizeId,
    deleteTitle,
    selectedSupplier
  } = state;

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title="Suppléments"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="Le supplément a bien été ajouté !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="Le supplément a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="Le supplément a bien été supprimé !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddExtra
          menuSizeList={menuSizeList}
          onClose={handleCloseAdd}
          onAdd={handleAdd}
        />
      )}
      {openEdit && (
        <EditExtra
          title={editTitle}
          titleEn={editTitleEn}
          pricing={editPricing}
          menuSizeId={editMenuSizeId}
          menuSizeList={menuSizeList}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer un supplément"
          description={`Le supplément « ${deleteTitle} » sera définitivement perdu !`}
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
                          { columnName: "title", direction: "asc" }
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

export default ManageExtras;
