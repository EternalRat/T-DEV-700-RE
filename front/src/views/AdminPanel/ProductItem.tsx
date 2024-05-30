import { View } from 'react-native';

import { CustomButton } from '../../domains/templating/buttons/Button';

interface Props {
	name: string;
	onClick: () => void;
}

export const ProductItem = ({ name, onClick }: Props) => {
	return (
		<View
			style={{
				width: '100%',
				borderBottomWidth: 1,
				borderBottomColor: '#ccc',
			}}>
			<CustomButton
				style={{
					padding: 16,
				}}
				text={name}
				onClick={onClick}
			/>
		</View>
	);
};
