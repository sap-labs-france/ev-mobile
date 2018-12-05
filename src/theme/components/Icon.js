import variable from "../variables/platform";
import commonColor from "../variables/commonColor";

export default (variables = variable) => {
	const iconTheme = {
		fontSize: variables.iconFontSize,
		color: commonColor.textColor,
	};

	return iconTheme;
};
