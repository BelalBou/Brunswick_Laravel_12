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
import AddMenuSize from "../AddMenuSize/AddMenuSize";
import EditMenuSize from "../EditMenuSize/EditMenuSize";
import DeleteStuff from "../DeleteStuff/DeleteStuff";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import IMenuSize from "../../interfaces/IMenuSize";
import IMenu from "../../interfaces/IMenu";

const styles = (theme: Theme) => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: ".625rem"
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
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
  menuSizeList: IMenuSize[];
  menuList: IMenu[];
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
  editTitle: string;
  editTitleEn: string;
  deleteTitle: string;
}

class ManageMenuSizes extends Component<IProvidedProps & IProps, IState> {
  state = {
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
    deleteTitle: ""
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
      this.props.actions.getMenuSizes();
      this.props.actions.getMenus();
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

  handleTableRows = () => {
    const { menuSizeList, menuList } = this.props;
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
                    this.handleOpenEdit(
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
                    this.handleOpenDelete(menuSize.id, menuSize.title)
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

  handleOpenAdd = () => {
    this.setState({
      openAdd: true
    });
  };

  handleOpenEdit = (id: number, title: string, titleEn: string) => {
    this.setState({
      editId: id,
      editTitle: title,
      editTitleEn: titleEn,
      openEdit: true
    });
  };

  handleOpenDelete = (id: number, title: string) => {
    this.setState({
      deleteId: id,
      deleteTitle: title,
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

  handleAdd = (title: string, titleEn: string) => {
    if (title) {
      this.props.actions.addMenuSize(title, titleEn);
    }
    this.setState({
      openAdd: false,
      added: true
    });
  };

  handleEdit = (title: string, titleEn: string) => {
    const { editId } = this.state;
    this.props.actions.editMenuSize(editId, title, titleEn);
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  handleDelete = () => {
    const { deleteId } = this.state;
    if (deleteId > 0) {
      this.props.actions.deleteMenuSize(deleteId);
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
      editTitle,
      editTitleEn,
      deleteTitle
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
    if (!isLoginSuccess || userType !== "administrator") {
      return <Redirect to="/login" />;
    }
    return (
      <MenuBar
        isLoginSuccess={isLoginSuccess}
        isListPending={isListPending}
        userType={userType}
        selected={selected}
        title="Tailles"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isAddSuccess && added && (
          <SnackbarAction
            success
            message="La taille a bien été ajoutée !"
            onClose={this.handleCloseSnackbarAdded}
          />
        )}
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="La taille a bien été modifiée !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {isDeleteSuccess && deleted && (
          <SnackbarAction
            success
            message="La taille a bien été supprimée !"
            onClose={this.handleCloseSnackbarDeleted}
          />
        )}
        {openAdd && (
          <AddMenuSize onClose={this.handleCloseAdd} onAdd={this.handleAdd} />
        )}
        {openEdit && (
          <EditMenuSize
            title={editTitle}
            titleEn={editTitleEn}
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        {openDelete && (
          <DeleteStuff
            title="Supprimer une taille"
            description={`La taille « ${deleteTitle} » sera définitivement perdue !`}
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
                defaultSorting={[{ columnName: "title", direction: "asc" }]}
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

export default withStyles(styles, { withTheme: true })(ManageMenuSizes);
