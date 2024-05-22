import { Text, View } from 'react-native';
import { Product as IProduct } from '../domains/Products/types';
import { useContext, useMemo } from 'react';
import { CartStore } from '../domains/Cart/types';
import { CartContext } from '../domains/Cart/Cart';
import { Button } from '../domains/Templating/buttons/Button';

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
		<View
			style={{
				width: '100%',
			}}>
			<View
				style={{
					height: 100,
					margin: 8,
					padding: 16,
					backgroundColor: '#55555599',
					flexDirection: 'row',
					borderRadius: 5,
				}}>
				<View style={{ width: '80%', height: 100 }}>
					<Text
						style={{
							fontSize: 20,
							lineHeight: 28,
							fontWeight: 'bold',
						}}>
						{product.name}
					</Text>
					<Text
						style={{
							fontSize: 14,
							lineHeight: 20,
							fontWeight: '500',
						}}>
						{product.description}
					</Text>
					<Text
						style={{
							fontSize: 14,
							lineHeight: 20,
							fontWeight: '500',
						}}>
						{product.price}
					</Text>
				</View>
				{isCheckout ? (
					<View
						style={{
							width: '20%',
							height: '100%',
							flexDirection: 'column',
						}}>
						<Text>{quantity}</Text>
						<Text>Prix total: {product.price * quantity!}€</Text>
					</View>
				) : (
					<View
						style={{
							width: '20%',
							height: 68,
							flexDirection: 'column',
						}}>
						<Button
							onClick={() => addProduct(product)}
							style={{
								width: '100%',
								height: 26,
								justifyContent: 'center',
								alignItems: 'center',
							}}
							textStyle={{
								textAlign: 'center',
								fontSize: 14,
								lineHeight: 20,
								fontWeight: '500',
							}}>
							+
						</Button>
						<Text
							style={{
								height: 16,
								fontSize: 14,
								lineHeight: 20,
								fontWeight: '500',
								textAlign: 'center',
							}}>
							{actualProduct?.quantity ?? 0}
						</Text>
						<Button
							onClick={() => removeProduct(product.id)}
							style={{
								width: '100%',
								height: 26,
								justifyContent: 'center',
								alignItems: 'center',
							}}
							textStyle={{
								textAlign: 'center',
								fontSize: 14,
								lineHeight: 20,
								fontWeight: '500',
							}}>
							-
						</Button>
					</View>
				)}
			</View>
		</View>
	);
};
