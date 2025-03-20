import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
import AddUser from "../AddUser/AddUser";
import EditUser from "../EditUser/EditUser";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import userTypes from "../../utils/UserTypes/UserTypes";
import ISupplier from "../../interfaces/ISupplier";
import IUser from "../../interfaces/IUser";

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
}

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

interface IState {
  openAdd: boolean;
  openEdit: boolean;
  openDelete: boolean;
  added: boolean;
  edited: boolean;
  deleted: boolean;
  editId: number;
  deleteId: number;
  editLastName: string;
  editFirstName: string;
  editEmailAddress: string;
  editType: string;
  editSupplierId: number;
  editLanguage: string;
  deleteLastName: string;
  deleteFirstName: string;
}

class ManageUsers extends Component<IProvidedProps & IProps, IState> {
  state = {
    openAdd: false,
    openEdit: false,
    openDelete: false,
    added: false,
    edited: false,
    deleted: false,
    editId: -1,
    deleteId: -1,
    editLastName: "",
    editFirstName: "",
    editEmailAddress: "",
    editType: "",
    editSupplierId: 1,
    editLanguage: "fr",
    deleteLastName: "",
    deleteFirstName: ""
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
    this.props.actions.getDictionnaries();
    if (userType === "administrator") {
      this.props.actions.getUsers();
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

  handleTableRows = () => {
    const { userList, userId } = this.props;
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
                    this.handleOpenEdit(
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
                    this.handleOpenDelete(
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

  handleOpenAdd = () => {
    this.setState({
      openAdd: true
    });
  };

  handleOpenEdit = (
    id: number,
    lastName: string,
    firstName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string
  ) => {
    this.setState({
      editId: id,
      editLastName: lastName,
      editFirstName: firstName,
      editEmailAddress: emailAddress,
      editType: type,
      editSupplierId: supplierId,
      editLanguage: language,
      openEdit: true
    });
  };

  handleOpenDelete = (id: number, lastName: string, firstName: string) => {
    this.setState({
      deleteId: id,
      deleteLastName: lastName,
      deleteFirstName: firstName,
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
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string
  ) => {
    this.props.actions.addUser(
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language
    );
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string,
    resetPassword: boolean
  ) => {
    const { editId } = this.state;
    if (editId > 0) {
      this.props.actions.editUser(
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
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  handleDelete = () => {
    const { deleteId } = this.state;
    if (deleteId > 0) {
      this.props.actions.deleteUser(deleteId);
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
      editLastName,
      editFirstName,
      editEmailAddress,
      editType,
      editSupplierId,
      editLanguage,
      deleteLastName,
      deleteFirstName
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
      classes
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
        title="Utilisateurs"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="L'utilisateur a bien été ajouté !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="L'utilisateur a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="L'utilisateur a bien été supprimé !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddUser
            supplierList={supplierList}
            onClose={this.handleCloseAdd}
            onAdd={this.handleAdd}
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
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer un utilisateur"
            description={`L'utilisateur « ${deleteLastName.toUpperCase()} ${deleteFirstName} » sera définitivement perdu !`}
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

export default withStyles(styles, { withTheme: true })(ManageUsers);
