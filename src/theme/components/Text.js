import variable from "./../variables/platform";

export default (variables = variable) => {
	const textTheme = {
		fontSize: variables.DefaultFontSize - 1,
		fontFamily: variables.fontFamily,
		color: "#FFF",
		".note": {
			color: "#a7a7a7",
			fontSize: variables.noteFontSize,
		},
	};

	return textTheme;
};
