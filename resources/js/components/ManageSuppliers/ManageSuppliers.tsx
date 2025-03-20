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
import AddSupplier from "../AddSupplier/AddSupplier";
import EditSupplier from "../EditSupplier/EditSupplier";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISupplier from "../../interfaces/ISupplier";
import moment from "moment";

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
  supplierList: ISupplier[];
  userToken: string;
  userType: string;
  userLanguage: string;
  selected: number;
  actions: any;
}

const ManageSuppliers: React.FC<IProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  supplierList,
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
  const [editName, setEditName] = useState("");
  const [editEmailAddress, setEditEmailAddress] = useState("");
  const [editEmailAddress2, setEditEmailAddress2] = useState("");
  const [editEmailAddress3, setEditEmailAddress3] = useState("");
  const [editForVendorOnly, setEditForVendorOnly] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [awayStart, setAwayStart] = useState(moment());
  const [awayEnd, setAwayEnd] = useState(moment());

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
      actions.getSuppliersAdmin();
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
        name: "name",
        title: "Nom"
      },
      {
        name: "emailAddress",
        title: "Adresse e-mail"
      },
      {
        name: "emailAddress2",
        title: "Adresse e-mail"
      },
      {
        name: "emailAddress3",
        title: "Adresse e-mail"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  const handleTableRows = () => {
    if (supplierList && supplierList.length > 0) {
      return supplierList.map(supplier => {
        const obj = {
          name: supplier.name,
          emailAddress: supplier.email_address,
          emailAddress2: supplier.email_address2,
          emailAddress3: supplier.email_address3,
          action: (
            <>
              <Tooltip title="Éditer ce fournisseur">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenEdit(
                      supplier.id,
                      supplier.name,
                      supplier.email_address,
                      supplier.email_address2,
                      supplier.email_address3,
                      supplier.for_vendor_only,
                      supplier.away_start,
                      supplier.away_end
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer ce fournisseur">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    handleOpenDelete(supplier.id, supplier.name)
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

  const handleOpenEdit = (
    id: number,
    name: string,
    emailAddress: string,
    emailAddress2: string,
    emailAddress3: string,
    forVendorOnly: boolean,
    awayStart: moment.Moment,
    awayEnd: moment.Moment
  ) => {
    setEditId(id);
    setEditName(name);
    setEditEmailAddress(emailAddress);
    setEditEmailAddress2(emailAddress2);
    setEditEmailAddress3(emailAddress3);
    setEditForVendorOnly(forVendorOnly);
    setAwayStart(awayStart);
    setAwayEnd(awayEnd);
    setOpenEdit(true);
  };

  const handleOpenDelete = (id: number, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
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

  const handleAdd = (name: string, emailAddress: string, emailAddress2: string, emailAddress3: string, forVendorOnly: boolean) => {
    if (name && emailAddress) {
      actions.addSupplier(name, emailAddress, emailAddress2, emailAddress3, forVendorOnly);
    }
    setOpenAdd(false);
    setAdded(true);
  };

  const handleEdit = (name: string, emailAddress: string, emailAddress2: string, emailAddress3: string, forVendorOnly: boolean, awayStart: moment.Moment, awayEnd: moment.Moment) => {
    if (editId > 0 && name && (emailAddress || emailAddress2 || emailAddress3)) {
      actions.editSupplier(
        editId,
        name,
        emailAddress,
        emailAddress2,
        emailAddress3,
        forVendorOnly,
        awayStart,
        awayEnd
      );
    }
    setOpenEdit(false);
    setEdited(true);
  };

  const handleDelete = () => {
    if (deleteId > 0) {
      actions.deleteSupplier(deleteId);
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
      title="Fournisseurs"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="Le fournisseur a bien été ajouté !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="Le fournisseur a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="Le fournisseur a bien été supprimé !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddSupplier onClose={handleCloseAdd} onAdd={handleAdd} />
      )}
      {openEdit && (
        <EditSupplier
          name={editName}
          awayStart={awayStart}
          awayEnd={awayEnd}
          emailAddress={editEmailAddress}
          emailAddress2={editEmailAddress2}
          emailAddress3={editEmailAddress3}
          forVendorOnly={editForVendorOnly}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer un fournisseur"
          description={`Le fournisseur « ${deleteName} » sera définitivement perdu !`}
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
                defaultSorting={[{ columnName: "name", direction: "asc" }]}
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

export default ManageSuppliers;
