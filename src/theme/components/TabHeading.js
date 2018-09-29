import variable from "./../variables/platform";

const primary = require("../variables/commonColor").brandPrimary;

export default (variables = variable) => {
	const platform = variables.platform;

	const tabHeadingTheme = {
		flexDirection: "row",
		backgroundColor: primary,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		".scrollable": {
			paddingHorizontal: 20,
			flex: platform === "android" ? 0 : 1,
			minWidth: platform === "android" ? undefined : 60,
		},
		"NativeBase.Text": {
			color: variables.topTabBarActiveTextColor,
			marginHorizontal: 7,
			fontWeight: platform === "ios" ? "500" : "300",
		},
		"NativeBase.Icon": {
			color: variables.topTabBarTextColor,
			fontSize: platform === "ios" ? 26 : undefined,
		},
		".active": {
			"NativeBase.Text": {
				color: variables.topTabBarActiveTextColor,
				fontWeight: "900",
			},
			"NativeBase.Icon": {
				color: variables.topTabBarActiveTextColor,
			},
		},
	};

	return tabHeadingTheme;
};
