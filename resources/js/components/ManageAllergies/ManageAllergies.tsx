import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import AddAllergy from "../AddAllergy/AddAllergy";
import EditAllergy from "../EditAllergy/EditAllergy";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IAllergy from "../../interfaces/IAllergy";

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
}

interface IProps {
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

interface IState {
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

class ManageAllergies extends Component<IProvidedProps & IProps, IState> {
  state = {
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
  };

  componentDidMount() {
    const { isLoginSuccess } = this.props;
    if (isLoginSuccess) {
      this.refresh();
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const { userToken } = this.props;
    if (userToken !== prevProps.userToken) {
      this.refresh();
    }
  }

  refresh = () => {
    const { userType } = this.props;
    if (userType === "administrator") {
      this.props.actions.getDictionnaries();
      this.props.actions.getAllergies();
    }
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
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

  handleTableRows = () => {
    const { allergyList } = this.props;
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
                    this.handleOpenEdit(
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
                    this.handleOpenDelete(allergy.id, allergy.description)
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

  handleOpenEdit = (id: number, description: string, descriptionEn: string) => {
    this.setState({
      editId: id,
      editDescription: description,
      editDescriptionEn: descriptionEn,
      openEdit: true
    });
  };

  handleOpenDelete = (id: number, description: string) => {
    this.setState({
      deleteId: id,
      deleteDescription: description,
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

  handleAdd = (description: string, descriptionEn: string) => {
    if (description) {
      this.props.actions.addAllergy(description, descriptionEn);
    }
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (description: string, descriptionEn: string) => {
    const { editId } = this.state;
    if (editId > 0 && description) {
      this.props.actions.editAllergy(editId, description, descriptionEn);
    }
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  handleDelete = () => {
    const { deleteId } = this.state;
    if (deleteId > 0) {
      this.props.actions.deleteAllergy(deleteId);
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
      editDescription,
      editDescriptionEn,
      deleteDescription
    } = this.state;
    const {
      isLoginSuccess,
      isListPending,
      isAddSuccess,
      isEditSuccess,
      isDeleteSuccess,
      userType,
      selected,
      classes
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
        title="Allergènes"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="L'allergène a bien été ajouté !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="L'allergène a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="L'allergène a bien été supprimé !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddAllergy onClose={this.handleCloseAdd} onAdd={this.handleAdd} />
        )}
        {openEdit && (
          <EditAllergy
            description={editDescription}
            descriptionEn={editDescriptionEn}
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer un allergène"
            description={`L'allergène « ${deleteDescription} » sera définitivement perdu !`}
            onClose={this.handleCloseDelete}
            onDelete={this.handleDelete}
            checkDictionnary={this.checkDictionnary}
          />
        )}
        <main className={classes.main}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <div className={classes.heroUnit}>
              <Table
                add
                rows={this.handleTableRows()}
                columns={this.handleTableColumns()}
                defaultSorting={[
                  { columnName: "description", direction: "asc" }
                ]}
                onAddedRowsChange={this.handleOpenAdd}
              />
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ManageAllergies);
