import { ResponsiveStyleSheet } from "react-native-responsive-ui";
import commonColor from "../../theme/variables/commonColor";
import { scale } from 'react-native-size-matters';
import deepmerge from "deepmerge";

const commonStyles = {
  background: {
    flex: 1,
    backgroundColor: commonColor.brandPrimary
  },
  drawerContent: {
    paddingTop: "3%",
    flex: 1
  },
  logoContainer: {
    borderColor: commonColor.textColor,
    borderBottomWidth: 1,
    padding: "5%"
  },
  logo: {
    resizeMode: "contain",
    width: scale(100),
    height: scale(50),
    alignSelf: "center",
    margin: "0.5%",
  },
  versionText: {
    color: commonColor.textColor,
    fontSize: scale(14),
    margin: "0.5%",
    alignSelf: "center"
  },
  versionDate: {
    color: commonColor.textColor,
    fontSize: scale(14),
    alignSelf: "center"
  },
  links: {
    padding: "2%",
    borderBottomWidth: 0,
    borderBottomColor: "transparent"
  },
  linkText: {
    color: commonColor.textColor,
    fontSize: scale(16),
    paddingLeft: "4%"
  },
  logoutContainer: {
    padding: 30,
    paddingTop: 0
  },
  logoutButton: {
    paddingTop: "4.5%",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: commonColor.textColor
  },
  gridLogoutContainer: {
    flexDirection: "row",

    flex: 1
  },
  columnAccount: {
    flexDirection: "column",
    flexGrow: 2,
    flex: 1
  },
  buttonLogout: {
    alignSelf: "flex-start",
    backgroundColor: "transparent"
  },
  logoutText: {
    fontWeight: "bold",
    fontSize: scale(14),
    color: commonColor.textColor
  },
  userName: {
    fontSize: scale(14),
    color: commonColor.textColor
  },
  columnThumbnail: {
    flex: 1,
    flexDirection: "column"
  },
  buttonThumbnail: {
    alignSelf: "flex-end"
  },
  profilePic: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20)
  }
};

const portraitStyles = {
};

const landscapeStyles = {
};

export default function computeStyleSheet() {
  return ResponsiveStyleSheet.select([
    {
      query: { orientation: "landscape" },
      style: deepmerge(commonStyles, landscapeStyles)
    },
    {
      query: { orientation: "portrait" },
      style: deepmerge(commonStyles, portraitStyles)
    }
  ]);
}
