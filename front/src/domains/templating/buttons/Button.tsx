import { View, ViewStyle } from 'react-native';
import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
} from 'react-native';

import { Color } from '../style';

interface Props {
	children: string;
	style?: StyleProp<ViewStyle>;
	disabled?: boolean;
	textStyle?: StyleProp<TextStyle>;
	onClick: () => void;
}

export const Button = ({
	children,
	style,
	onClick,
	textStyle,
	disabled = false,
}: Props) => {
	return (
		<TouchableOpacity onPress={onClick} disabled={disabled}>
			<View style={[style]}>
				<Text style={[styles.label, textStyle]}>{children}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
		color: Color.WHITE,
	},
});
