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

const { ExcelFile, ExcelSheet, ExcelColumn } = ReactExport;

interface IOrderMenu {
  id: number;
  quantity: number;
  remark: string;
}

interface IOrderDictionary {
  [key: number]: IOrder[];
}

interface IExportData {
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

const OrdersExport: React.FC<IProps> = ({ exportEl, orderList, orderExtraList }) => {
  const exportData = React.useMemo(() => {
    if (!orderList?.length) return null;

    const dataSet: IExportData[] = [];
    const orderDictionary = _.groupBy(orderList.sort(userSort), order => order.User.id);

    Object.values(orderDictionary).forEach((orders: IOrder[]) => {
      orders.forEach((order: IOrder) => {
        if (!order.Menu?.length) return;

        order.Menu.sort(menuSort).forEach((menu: IMenu) => {
          const orderMenu = menu.order_menu[0] as IOrderMenu;
          if (!orderMenu) return;

          const data: IExportData = {
            supplier_name: menu.supplier?.name || "pas de supplier",
            name: `${orders[0].User.last_name.toUpperCase()} ${orders[0].User.first_name}`,
            date: moment(order.date, "YYYY-MM-DD").format("DD/MM/YYYY"),
            menu: `${orderMenu.quantity}x ${menu.menu_size?.title || ""} ${menu.title}`,
            extra: "",
            remark: orderMenu.remark || ""
          };

          if (orderExtraList?.length) {
            const filteredOrderExtraList = orderExtraList.filter(
              orderExtra => orderExtra.order_menu_id === orderMenu.id
            );

            data.extra = filteredOrderExtraList
              .map(filteredOrderExtra => filteredOrderExtra.Extra?.title)
              .filter(Boolean)
              .join(", ");
          }

          dataSet.push(data);
        });
      });
    });

    return dataSet;
  }, [orderList, orderExtraList]);

  return (
    <ExcelFile element={exportEl} filename="commandes">
      <ExcelSheet data={exportData || []} name="Commandes">
        <ExcelColumn label="Fournisseur" value="supplier_name" />
        <ExcelColumn label="Nom" value="name" />
        <ExcelColumn label="Date" value="date" />
        <ExcelColumn label="Menu" value="menu" />
        <ExcelColumn label="Suppléments" value="extra" />
        <ExcelColumn label="Remarques" value="remark" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export default OrdersExport;
