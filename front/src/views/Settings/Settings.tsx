import { useContext } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ProductStore } from '../../domains/Products/types';
import { ProductContext } from '../../domains/Products/Products';
import { RootStackParamList, Routes } from '../../router/routesName';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { AuthStore } from '../../domains/Auth/types';
import { AuthContext } from '../../domains/Auth/Auth';
import { useSettings } from './useSettings';
import { Header } from '../../components/Header';
import { Input } from '../../domains/templating/input/TextInput';
import { Files } from '../../../images/ImagesTypes';
import Images from '../../../images/Images';
import { Button } from '../../domains/templating/buttons/Button';
import { Label } from '../../domains/templating/texts/Label';

export const Settings = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.SETTINGS>) => {
	const { login } = useContext<AuthStore>(AuthContext);
	const { auth, setUsername, setPassword } = useSettings();

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
				<Button
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
					onClick={() => {
						console.log('test');
						login(auth.username, auth.password, navigation);
					}}>
					Se connecter
				</Button>
			</View>
		</View>
	);
};
