import { Pressable, Text, View } from 'react-native';
import { Product as IProduct } from '../domains/Products/types';
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
		<View>
			<View>
				<Text>{product.name}</Text>
				<Text>{product.description}</Text>
				<Text>{product.price}</Text>
			</View>
			<View>
				{isCheckout ? (
					<>
						<Text>{quantity}</Text>
						<Text>Prix total: {product.price * quantity!}€</Text>
					</>
				) : (
					<>
						<Pressable onPress={() => addProduct(product)}>
							<Text>+</Text>
						</Pressable>
						<Text>{actualProduct?.quantity ?? 0}</Text>
						<Pressable onPress={() => removeProduct(product.id)}>
							<Text>-</Text>
						</Pressable>
					</>
				)}
			</View>
		</View>
	);
};
