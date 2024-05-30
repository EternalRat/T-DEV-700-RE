import { SetStateAction } from 'react';
import { Modal } from 'react-native';

interface Props {
	children: React.ReactNode;
	visible: boolean;
	setVisible: (value: SetStateAction<boolean>) => void;
}

export const CustomModal = ({ children, visible, setVisible }: Props) => (
	<Modal
		animationType='slide'
		transparent={true}
		visible={visible}
		onRequestClose={() => {
			setVisible(!visible);
		}}>
		{children}
	</Modal>
);
