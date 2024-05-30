import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

interface Props {
	children: string;
	style?: StyleProp<TextStyle>;
}

export const Label = ({ children, style }: Props) => {
	return <Text style={[styles.label, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
	label: {
		fontSize: 14,
	},
});
