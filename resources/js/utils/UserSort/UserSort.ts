import IOrder from "../../interfaces/IOrder";

export default (a: IOrder, b: IOrder) => {
  const ret = a.User.last_name
    .toLowerCase()
    .localeCompare(b.User.last_name.toLowerCase());
  return ret === 0
    ? a.User.first_name
        .toLowerCase()
        .localeCompare(b.User.first_name.toLowerCase())
    : ret;
};
