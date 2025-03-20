import React from "react";
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
import AddAllergy from "../AddAllergy/AddAllergy";
import EditAllergy from "../EditAllergy/EditAllergy";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IAllergy from "../../interfaces/IAllergy";

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

interface ManageAllergiesProps {
  isLoginSuccess: boolean;
  isAddSuccess: boolean;
  isEditSuccess: boolean;
  isDeleteSuccess: boolean;
  isListPending: boolean;
  dictionnaryList: any[];
  allergyList: IAllergy[];
  userToken: string;
  userType: string;
  userLanguage: string;
  selected: number;
  actions: any;
}

interface ManageAllergiesState {
  openAdd: boolean;
  openEdit: boolean;
  openDelete: boolean;
  added: boolean;
  edited: boolean;
  deleted: boolean;
  editId: number;
  deleteId: number;
  editDescription: string;
  editDescriptionEn: string;
  deleteDescription: string;
}

const ManageAllergies: React.FC<ManageAllergiesProps> = ({
  isLoginSuccess,
  isAddSuccess,
  isEditSuccess,
  isDeleteSuccess,
  isListPending,
  dictionnaryList,
  allergyList,
  userToken,
  userType,
  userLanguage,
  selected,
  actions
}) => {
  const [state, setState] = React.useState<ManageAllergiesState>({
    openAdd: false,
    openEdit: false,
    openDelete: false,
    added: false,
    edited: false,
    deleted: false,
    editId: -1,
    deleteId: -1,
    editDescription: "",
    editDescriptionEn: "",
    deleteDescription: ""
  });

  React.useEffect(() => {
    if (isLoginSuccess) {
      refresh();
    }
  }, [isLoginSuccess]);

  React.useEffect(() => {
    refresh();
  }, [userToken]);

  const refresh = () => {
    if (userType === "administrator") {
      actions.getDictionnaries();
      actions.getAllergies();
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
        name: "description",
        title: "Description FR"
      },
      {
        name: "descriptionEn",
        title: "Description EN"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  const handleTableRows = () => {
    if (allergyList && allergyList.length > 0) {
      return allergyList.map(allergy => {
        const obj = {
          description: allergy.description,
          descriptionEn: allergy.description_en,
          action: (
            <>
              <Tooltip title="Éditer cet allergène">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenEdit(
                      allergy.id,
                      allergy.description,
                      allergy.description_en
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer cet allergène">
                <IconButton
                  color="secondary"
                  onClick={() =>
                    handleOpenDelete(allergy.id, allergy.description)
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

  const handleOpenEdit = (id: number, description: string, descriptionEn: string) => {
    setState(prev => ({
      ...prev,
      editId: id,
      editDescription: description,
      editDescriptionEn: descriptionEn,
      openEdit: true
    }));
  };

  const handleOpenDelete = (id: number, description: string) => {
    setState(prev => ({
      ...prev,
      deleteId: id,
      deleteDescription: description,
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

  const handleAdd = (description: string, descriptionEn: string) => {
    if (description) {
      actions.addAllergy(description, descriptionEn);
    }
    setState(prev => ({
      ...prev,
      openAdd: false,
      added: true
    }));
  };

  const handleEdit = (description: string, descriptionEn: string) => {
    const { editId } = state;
    if (editId > 0 && description) {
      actions.editAllergy(editId, description, descriptionEn);
    }
    setState(prev => ({
      ...prev,
      openEdit: false,
      edited: true
    }));
  };

  const handleDelete = () => {
    const { deleteId } = state;
    if (deleteId > 0) {
      actions.deleteAllergy(deleteId);
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
    editDescription,
    editDescriptionEn,
    deleteDescription
  } = state;

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title="Allergènes"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isAddSuccess && added && (
        <SnackbarAction
          success
          message="L'allergène a bien été ajouté !"
          onClose={handleCloseSnackbarAdded}
        />
      )}
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="L'allergène a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {isDeleteSuccess && deleted && (
        <SnackbarAction
          success
          message="L'allergène a bien été supprimé !"
          onClose={handleCloseSnackbarDeleted}
        />
      )}
      {openAdd && (
        <AddAllergy onClose={handleCloseAdd} onAdd={handleAdd} />
      )}
      {openEdit && (
        <EditAllergy
          description={editDescription}
          descriptionEn={editDescriptionEn}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      {openDelete && (
        <DeleteStuff
          title="Supprimer un allergène"
          description={`L'allergène « ${deleteDescription} » sera définitivement perdu !`}
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
                defaultSorting={[
                  { columnName: "description", direction: "asc" }
                ]}
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

export default ManageAllergies;
