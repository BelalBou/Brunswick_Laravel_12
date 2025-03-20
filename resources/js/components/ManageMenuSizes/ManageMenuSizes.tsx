import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import AddMenuSize from "../AddMenuSize/AddMenuSize";
import EditMenuSize from "../EditMenuSize/EditMenuSize";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IMenuSize from "../../interfaces/IMenuSize";
import IMenu from "../../interfaces/IMenu";

const StyledMain = styled('main')(({ theme }) => ({
  flex: 1
}));

const StyledLayout = styled('div')(({ theme }) => ({
  width: "auto",
  margin: "0 auto"
}));

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
  menuSizeList: IMenuSize[];
  menuList: IMenu[];
  userToken: string;
  userType: string;
  userLanguage: string;
  selected: number;
  actions: any;
}

const ManageMenuSizes: React.FC<IProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  menuSizeList,
  menuList,
  userToken,
  userType,
  userLanguage,
  selected,
  actions
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [added, setAdded] = useState(false);
  const [edited, setEdited] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [deleteId, setDeleteId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editTitleEn, setEditTitleEn] = useState("");
  const [deleteTitle, setDeleteTitle] = useState("");

  useEffect(() => {
    if (isLoginSuccess) {
      refresh();
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    refresh();
  }, [userToken]);

  const refresh = () => {
    if (userType === "administrator") {
      actions.getDictionnaries();
      actions.getMenuSizes();
      actions.getMenus();
    }
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleChangeSelected = (selected: number) => {
    actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  const handleCloseSnackbarAdded = () => {
    setAdded(false);
  };

  const handleCloseSnackbarEdited = () => {
    setEdited(false);
  };

  const handleCloseSnackbarDeleted = () => {
    setDeleted(false);
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
        name: "action",
        title: "Action"
      }
    ];
  };

  const handleTableRows = () => {
    if (menuSizeList && menuSizeList.length > 0) {
      return menuSizeList.map(menuSize => {
        const obj = {
          title: menuSize.title,
          titleEn: menuSize.title_en,
          action: (
            <>
              <Tooltip title="Éditer cette taille">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenEdit(
                      menuSize.id,
                      menuSize.title,
                      menuSize.title_en
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer cette taille">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    handleOpenDelete(menuSize.id, menuSize.title)
                  }
                  disabled={
                    menuList.filter(x => x.menu_size_id === menuSize.id)
                      .length > 0
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
    setOpenAdd(true);
  };

  const handleOpenEdit = (id: number, title: string, titleEn: string) => {
    setEditId(id);
    setEditTitle(title);
    setEditTitleEn(titleEn);
    setOpenEdit(true);
  };

  const handleOpenDelete = (id: number, title: string) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setOpenDelete(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleAdd = (title: string, titleEn: string) => {
    if (title) {
      actions.addMenuSize(title, titleEn);
    }
    setOpenAdd(false);
    setAdded(true);
  };

  const handleEdit = (title: string, titleEn: string) => {
    actions.editMenuSize(editId, title, titleEn);
    setOpenEdit(false);
    setEdited(true);
  };

  const handleDelete = () => {
    if (deleteId > 0) {
      actions.deleteMenuSize(deleteId);
      setOpenDelete(false);
      setDeleted(true);
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
      title="Tailles"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="La taille a bien été ajoutée !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="La taille a bien été modifiée !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="La taille a bien été supprimée !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddMenuSize onClose={handleCloseAdd} onAdd={handleAdd} />
      )}
      {openEdit && (
        <EditMenuSize
          title={editTitle}
          titleEn={editTitleEn}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer une taille"
          description={`La taille « ${deleteTitle} » sera définitivement perdue !`}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
          checkDictionnary={getDictionaryValue}
        />
      )}
      <StyledMain>
        <StyledLayout>
          <StyledCardGrid>
            <StyledHeroUnit>
              <Table
                add
                rows={handleTableRows()}
                columns={handleTableColumns()}
                defaultSorting={[{ columnName: "title", direction: "asc" }]}
                onAddedRowsChange={handleOpenAdd}
              />
            </StyledHeroUnit>
          </StyledCardGrid>
        </StyledLayout>
      </StyledMain>
      <Footer />
    </MenuBar>
  );
};

export default ManageMenuSizes;
