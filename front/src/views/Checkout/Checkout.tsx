import { DrawerScreenProps } from '@react-navigation/drawer';
import { useContext } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Header } from '../../components/Header';
import { Product } from '../../components/Product';
import { AuthContext } from '../../domains/authentification/Auth';
import { AuthStore } from '../../domains/authentification/types';
import { ProductContext } from '../../domains/product/Products';
import { ProductStore } from '../../domains/product/types';
import { WebsocketContext } from '../../domains/socket/Websocket';
import { CustomButton } from '../../domains/templating/buttons/Button';
import { CartContext } from '../../domains/userCart/Cart';
import { CartStore } from '../../domains/userCart/types';
import { RootStackParamList, Routes } from '../../router/routesName';

export const Checkout = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.CHECKOUT>) => {
	const { loggedUser } = useContext<AuthStore>(AuthContext);
	const { cartStore } = useContext<CartStore>(CartContext);
	const { productStore } = useContext<ProductStore>(ProductContext);
	const { sendMessage } = useContext(WebsocketContext);

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#444',
				flex: 1,
			}}>
			<Header title='Checkout' navigation={navigation} />
			<ScrollView style={{ marginBottom: 16 }}>
				{cartStore.map(product => {
					const cartProduct = productStore.find(
						p => p.id === product.id
					);
					return (
						<Product
							key={product.id}
							product={cartProduct!}
							isCheckout
							quantity={product.quantity}
						/>
					);
				})}
			</ScrollView>
			<View style={{ bottom: 0 }}>
				<CustomButton
					onClick={() => {
						sendMessage('validate-payment', {
							merchantId: loggedUser.id,
							amount: cartStore.reduce(
								(acc, item) => (acc += item.price),
								0
							),
						});
						navigation.navigate(Routes.TRANSACTION);
					}}
					text={`Total: ${cartStore.reduce(
						(acc, product) => acc + product.price,
						0
					)}€`}
					style={{
						height: 60,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#666',
						margin: 16,
						bottom: 8,
						borderRadius: 5,
					}}
				/>
			</View>
		</View>
	);
};
