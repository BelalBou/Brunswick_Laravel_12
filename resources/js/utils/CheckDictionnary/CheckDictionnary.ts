export default (tag: string, dictionnaryList: any[], languageName: string) => {
  if (dictionnaryList && dictionnaryList.length > 0) {
    const ret = dictionnaryList.filter(x => x.tag === tag);
    if (ret && ret.length > 0) {
      return ret[0]["translation_" + languageName];
    }
  }
  return tag;
};
