import { useContext, useState } from 'react';
import { View } from 'react-native';

import Images from '../../../images/Images';
import { Files } from '../../../images/ImagesTypes';
import { CustomModal } from '../../components/Modal';
import { AuthContext } from '../../domains/Auth/Auth';
import { AuthStore } from '../../domains/Auth/types';
import { Input } from '../../domains/Templating/input/TextInput';
import { CONTAINER_WIDTH } from '../../domains/Templating/style';
import { Label } from '../../domains/Templating/texts/Label';
import { Button } from '../../domains/Templating/buttons/Button';

export const SecretModal = () => {
	const { accessPanelAdmin } = useContext<AuthStore>(AuthContext);
	const [password, setPassword] = useState('');
	const [modalVisible, setModalVisible] = useState(true);

	return (
		<CustomModal setVisible={setModalVisible} visible={modalVisible}>
			<View
				style={{
					width: '100%',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(0,0,0,0.5)',
				}}>
				<View
					style={{
						width: CONTAINER_WIDTH,
						padding: 20,
						borderRadius: 10,
						alignItems: 'center',
						gap: 16,
						backgroundColor: '#333',
					}}>
					<Label>Enter your secret password</Label>
					<Input
						icon={Images[Files.key]}
						updateText={e => setPassword(e.nativeEvent.text)}
						value={password}
						secured
						style={{ width: '90%' }}
					/>
					<Button
						text='Submit'
						onClick={() => {
							accessPanelAdmin(password).then(val => {
								if (val) {
									setModalVisible(!modalVisible);
								}
							});
						}}
					/>
				</View>
			</View>
		</CustomModal>
	);
};
