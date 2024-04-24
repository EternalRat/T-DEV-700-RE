import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { DrawerContent } from '../components/Drawer';
import { RootStackParamList, Routes } from './routesName';
import { Shop } from '../views/Shop/Shop';
import { Settings } from '../views/Settings';
import { Checkout } from '../views/Checkout';
import { Transaction } from '../views/Transaction';

const Drawer = createDrawerNavigator<RootStackParamList>();

enableScreens();

export const CashManagerRouter = () => {
	return (
		<Drawer.Navigator
			drawerContent={props => <DrawerContent {...props} />}
			initialRouteName={Routes.SETTINGS}
			screenOptions={{
				headerShown: false,
				drawerActiveBackgroundColor: '#FFA500',
				drawerActiveTintColor: '#333',
				drawerInactiveTintColor: '#fff',
				drawerLabelStyle: {
					fontSize: 15,
					marginLeft: -25,
				},
				drawerPosition: 'left',
				drawerType: 'front',
				swipeEdgeWidth: Platform.OS === 'android' ? 180 : 0,
			}}>
			<Drawer.Screen
				name={Routes.SHOP}
				component={Shop}
				options={{
					drawerLabel: 'Accueil',
					drawerIcon: ({ color }) => (
						<Ionicons name='home-outline' size={22} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name={Routes.SETTINGS}
				component={Settings}
				options={{
					drawerItemStyle: {
						display: 'none',
					},
				}}
			/>
			<Drawer.Screen
				name={Routes.CHECKOUT}
				component={Checkout}
				options={{
					drawerIcon: ({ color }) => (
						<MaterialIcons name='vote' size={22} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name={Routes.TRANSACTION}
				component={Transaction}
				options={{
					drawerLabel: 'Top Voteurs',
					drawerIcon: ({ color }) => (
						<MaterialIcons name='vote' size={22} color={color} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
};
