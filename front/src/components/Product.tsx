import { useContext, useMemo } from 'react';
import { Text, View } from 'react-native';

import { MessageContext } from '../domains/message/Context';
import { ActionTypeMessage, MessageType } from '../domains/message/types';
import { Product as IProduct } from '../domains/product/types';
import { SettingsContext } from '../domains/settings/Settings';
import { SettingsStore } from '../domains/settings/types';
import { CustomButton } from '../domains/templating/buttons/Button';
import { CartContext } from '../domains/userCart/Cart';
import { CartStore } from '../domains/userCart/types';

interface Props {
	product: IProduct;
	isCheckout?: boolean;
	quantity?: number;
}

export const Product = ({ product, isCheckout = false, quantity }: Props) => {
	const { cartStore, addProduct, removeProduct } =
		useContext<CartStore>(CartContext);
	const { settings } = useContext<SettingsStore>(SettingsContext);
	const { dispatch: dispatchMessage } = useContext(MessageContext);
	const actualProduct = useMemo(() => {
		return cartStore.find(productCart => productCart.id === product.id);
	}, [cartStore, product]);
	const maxProduct = useMemo(() => {
		if (!settings) return;
		const setting = settings.find(
			setting => setting.property === 'maxProduct'
		);
		return setting?.value ?? -1;
	}, [settings]);

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
							color: 'white',
						}}>
						{product.name}
					</Text>
					<Text
						style={{
							fontSize: 14,
							lineHeight: 20,
							fontWeight: '500',
							color: 'white',
						}}>
						{product.description}
					</Text>
					<Text
						style={{
							fontSize: 14,
							lineHeight: 20,
							fontWeight: '500',
							color: 'white',
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
						<Text style={{ color: 'white' }}>{quantity}</Text>
						<Text style={{ color: 'white' }}>
							Prix total: {product.price * quantity!}€
						</Text>
					</View>
				) : (
					<View
						style={{
							width: '20%',
							height: 68,
							flexDirection: 'column',
						}}>
						<CustomButton
							onClick={() => {
								const cartSize = cartStore.reduce(
									(acc, cart) => (acc += cart.quantity),
									0
								);
								if (
									maxProduct !== -1 &&
									maxProduct === cartSize
								) {
									dispatchMessage({
										type: ActionTypeMessage.ADD_GENERIC_MESSAGE,
										message: 'Panier plein',
										typeMessage: MessageType.ERROR,
										duration: 3000,
									});
									return;
								}
								addProduct(product);
							}}
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
							}}
							text='+'
						/>
						<Text
							style={{
								height: 16,
								fontSize: 14,
								lineHeight: 20,
								fontWeight: '500',
								textAlign: 'center',
								color: 'white',
							}}>
							{actualProduct?.quantity ?? 0}
						</Text>
						<CustomButton
							onClick={() => {
								if (!actualProduct) return;
								removeProduct(product.id);
							}}
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
							}}
							text='-'
						/>
					</View>
				)}
			</View>
		</View>
	);
};
