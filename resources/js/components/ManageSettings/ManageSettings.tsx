import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import EditSetting from "../EditSetting/EditSetting";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISetting from "../../interfaces/ISetting";
import IDailyMail from "../../interfaces/IDailyMail";

moment.locale("fr");

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

const StyledTypography = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(5)
}));

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

const ManageSettings: React.FC<IProps> = ({
  isLoginSuccess,
  isEditSuccess,
  isListPending,
  userToken,
  userType,
  userLanguage,
  selected,
  dictionnaryList,
  settingList,
  dailyMailList,
  actions
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [edited, setEdited] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [editTimeLimit, setEditTimeLimit] = useState("11:00:00");
  const [editStartPeriod, setEditStartPeriod] = useState(0);
  const [editEndPeriod, setEditEndPeriod] = useState(0);
  const [editEmailOrderCc, setEditEmailOrderCc] = useState("");
  const [editEmailSupplierCc, setEditEmailSupplierCc] = useState("");
  const [editEmailVendorCc, setEditEmailVendorCc] = useState("");

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
      actions.getSettings();
      actions.getDailyMails();
    }
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleChangeSelected = (selected: number) => {
    actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  const handleCloseSnackbarEdited = () => {
    setEdited(false);
  };

  const getDictionaryValue = (tag: string) => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  const handleTableColumns = () => {
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

  const handleTableRows = () => {
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
                    handleOpenEdit(
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

  const handleOpenEdit = (
    id: number,
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => {
    setEditId(id);
    setEditTimeLimit(timeLimit);
    setEditStartPeriod(startPeriod);
    setEditEndPeriod(endPeriod);
    setEditEmailOrderCc(emailOrderCc);
    setEditEmailSupplierCc(emailSupplierCc);
    setEditEmailVendorCc(emailVendorCc);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEdit = (
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => {
    if (editId > 0) {
      actions.editSetting(
        editId,
        timeLimit,
        startPeriod,
        endPeriod,
        emailOrderCc,
        emailSupplierCc,
        emailVendorCc
      );
    }
    setOpenEdit(false);
    setEdited(true);
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
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
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getDictionaryValue}
    >
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="Le paramètre a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
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
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      <StyledMain>
        <StyledLayout>
          <StyledCardGrid>
            <StyledHeroUnit>
              <StyledTypography
                color="textPrimary"
                variant="h5"
                gutterBottom
                align="center"
              >
                Dernier envoi de l'e-mail de confirmation de commandes :
              </StyledTypography>
              <Typography
                color="primary"
                variant="h6"
                gutterBottom
                align="center"
              >
                {lastDailyMail}
              </Typography>
              <Table
                rows={handleTableRows()}
                columns={handleTableColumns()}
              />
            </StyledHeroUnit>
          </StyledCardGrid>
        </StyledLayout>
      </StyledMain>
      <Footer />
    </MenuBar>
  );
};

export default ManageSettings;
