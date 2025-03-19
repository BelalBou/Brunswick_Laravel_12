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
import AddSupplier from "../AddSupplier/AddSupplier";
import EditSupplier from "../EditSupplier/EditSupplier";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISupplier from "../../interfaces/ISupplier";
import moment from "moment";

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
  supplierList: ISupplier[];
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
  editName: string;
  editEmailAddress: string;
  editEmailAddress2: string;
  editEmailAddress3: string;
  editForVendorOnly: boolean;
  deleteName: string;
  awayStart: moment.Moment,
  awayEnd: moment.Moment,
}

class ManageSuppliers extends Component<IProvidedProps & IProps, IState> {
  state = {
    openAdd: false,
    openEdit: false,
    openDelete: false,
    added: false,
    edited: false,
    deleted: false,
    editId: -1,
    deleteId: -1,
    editName: "",
    editEmailAddress: "",
    editEmailAddress2: "",
    editEmailAddress3: "",
    editForVendorOnly: false,
    deleteName: "",
    awayStart: moment(),
    awayEnd: moment(),
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
      this.props.actions.getSuppliersAdmin();
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

  handleTableRows = () => {
    const { supplierList } = this.props;
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
                    this.handleOpenEdit(
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
                    this.handleOpenDelete(supplier.id, supplier.name)
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

  handleOpenEdit = (
    id: number,
    name: string,
    emailAddress: string,
    emailAddress2: string,
    emailAddress3: string,
    forVendorOnly: boolean,
    awayStart: moment.Moment,
    awayEnd: moment.Moment
  ) => {
    this.setState({
      editId: id,
      editName: name,
      editEmailAddress: emailAddress,
      editEmailAddress2: emailAddress2,
      editEmailAddress3: emailAddress3,
      editForVendorOnly: forVendorOnly,
      awayStart: awayStart,
      awayEnd: awayEnd,
      openEdit: true
    });
  };

  handleOpenDelete = (id: number, name: string) => {
    this.setState({
      deleteId: id,
      deleteName: name,
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

  handleAdd = (name: string, emailAddress: string, emailAddress2: string, emailAddress3: string, forVendorOnly: boolean) => {
    if (name && emailAddress) {
      this.props.actions.addSupplier(name, emailAddress, emailAddress2, emailAddress3, forVendorOnly);
    }
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (name: string, emailAddress: string,emailAddress2: string, emailAddress3: string, forVendorOnly: boolean,awayStart: moment.Moment,awayEnd: moment.Moment) => {
    const { editId } = this.state;
    if (editId > 0 && name && (emailAddress || emailAddress2 || emailAddress3 )) {
      this.props.actions.editSupplier(
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
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  handleDelete = () => {
    const { deleteId } = this.state;
    if (deleteId > 0) {
      this.props.actions.deleteSupplier(deleteId);
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
      editName,
      awayStart,
      awayEnd,
      editEmailAddress,
      editEmailAddress2,
      editEmailAddress3,
      editForVendorOnly,
      deleteName
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
        title="Fournisseurs"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="Le fournisseur a bien été ajouté !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="Le fournisseur a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="Le fournisseur a bien été supprimé !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddSupplier onClose={this.handleCloseAdd} onAdd={this.handleAdd} />
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
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer un fournisseur"
            description={`Le fournisseur « ${deleteName} » sera définitivement perdu !`}
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
                defaultSorting={[{ columnName: "name", direction: "asc" }]}
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

export default withStyles(styles, { withTheme: true })(ManageSuppliers);
