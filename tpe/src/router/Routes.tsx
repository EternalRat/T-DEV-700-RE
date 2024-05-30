import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import { Home } from '../views/Home';
import { NFC } from '../views/NFC';
import { QRSCanner } from '../views/QRScanner';
import { RootStackParamList, Routes } from './routesName';

const Stack = createNativeStackNavigator<RootStackParamList>();

enableScreens();

export const CashManagerRouter = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={Routes.HOME} component={Home} />
			<Stack.Screen name={Routes.NFC} component={NFC} />
			<Stack.Screen name={Routes.QRSCANNER} component={QRSCanner} />
		</Stack.Navigator>
	);
};
