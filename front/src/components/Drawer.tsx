import { API_URL } from '@env';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../domains/authentification/Auth';
import { AuthStore } from '../domains/authentification/types';
import { RootStackParamList, Routes } from '../router/routesName';

export const DrawerContent = (props: DrawerContentComponentProps) => {
	const { logout, loggedUser } = useContext<AuthStore>(AuthContext);
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList, Routes>>();
	const [debug, setDebug] = useState<number>(0);

	const incDebug = () => {
		setDebug(debug + 1);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#0c0a0a', zIndex: 200 }}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ backgroundColor: '#0c0a0a' }}>
				<View
					style={{
						flex: 1,
						paddingTop: 10,
					}}>
					<DrawerItem
						label={'Shop'}
						onPress={() => {
							props.navigation.reset({
								routes: [{ name: Routes.SHOP }],
							});
						}}
						focused={props.state.index === 0}
						activeBackgroundColor='#FFA500'
						activeTintColor='#333'
						inactiveTintColor='#fff'
						labelStyle={{ fontSize: 15, marginLeft: -25 }}
						icon={({ color }) => (
							<Ionicons
								name='home-outline'
								size={22}
								color={color}
							/>
						)}
					/>
					<DrawerItem
						label={'Settings'}
						onPress={() => {
							props.navigation.reset({
								routes: [{ name: Routes.SETTINGS }],
							});
						}}
						focused={props.state.index === 1}
						activeBackgroundColor='#FFA500'
						activeTintColor='#333'
						inactiveTintColor='#fff'
						labelStyle={{ fontSize: 15, marginLeft: -25 }}
						icon={({ color }) => (
							<MaterialIcons
								name='vote'
								size={22}
								color={color}
							/>
						)}
					/>
					<DrawerItem
						label={'Gérer les produits'}
						onPress={() => {
							props.navigation.reset({
								routes: [{ name: Routes.ADMIN_PANEL }],
							});
						}}
						focused={props.state.index === 4}
						activeBackgroundColor='#FFA500'
						activeTintColor='#333'
						inactiveTintColor='#fff'
						labelStyle={{ fontSize: 15, marginLeft: -25 }}
						icon={({ color }) => (
							<MaterialIcons
								name='vote'
								size={22}
								color={color}
							/>
						)}
					/>
				</View>
			</DrawerContentScrollView>
			{debug <= 5 ? (
				<View
					style={{
						bottom: 46.5,
						height: 46.5,
						marginHorizontal: 10,
						marginVertical: 4,
						overflow: 'hidden',
						borderRadius: 4,
					}}>
					<TouchableOpacity onPress={incDebug}>
						<View
							style={{
								height: '100%',
								padding: 8,
								flexDirection: 'row',
								borderRadius: 4,
								alignItems: 'center',
							}}>
							<MaterialIcons
								name='logout-variant'
								size={22}
								color={'#fff'}
							/>
							<Text
								style={{
									color: '#fff',
									fontWeight: '500',
									marginLeft: 10,
									fontSize: 14,
								}}>
								Debug
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			) : (
				<View
					style={{
						bottom: 46.5,
						height: 46.5,
						marginHorizontal: 10,
						marginVertical: 4,
						overflow: 'hidden',
						borderRadius: 4,
					}}>
					<Text
						style={{
							color: '#fff',
							fontWeight: '500',
							marginLeft: 10,
							fontSize: 14,
						}}>
						API_URL: {API_URL}
					</Text>
				</View>
			)}
			{loggedUser.id !== -1 && (
				<View
					style={{
						bottom: 0,
						height: 46.5,
						marginHorizontal: 10,
						marginVertical: 4,
						overflow: 'hidden',
						borderRadius: 4,
					}}>
					<TouchableOpacity
						onPress={() => {
							logout();
							navigation.reset({
								routes: [{ name: Routes.SETTINGS }],
							});
						}}>
						<View
							style={{
								height: '100%',
								padding: 8,
								flexDirection: 'row',
								borderRadius: 4,
								alignItems: 'center',
							}}>
							<MaterialIcons
								name='logout-variant'
								size={22}
								color={'#fff'}
							/>
							<Text
								style={{
									color: '#fff',
									fontWeight: '500',
									marginLeft: 10,
									fontSize: 14,
								}}>
								Déconnexion
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};
