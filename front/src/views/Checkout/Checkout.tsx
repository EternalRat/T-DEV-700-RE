import { useContext } from 'react';
import { CartContext } from '../../domains/Cart/Cart';
import { CartStore } from '../../domains/Cart/types';
import { Pressable, Text, View } from 'react-native';
import { ProductContext } from '../../domains/Products/Products';
import { ProductStore } from '../../domains/Products/types';
import { Product } from '../../components/Product';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../../router/routesName';

export const Checkout = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.CHECKOUT>) => {
	const { cartStore } = useContext<CartStore>(CartContext);
	const { productStore } = useContext<ProductStore>(ProductContext);

	return (
		<View>
			<View>
				<Text>Checkout</Text>
			</View>
			{cartStore.map(product => {
				const cartProduct = productStore.find(p => p.id === product.id);
				return (
					<Product
						key={product.id}
						product={cartProduct!}
						isCheckout
						quantity={product.quantity}
					/>
				);
			})}
			<View>
				<Pressable>
					<Text>
						Total:{' '}
						{cartStore.reduce(
							(acc, product) => acc + product.price,
							0
						)}
						€
					</Text>
				</Pressable>
			</View>
		</View>
	);
};
