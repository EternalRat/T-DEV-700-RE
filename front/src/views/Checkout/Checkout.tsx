import { useContext } from 'react';
import { CartContext } from '../../domains/Cart/Cart';
import { CartStore } from '../../domains/Cart/types';
import { Pressable, Text, View } from 'react-native';
import { ProductContext } from '../../domains/Products/Products';
import { ProductStore } from '../../domains/Products/types';
import { Product } from '../../components/Product';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../../router/routesName';
import { Header } from '../../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../../domains/Templating/buttons/Button';
import { WebsocketContext } from '../../domains/Websocket/Websocket';
import { AuthStore } from '../../domains/Auth/types';
import { AuthContext } from '../../domains/Auth/Auth';

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
				<Button
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
					children={`Total: ${cartStore.reduce(
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
