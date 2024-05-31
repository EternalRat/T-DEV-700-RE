import { SetStateAction } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';

interface Props {
	children: React.ReactNode;
	visible: boolean;
	setVisible: (value: SetStateAction<boolean>) => void;
	canBeClosed?: boolean;
}

export const CustomModal = ({
	children,
	visible,
	setVisible,
	canBeClosed = false,
}: Props) => (
	<Modal
		animationType='slide'
		transparent={true}
		visible={visible}
		onRequestClose={() => {
			setVisible(!visible);
		}}>
		<TouchableWithoutFeedback
			onPress={() => {
				if (canBeClosed) setVisible(false);
			}}>
			{children}
		</TouchableWithoutFeedback>
	</Modal>
);
