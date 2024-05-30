import { DrawerScreenProps } from '@react-navigation/drawer';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { Header } from '../../components/Header';
import { ProductContext } from '../../domains/Products/Products';
import { Product, ProductStore } from '../../domains/Products/types';
import { RootStackParamList, Routes } from '../../router/routesName';
import { SecretModal } from './SecretModal';
import { ProductModal } from './ProductModal';
import { Color } from '../../domains/Templating/style';
import Carousel from 'react-native-reanimated-carousel';
import { ManageProduct } from './Items/ManageProduct';

enum Items {
	PRODUCTS,
	CONFIGURATION,
}

export interface ItemProps {
	productModal: boolean;
	setSelectedProduct: Dispatch<SetStateAction<Product | undefined>>;
	setProductModal: Dispatch<SetStateAction<boolean>>;
}

const CarouselItems: Record<Items, (props: ItemProps) => JSX.Element> = {
	[Items.PRODUCTS]: ManageProduct,
	[Items.CONFIGURATION]: ManageProduct,
};

export const AdminPanel = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.ADMIN_PANEL>) => {
	const { addProduct, editProduct } =
		useContext<ProductStore>(ProductContext);
	const [productModal, setProductModal] = useState<boolean>(false);
	const [selectedProduct, setSelectedProduct] = useState<
		Product | undefined
	>();
	const [select, setSelect] = useState<Items>(Items.PRODUCTS);
	const { width } = useWindowDimensions();
	const Component = useMemo(() => {
		return CarouselItems[select];
	}, [select]);

	const updateView = (index: number) => () => {
		setSelect(index);
	};

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#444',
				flex: 1,
			}}>
			<Header
				title='Admin Panel'
				navigation={navigation}
				setProductModal={
					select === Items.PRODUCTS ? setProductModal : undefined
				}
				setSelectedProduct={setSelectedProduct}
			/>
			<View
				style={{
					alignSelf: 'center',
					flexDirection: 'row',
					marginTop: 10,
				}}>
				{Object.keys(CarouselItems).map((_, index) => (
					<TouchableOpacity key={index} onPress={updateView(index)}>
						<View
							style={{
								height: 16,
								width: 16,
								borderRadius: 8,
								backgroundColor:
									index === select
										? Color.ORANGE
										: Color.BORDER,
								marginHorizontal: 5,
							}}
						/>
					</TouchableOpacity>
				))}
			</View>
			<Carousel
				width={width}
				style={{
					width: width,
					alignSelf: 'center',
				}}
				loop={false}
				data={Object.keys(CarouselItems)}
				defaultIndex={select}
				onSnapToItem={(index: number) => setSelect(index)}
				renderItem={({ index }: { index: number }) => {
					return (
						<Component
							productModal={productModal}
							setProductModal={setProductModal}
							setSelectedProduct={setSelectedProduct}
						/>
					);
				}}
			/>
			<SecretModal />
			<ProductModal
				product={selectedProduct}
				setProduct={setSelectedProduct}
				setVisible={setProductModal}
				visible={productModal}
				addProduct={addProduct}
				editProduct={editProduct}
			/>
		</View>
	);
};
