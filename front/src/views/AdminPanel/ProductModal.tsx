import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { CustomModal } from '../../components/Modal';
import { Product, ProductType } from '../../domains/product/types';
import { CustomButton } from '../../domains/templating/buttons/Button';
import { Input } from '../../domains/templating/input/TextInput';
import { CONTAINER_WIDTH } from '../../domains/templating/style';
import { Label } from '../../domains/templating/texts/Label';

interface Props {
	visible: boolean;
	product: Product | undefined;
	setProduct: Dispatch<SetStateAction<Product | undefined>>;
	setVisible: Dispatch<SetStateAction<boolean>>;
	addProduct: (
		productName: string,
		description: string,
		price: number,
		type: ProductType,
		merchantId: number
	) => Promise<void>;
	editProduct: (
		id: number,
		productName: string,
		description: string,
		price: number,
		type: ProductType,
		merchantId: number
	) => Promise<void>;
}

const typeName: Record<ProductType, string> = {
	[ProductType.CLOTHINGS]: 'Vêtements',
	[ProductType.DRINKS]: 'Boissons',
	[ProductType.ELECTRONICS]: 'Electroniques',
	[ProductType.FOODS]: 'Nourritures',
	[ProductType.OTHERS]: 'Autres',
};

export const ProductModal = ({
	product,
	setProduct,
	setVisible,
	visible,
	addProduct,
	editProduct,
}: Props) => (
	<CustomModal setVisible={setVisible} visible={visible} canBeClosed>
		{product ? (
			<View
				style={{
					width: '100%',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(0,0,0,0.5)',
				}}>
				<View
					style={{
						width: CONTAINER_WIDTH,
						padding: 20,
						borderRadius: 10,
						alignItems: 'center',
						gap: 16,
						backgroundColor: '#333',
					}}>
					<View
						style={{
							width: '100%',
						}}>
						<Label>Name</Label>
						<Input
							style={{
								width: '100%',
							}}
							value={product.name}
							updateText={e => {
								setProduct({
									...product,
									name: e.nativeEvent.text,
								});
							}}
						/>
					</View>
					<View
						style={{
							width: '100%',
						}}>
						<Label>Description</Label>
						<Input
							style={{
								width: '100%',
							}}
							value={product.description}
							updateText={e => {
								setProduct({
									...product,
									description: e.nativeEvent.text,
								});
							}}
						/>
					</View>
					<View
						style={{
							width: '100%',
						}}>
						<Label>Type</Label>
						<RNPickerSelect
							style={{
								viewContainer: {
									width: '100%',
									borderColor: '#fff',
									borderWidth: 1,
									height: 50,
								},
							}}
							value={product.type}
							items={Object.entries(typeName).map(
								([type, name]) => ({ label: name, value: type })
							)}
							onValueChange={value =>
								setProduct({ ...product, type: value })
							}
						/>
					</View>
					<View
						style={{
							width: '100%',
						}}>
						<Label>Prix</Label>
						<Input
							style={{
								width: '100%',
							}}
							value={product.price.toString()}
							keyboardType='numeric'
							updateText={e => {
								setProduct({
									...product,
									price:
										e.nativeEvent.text.length > 0
											? parseInt(e.nativeEvent.text)
											: 0,
								});
							}}
						/>
					</View>
					<View>
						<CustomButton
							style={{
								backgroundColor: 'white',
								height: 40,
								width: 180,
								display: 'flex',
								alignSelf: 'center',
								justifyContent: 'center',
								borderRadius: 5,
							}}
							textStyle={{
								color: 'black',
								textAlign: 'center',
							}}
							text={product.id ? 'Modifier' : 'Créer'}
							onClick={async () => {
								if (
									product.id !== undefined &&
									product.id !== -1
								) {
									await editProduct(
										product.id,
										product.name,
										product.description,
										product.price,
										product.type,
										product.merchantId
									);
								} else {
									await addProduct(
										product.name,
										product.description,
										product.price,
										product.type,
										product.merchantId
									);
								}
								setProduct(undefined);
								setVisible(false);
							}}
						/>
					</View>
				</View>
			</View>
		) : (
			<></>
		)}
	</CustomModal>
);
