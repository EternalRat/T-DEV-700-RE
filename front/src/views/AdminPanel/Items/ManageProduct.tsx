import { Dispatch, SetStateAction, useContext } from 'react';
import { ProductContext } from '../../../domains/Products/Products';
import { ProductStore, Product } from '../../../domains/Products/types';
import { ProductItem } from '../ProductItem';
import { FlatList } from 'react-native';

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
					productModal={productModal}
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
