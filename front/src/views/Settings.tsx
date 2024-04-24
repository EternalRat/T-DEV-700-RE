import { useContext } from 'react';
import { MerchantStore } from '../domains/merchants/types';
import { MerchantContext } from '../domains/merchants/Merchants';
import { Pressable, Text, View } from 'react-native';
import { ProductStore } from '../domains/products/types';
import { ProductContext } from '../domains/products/Products';
import { RootStackParamList, Routes } from '../router/routesName';
import { DrawerScreenProps } from '@react-navigation/drawer';

export const Settings = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.SETTINGS>) => {
	const { merchantStore } = useContext<MerchantStore>(MerchantContext);
	const { getProducts } = useContext<ProductStore>(ProductContext);

	return (
		<View className='flex-1 w-full h-full'>
			<Text className='w-full text-center'>Settings</Text>
			<View className='flex-1 w-full h-full items-center justify-center'>
				{merchantStore.map(merchant => (
					<Pressable
						key={merchant.id}
						className='w-[90%] h-10 bg-gray-200 rounded-md mt-2'
						onPress={() => {
							console.log(merchant.name);
							getProducts(merchant.id, navigation);
						}}>
						<Text className='text-center font-bold text-base'>
							{merchant.name}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
};
