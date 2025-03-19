import ICart from "../../interfaces/ICart";

export default (a: ICart, b: ICart) =>
  a.menu.title.toLowerCase().localeCompare(b.menu.title.toLowerCase());
