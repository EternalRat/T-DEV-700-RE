import { useContext } from 'react';
import { WebsocketContext } from '../domains/Websocket/Websocket';
import { Pressable, Text, View } from 'react-native';
import { RootStackParamList, Routes } from '../router/routesName';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const Home = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.HOME>) => {
	const { screen, setScreen } = useContext(WebsocketContext);
	return (
		<View
			style={{
				backgroundColor: '#333',
				height: '100%',
				width: '100%',
				padding: 16,
				gap: 16,
			}}>
			<View
				style={{
					backgroundColor:
						screen !== Routes.NFC ? '#99ffa0a8' : '#52ff5d9d',
					height: '20%',
					width: '100%',
				}}>
				<Pressable
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						width: '100%',
					}}
					onPress={() => {
						console.log('test');
						if (screen == Routes.NFC) {
							setScreen(Routes.HOME);
							return;
						}
						setScreen(Routes.NFC);
					}}>
					<Text style={{ color: '#000' }}>NFC</Text>
				</Pressable>
			</View>
			<View
				style={{
					backgroundColor:
						screen !== Routes.QRSCANNER ? '#9b9dfea8' : '#6c6fff9d',
					height: '20%',
					width: '100%',
				}}>
				<Pressable
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						width: '100%',
					}}
					onPress={() => {
						if (screen == Routes.QRSCANNER) {
							setScreen(Routes.HOME);
							return;
						}
						setScreen(Routes.QRSCANNER);
					}}>
					<Text style={{ color: '#000' }}>QRCode</Text>
				</Pressable>
			</View>
			<View
				style={{
					backgroundColor: '#777',
					height: 80,
					width: '100%',
				}}>
				<Pressable
					style={{
						width: '100%',
						height: 80,
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onPress={() => {
						navigation.navigate(screen);
					}}>
					<Text>Enter Screen</Text>
				</Pressable>
			</View>
		</View>
	);
};
