import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';

import { WebsocketContext } from '../domains/Websocket/Websocket';
import { RootStackParamList, Routes } from '../router/routesName';

export const Home = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.HOME>) => {
	const { screen, setScreen, metadata } = useContext(WebsocketContext);

	return (
		<View
			style={{
				backgroundColor: '#333',
				height: '100%',
				width: '100%',
				padding: 16,
				gap: 16,
				display: 'flex',
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
			{metadata.price !== -1 && (
				<View
					style={{
						width: '100%',
						height: 120,
						display: 'flex',
						justifyContent: 'center',
					}}>
					<Text
						style={{
							color: '#fff',
							fontSize: 24,
							textAlign: 'center',
						}}>
						Il y a un achat de :{' '}
					</Text>
					<Text
						style={{
							color: '#fff',
							fontSize: 24,
							textAlign: 'center',
						}}>
						{metadata.price}€
					</Text>
					<Text
						style={{
							color: '#fff',
							fontSize: 24,
							textAlign: 'center',
						}}>
						en attente.
					</Text>
				</View>
			)}
			<View
				style={{
					backgroundColor: '#777',
					height: 80,
					width: '100%',
					bottom: 0,
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
