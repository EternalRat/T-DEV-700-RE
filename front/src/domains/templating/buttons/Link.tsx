import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
} from 'react-native';

interface Props {
	children: string;
	style?: StyleProp<TextStyle>;
	onClick: () => void;
}

export const LinkButton = ({ children, style, onClick }: Props) => {
	return (
		<TouchableOpacity onPress={onClick}>
			<Text style={[style, styles.label]}>{children}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: 14,
	},
});
