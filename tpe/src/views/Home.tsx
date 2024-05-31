import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';

import { WebsocketContext } from '../domains/Websocket/Websocket';
import { RootStackParamList, Routes } from '../router/routesName';

export const Home = ({
	navigation,
}: NativeStackScreenProps<RootStackParamList, Routes.HOME>) => {
	const { metadata } = useContext(WebsocketContext);

	return (
		<View
			style={{
				backgroundColor: '#333',
				height: '100%',
				width: '100%',
				padding: 16,
				gap: 16,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<View
				style={{
					backgroundColor: '#99ffa0a8',
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
					disabled={metadata.price === -1}
					onPress={() => {
						navigation.navigate(Routes.NFC);
					}}>
					<Text style={{ color: '#000' }}>NFC</Text>
				</Pressable>
			</View>
			<View
				style={{
					backgroundColor: '#9b9dfea8',
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
					disabled={metadata.price === -1}
					onPress={() => {
						navigation.navigate(Routes.QRSCANNER);
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
		</View>
	);
};
