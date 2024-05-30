import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { DrawerContent } from '../components/Drawer';
import { AdminPanel } from '../views/AdminPanel/AdminPanel';
import { Checkout } from '../views/Checkout/Checkout';
import { Settings } from '../views/Settings/Settings';
import { Shop } from '../views/Shop/Shop';
import { Transaction } from '../views/Transaction/Transaction';
import { RootStackParamList, Routes } from './routesName';

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
				headerStyle: {
					backgroundColor: '#333',
				},
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
					drawerLabel: 'Transaction',
					drawerIcon: ({ color }) => (
						<MaterialIcons name='vote' size={22} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name={Routes.ADMIN_PANEL}
				component={AdminPanel}
				options={{
					drawerLabel: 'Admin',
					drawerIcon: ({ color }) => (
						<Ionicons
							name='shield-half-outline'
							size={22}
							color={color}
						/>
					),
				}}
			/>
		</Drawer.Navigator>
	);
};
