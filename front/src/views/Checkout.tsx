import { useContext } from 'react';
import { CartContext } from '../domains/Cart/Cart';
import { CartStore } from '../domains/Cart/types';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { Pressable, Text } from 'react-native';
import { ProductContext } from '../domains/products/Products';
import { ProductStore } from '../domains/products/types';
import { Product } from '../components/Product';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList, Routes } from '../router/routesName';

export const Checkout = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.CHECKOUT>) => {
	const { cartStore } = useContext<CartStore>(CartContext);
	const { productStore } = useContext<ProductStore>(ProductContext);

	return (
		<View className='flex-1 w-full h-full'>
			<View className='w-full h-[10%] bg-blue-500'>
				<Text className='text-center text-black text-base font-bold'>
					Checkout
				</Text>
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
			<View className='w-full h-[10%] bg-blue-500'>
				<Pressable>
					<Text className='text-center text-black text-base font-bold'>
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
