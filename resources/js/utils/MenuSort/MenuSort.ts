import IMenu from "../../interfaces/IMenu";

export default (a: IMenu, b: IMenu) => {
  const ret = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  return ret === 0 && a.MenuSize && b.MenuSize
    ? a.MenuSize.title
        .toLowerCase()
        .localeCompare(b.MenuSize.title.toLowerCase())
    : ret;
};
