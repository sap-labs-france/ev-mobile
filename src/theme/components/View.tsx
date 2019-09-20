import variable from "./../variables/platform";

export default (variables /* : * */ = variable) => {
  const viewTheme: any = {
    ".padder": {
      padding: variables.contentPadding
    }
  };

  return viewTheme;
};
