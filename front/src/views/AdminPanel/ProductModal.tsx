import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import Images from '../../../images/Images';
import { Files } from '../../../images/ImagesTypes';
import { CustomModal } from '../../components/Modal';
import { Input } from '../../domains/Templating/input/TextInput';
import { CONTAINER_WIDTH } from '../../domains/Templating/style';
import { Label } from '../../domains/Templating/texts/Label';
import { Product, ProductType } from '../../domains/Products/types';
import { Button } from '../../domains/Templating/buttons/Button';

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
	<CustomModal setVisible={setVisible} visible={visible}>
		{product && (
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
					<View>
						<Label>Name</Label>
						<Input
							value={product.name}
							updateText={e => {
								setProduct({
									...product,
									name: e.nativeEvent.text,
								});
							}}
						/>
					</View>
					<View>
						<Label>Description</Label>
						<Input
							value={product.description}
							updateText={e => {
								setProduct({
									...product,
									description: e.nativeEvent.text,
								});
							}}
						/>
					</View>
					<View>
						<Label>Type</Label>
						<RNPickerSelect
							style={{
								viewContainer: {
									width: 200,
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
					<View>
						<Label>Prix</Label>
						<Input
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
						<Button
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
		)}
	</CustomModal>
);
