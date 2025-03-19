import IAllergy from "../../interfaces/IAllergy";

export default (a: IAllergy, b: IAllergy) => {
  return a.description.toLowerCase().localeCompare(b.description.toLowerCase());
};
