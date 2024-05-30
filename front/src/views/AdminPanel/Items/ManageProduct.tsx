import { Dispatch, SetStateAction, useContext } from 'react';
import { FlatList } from 'react-native';

import { ProductContext } from '../../../domains/product/Products';
import { Product, ProductStore } from '../../../domains/product/types';
import { ProductItem } from '../ProductItem';

interface Props {
	productModal: boolean;
	setSelectedProduct: Dispatch<SetStateAction<Product | undefined>>;
	setProductModal: Dispatch<SetStateAction<boolean>>;
}

export const ManageProduct = ({
	productModal,
	setProductModal,
	setSelectedProduct,
}: Props) => {
	const { productStore } = useContext<ProductStore>(ProductContext);

	return (
		<FlatList
			data={productStore}
			contentContainerStyle={{ gap: 8 }}
			renderItem={({ item }) => (
				<ProductItem
					name={item.name}
					onClick={() => {
						setProductModal(!productModal);
						setSelectedProduct(item);
					}}
				/>
			)}
			keyExtractor={item => item.name + item.id}
		/>
	);
};
