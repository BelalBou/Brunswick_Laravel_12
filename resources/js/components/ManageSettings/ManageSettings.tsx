import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import moment from "moment";
import "moment/locale/fr";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import EditSetting from "../EditSetting/EditSetting";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISetting from "../../interfaces/ISetting";
import IDailyMail from "../../interfaces/IDailyMail";

moment.locale("fr");

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
  h5: {
    paddingTop: theme.spacing.unit * 5
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
  isEditSuccess: boolean;
  isListPending: boolean;
  userToken: string;
  userType: string;
  userLanguage: string;
  selected: number;
  dictionnaryList: any[];
  settingList: ISetting[];
  dailyMailList: IDailyMail[];
  actions: any;
}

interface IState {
  openEdit: boolean;
  edited: boolean;
  editId: number;
  editTimeLimit: string;
  editStartPeriod: number;
  editEndPeriod: number;
  editEmailOrderCc: string;
  editEmailSupplierCc: string;
  editEmailVendorCc: string;
}

class ManageSettings extends Component<IProvidedProps & IProps, IState> {
  state = {
    openEdit: false,
    edited: false,
    editId: -1,
    editTimeLimit: "11:00:00",
    editStartPeriod: 0,
    editEndPeriod: 0,
    editEmailOrderCc: "",
    editEmailSupplierCc: "",
    editEmailVendorCc: ""
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
      this.props.actions.getSettings();
      this.props.actions.getDailyMails();
    }
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  handleCloseSnackbarEdited = () => {
    this.setState({
      edited: false
    });
  };

  checkDictionnary = (tag: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  handleTableColumns = () => {
    return [
      {
        name: "timeLimit",
        title: "Heure limite"
      },
      {
        name: "startPeriod",
        title: "Jour de début"
      },
      {
        name: "endPeriod",
        title: "Jour de fin"
      },
      {
        name: "emailOrderCc",
        title: "E-mails commandes"
      },
      {
        name: "emailSupplierCc",
        title: "E-mails fournisseurs"
      },
      {
        name: "emailVendorCc",
        title: "E-mails caissiers"
      },
      {
        name: "action",
        title: "Action"
      }
    ];
  };

  handleTableRows = () => {
    const { settingList } = this.props;
    if (settingList && settingList.length > 0) {
      return settingList.map(setting => {
        const obj = {
          timeLimit: moment(setting.time_limit, "HH:mm:ss").format("HH:mm"),
          startPeriod: moment.weekdays(true)[parseInt(setting.start_period)],
          endPeriod: moment.weekdays(true)[parseInt(setting.end_period)],
          emailOrderCc: setting.email_order_cc,
          emailSupplierCc: setting.email_supplier_cc,
          emailVendorCc: setting.email_vendor_cc,
          action: (
            <>
              <Tooltip title="Éditer ce paramètre">
                <IconButton
                  color="primary"
                  onClick={() =>
                    this.handleOpenEdit(
                      setting.id,
                      setting.time_limit,
                      parseInt(setting.start_period),
                      parseInt(setting.end_period),
                      setting.email_order_cc,
                      setting.email_supplier_cc,
                      setting.email_vendor_cc
                    )
                  }
                >
                  <EditIcon />
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

  handleOpenEdit = (
    id: number,
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => {
    this.setState({
      editId: id,
      editTimeLimit: timeLimit,
      editStartPeriod: startPeriod,
      editEndPeriod: endPeriod,
      editEmailOrderCc: emailOrderCc,
      editEmailSupplierCc: emailSupplierCc,
      editEmailVendorCc: emailVendorCc,
      openEdit: true
    });
  };

  handleCloseEdit = () => {
    this.setState({
      openEdit: false
    });
  };

  handleEdit = (
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => {
    const { editId } = this.state;
    if (editId > 0) {
      this.props.actions.editSetting(
        editId,
        timeLimit,
        startPeriod,
        endPeriod,
        emailOrderCc,
        emailSupplierCc,
        emailVendorCc
      );
    }
    this.setState({
      openEdit: false,
      edited: true
    });
  };

  render() {
    const {
      openEdit,
      edited,
      editTimeLimit,
      editStartPeriod,
      editEndPeriod,
      editEmailOrderCc,
      editEmailSupplierCc,
      editEmailVendorCc
    } = this.state;
    const {
      isLoginSuccess,
      isListPending,
      isEditSuccess,
      userType,
      selected,
      dailyMailList,
      classes
    } = this.props;
    if (!isLoginSuccess || userType !== "administrator") {
      return <Redirect to="/login" />;
    }
    let lastDailyMail = "N/A";
    if (dailyMailList && dailyMailList.length > 0) {
      lastDailyMail = moment(dailyMailList[0].date).format(
        "dddd DD MMMM à HH:mm"
      );
    }
    return (
      <MenuBar
        isLoginSuccess={isLoginSuccess}
        isListPending={isListPending}
        userType={userType}
        selected={selected}
        title="Paramètres"
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        {isEditSuccess && edited && (
          <SnackbarAction
            success
            message="Le paramètre a bien été modifié !"
            onClose={this.handleCloseSnackbarEdited}
          />
        )}
        {openEdit && (
          <EditSetting
            timeLimit={editTimeLimit}
            startPeriod={editStartPeriod}
            endPeriod={editEndPeriod}
            emailOrderCc={editEmailOrderCc}
            emailSupplierCc={editEmailSupplierCc}
            emailVendorCc={editEmailVendorCc}
            onClose={this.handleCloseEdit}
            onEdit={this.handleEdit}
          />
        )}
        <main className={classes.main}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <div className={classes.heroUnit}>
              <Typography
                color="textPrimary"
                variant="h5"
                gutterBottom
                align="center"
                className={classes.h5}
              >
                Dernier envoi de l'e-mail de confirmation de commandes :
              </Typography>
              <Typography
                color="primary"
                variant="h6"
                gutterBottom
                align="center"
              >
                {lastDailyMail}
              </Typography>
              <Table
                rows={this.handleTableRows()}
                columns={this.handleTableColumns()}
              />
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ManageSettings);
