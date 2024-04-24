import React from 'react';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, Routes } from '../router/routesName';

export const DrawerContent = (props: DrawerContentComponentProps) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList, Routes>>();

	return (
		<View className='flex-1 bg-black z-20'>
			<DrawerContentScrollView {...props} className='bg-black'>
				<View className='flex-1 pt-[10px]'>
					<DrawerItem
						label={'Boutique'}
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
						label={'Vote'}
						onPress={() => {
							props.navigation.reset({
								routes: [{ name: Routes.SETTINGS }],
							});
						}}
						focused={props.state.index === 2}
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
		</View>
	);
};
