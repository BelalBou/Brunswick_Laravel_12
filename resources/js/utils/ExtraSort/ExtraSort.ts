import IExtra from "../../interfaces/IExtra";

export default (a: IExtra, b: IExtra) => {
  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
};
