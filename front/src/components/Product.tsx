import { Pressable, Text, View } from 'react-native';
import { Product as IProduct } from '../domains/products/types';
import { useContext, useMemo } from 'react';
import { CartStore, ProductCart } from '../domains/Cart/types';
import { CartContext } from '../domains/Cart/Cart';

interface Props {
	product: IProduct;
	isCheckout?: boolean;
	quantity?: number;
}

export const Product = ({ product, isCheckout = false, quantity }: Props) => {
	const { cartStore, addProduct, removeProduct } =
		useContext<CartStore>(CartContext);
	const actualProduct = useMemo(() => {
		return cartStore.find(productCart => productCart.id === product.id);
	}, [cartStore, product]);

	return (
		<View className='mx-4 w-full h-10 flex flex-col'>
			<View className='px-4 w-[80%] h-full flex flex-row'>
				<Text className='text-xl font-bold'>{product.name}</Text>
				<Text className='text-sm font-medium'>
					{product.description}
				</Text>
				<Text className='text-sm font-medium'>{product.price}</Text>
			</View>
			<View className='px-4 w-[20%] h-full flex flex-row'>
				{isCheckout ? (
					<>
						<Text className='text-center font-bold'>
							{quantity}
						</Text>
						<Text className='text-center font-bold'>
							Prix total: {product.price * quantity!}€
						</Text>
					</>
				) : (
					<>
						<Pressable
							className='w-10 h-10 bg-gray-200 rounded-md'
							onPress={() => addProduct(product)}>
							<Text className='text-center font-bold'>+</Text>
						</Pressable>
						<Text className='text-center font-bold'>
							{actualProduct?.quantity ?? 0}
						</Text>
						<Pressable
							className='w-10 h-10 bg-gray-200 rounded-md'
							onPress={() => removeProduct(product.id)}>
							<Text className='text-center font-bold'>-</Text>
						</Pressable>
					</>
				)}
			</View>
		</View>
	);
};
