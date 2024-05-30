import { View } from 'react-native';
import { Button } from '../../domains/Templating/buttons/Button';

interface Props {
	name: string;
	productModal: boolean;
	onClick: () => void;
}

export const ProductItem = ({ name, productModal, onClick }: Props) => {
	return (
		<View
			style={{
				width: '100%',
				borderBottomWidth: 1,
				borderBottomColor: '#ccc',
			}}>
			<Button
				style={{
					padding: 16,
				}}
				text={name}
				onClick={onClick}
			/>
		</View>
	);
};
