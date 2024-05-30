import { DrawerScreenProps } from '@react-navigation/drawer';
import { useContext } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import Images from '../../../images/Images';
import { Files } from '../../../images/ImagesTypes';
import { Header } from '../../components/Header';
import { AuthContext } from '../../domains/authentification/Auth';
import { AuthStore } from '../../domains/authentification/types';
import { CustomButton } from '../../domains/templating/buttons/Button';
import { Input } from '../../domains/templating/input/TextInput';
import { Label } from '../../domains/templating/texts/Label';
import { WebsocketContext } from '../../domains/socket/Websocket';
import { RootStackParamList, Routes } from '../../router/routesName';
import { useSettings } from './useSettings';

export const Settings = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.SETTINGS>) => {
	const { login } = useContext<AuthStore>(AuthContext);
	const { auth, setUsername, setPassword, setTpeId } = useSettings();
	const { tpeInformations } = useContext(WebsocketContext);

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#444',
				flex: 1,
			}}>
			<Header title='Settings' navigation={navigation} />
			<View
				style={{
					flex: 1,
					width: '100%',
					margin: 16,
					justifyContent: 'center',
				}}>
				<View
					style={{
						paddingBottom: 16,
					}}>
					<Label style={{ color: '#fff' }}>Nom d'utilisateur</Label>
					<Input
						icon={Images[Files.user]}
						updateText={e => setUsername(e.nativeEvent.text)}
						value={auth.username}
						type='username'
					/>
				</View>
				<View
					style={{
						paddingBottom: 16,
					}}>
					<Label style={{ color: '#fff' }}>Mot de passe</Label>
					<Input
						icon={Images[Files.key]}
						updateText={e => setPassword(e.nativeEvent.text)}
						value={auth.password}
						secured
						type='password'
					/>
				</View>
				<View
					style={{
						paddingBottom: 16,
					}}>
					<Label style={{ color: '#fff' }}>Selection du TPE</Label>
					<RNPickerSelect
						style={{
							viewContainer: {
								marginRight: 16,
							},
						}}
						items={tpeInformations.map(tpeInformation => {
							return {
								label: tpeInformation,
								value: tpeInformation,
							};
						})}
						onValueChange={value => {
							setTpeId(value);
						}}
					/>
				</View>
				<CustomButton
					style={{
						backgroundColor: 'white',
						height: 40,
						width: 180,
						display: 'flex',
						alignSelf: 'center',
						justifyContent: 'center',
						borderRadius: 5,
						marginLeft: -16,
					}}
					textStyle={{
						color: 'black',
						textAlign: 'center',
					}}
					onClick={async () => {
						if (auth.tpeId === '') {
							return;
						}
						await login(
							auth.username,
							auth.password,
							auth.tpeId,
							navigation
						);
					}}
					text='Se connecter'
				/>
			</View>
		</View>
	);
};
