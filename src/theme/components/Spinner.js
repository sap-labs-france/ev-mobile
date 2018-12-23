import variable from "./../variables/platform";
import { scale } from 'react-native-size-matters';

export default (variables = variable) => {
	const spinnerTheme = {
		height: scale(80),
	};

	return spinnerTheme;
};
