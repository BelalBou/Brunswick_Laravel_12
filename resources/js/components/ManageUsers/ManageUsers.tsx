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
import AddUser from "../AddUser/AddUser";
import EditUser from "../EditUser/EditUser";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import userTypes from "../../utils/UserTypes/UserTypes";
import ISupplier from "../../interfaces/ISupplier";
import IUser from "../../interfaces/IUser";

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
  userList: IUser[];
  supplierList: ISupplier[];
  userToken: string;
  userType: string;
  userLanguage: string;
  userId: number;
  selected: number;
  actions: any;
}

const ManageUsers: React.FC<IProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  userList,
  supplierList,
  userToken,
  userType,
  userLanguage,
  userId,
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
  const [editLastName, setEditLastName] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editEmailAddress, setEditEmailAddress] = useState("");
  const [editType, setEditType] = useState("");
  const [editSupplierId, setEditSupplierId] = useState(1);
  const [editLanguage, setEditLanguage] = useState("fr");
  const [deleteLastName, setDeleteLastName] = useState("");
  const [deleteFirstName, setDeleteFirstName] = useState("");

  useEffect(() => {
    if (isLoginSuccess) {
      refresh();
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    refresh();
  }, [userToken]);

  const refresh = () => {
    actions.getDictionnaries();
    if (userType === "administrator") {
      actions.getUsers();
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
        name: "lastName",
        title: "Nom"
      },
      {
        name: "firstName",
        title: "Prénom"
      },
      {
        name: "emailAddress",
        title: "Adresse e-mail"
      },
      {
        name: "type",
        title: "Rôle"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  const handleTableRows = () => {
    if (userList && userList.length > 0) {
      return userList.map(user => {
        const obj = {
          lastName: user.last_name.toUpperCase(),
          firstName: user.first_name,
          emailAddress: user.email_address,
          type: userTypes.filter(x => x.value === user.type)[0].label,
          action: (
            <>
              <Tooltip title="Éditer cet utilisateur">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenEdit(
                      user.id,
                      user.last_name,
                      user.first_name,
                      user.email_address,
                      user.type,
                      user.supplier_id,
                      user.language
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer cet utilisateur">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    handleOpenDelete(
                      user.id,
                      user.last_name,
                      user.first_name
                    )
                  }
                  disabled={user.id === userId}
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

  const handleOpenEdit = (
    id: number,
    lastName: string,
    firstName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string
  ) => {
    setEditId(id);
    setEditLastName(lastName);
    setEditFirstName(firstName);
    setEditEmailAddress(emailAddress);
    setEditType(type);
    setEditSupplierId(supplierId);
    setEditLanguage(language);
    setOpenEdit(true);
  };

  const handleOpenDelete = (id: number, lastName: string, firstName: string) => {
    setDeleteId(id);
    setDeleteLastName(lastName);
    setDeleteFirstName(firstName);
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

  const handleAdd = (
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string
  ) => {
    actions.addUser(
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language
    );
    setOpenAdd(false);
    setAdded(true);
  };

  const handleEdit = (
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string,
    resetPassword: boolean
  ) => {
    if (editId > 0) {
      actions.editUser(
        editId,
        firstName,
        lastName,
        emailAddress,
        type,
        supplierId,
        language,
        resetPassword
      );
    }
    setOpenEdit(false);
    setEdited(true);
  };

  const handleDelete = () => {
    if (deleteId > 0) {
      actions.deleteUser(deleteId);
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
      title="Utilisateurs"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="L'utilisateur a bien été ajouté !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="L'utilisateur a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="L'utilisateur a bien été supprimé !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddUser
          supplierList={supplierList}
          onClose={handleCloseAdd}
          onAdd={handleAdd}
        />
      )}
      {openEdit && (
        <EditUser
          firstName={editFirstName}
          lastName={editLastName}
          emailAddress={editEmailAddress}
          type={editType}
          supplierId={editSupplierId}
          language={editLanguage}
          supplierList={supplierList}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer un utilisateur"
          description={`L'utilisateur « ${deleteLastName.toUpperCase()} ${deleteFirstName} » sera définitivement perdu !`}
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

export default ManageUsers;
