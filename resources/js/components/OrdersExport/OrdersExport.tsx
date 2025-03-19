import React from "react";
import _ from "lodash";
import ReactExport from "react-data-export";
import moment from "moment";
import userSort from "../../utils/UserSort/UserSort";
import menuSort from "../../utils/MenuSort/MenuSort";
import IMenu from "../../interfaces/IMenu";
import IOrder from "../../interfaces/IOrder";
import IOrderExtra from "../../interfaces/IOrderExtra";
import ISupplier from "../../interfaces/ISupplier";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

interface IOrderDictionnary {
  [index: number]: IOrder[];
}

interface IData {
  supplier_name: string;
  name: string;
  date: string;
  menu: string;
  extra: string;
  remark: string;
}

interface IProps {
  exportEl: React.ReactNode;
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
}

function OrdersExport(props: IProps) {
  function _export(
    orderDictionnary: IOrderDictionnary,
    orderExtraList: IOrderExtra[]
  ) {
    const dataSet = [] as IData[];
    _.map(orderDictionnary, (value: IOrder[]) => {
      let data = {} as IData;
      value.map((order: IOrder) => {
        if (order.Menu && order.Menu.length > 0) {
          order.Menu.sort(menuSort).map((menu: IMenu) => {
            data.supplier_name = `${menu.Supplier ? menu.Supplier.name : "pas de supplier"}`;

            data.name = `${value[0].User.last_name.toUpperCase()} ${
              value[0].User.first_name
            }`;
            data.date = moment(order.date, "YYYY-MM-DD").format("DD/MM/YYYY");
            data.menu = `${menu.order_menus.quantity}x ${
              menu.MenuSize ? menu.MenuSize.title : ""
            } ${menu.title}`;
            let filteredOrderExtraList = null;
            if (orderExtraList && orderExtraList.length > 0) {
              filteredOrderExtraList = orderExtraList.filter(
                orderExtra => orderExtra.order_menu_id === menu.order_menus.id
              );
            }
            data.extra = "";
            if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
              filteredOrderExtraList.map(filteredOrderExtra => {
                data.extra += filteredOrderExtra.Extra
                  ? `${filteredOrderExtra.Extra.title}, `
                  : "";
              });
            }
            data.remark = "";
            if (menu.order_menus.remark) {
              data.remark = menu.order_menus.remark;
            }
            dataSet.push(data);
            data = {} as IData;
          });
        }
      });
    });
    return dataSet;
  }

  let exportedData = null;
  if (props.orderList && props.orderList.length > 0) {
    exportedData = _export(
      _.groupBy(props.orderList.sort(userSort), order => order.User.id),
      props.orderExtraList
    );
  }
  return (
    <ExcelFile element={props.exportEl} filename="commandes">
      <ExcelSheet data={exportedData} name="Commandes">
      <ExcelColumn label="Fournisseur" value="supplier_name" />
        <ExcelColumn label="Nom" value="name" />
        <ExcelColumn label="Date" value="date" />
        <ExcelColumn label="Menu" value="menu" />
        <ExcelColumn label="Suppléments" value="extra" />
        <ExcelColumn label="Remarques" value="remark" />
      </ExcelSheet>
    </ExcelFile>
  );
}

export default OrdersExport;
