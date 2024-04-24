import { Pressable, Text, View } from 'react-native';
import { Product } from '../../components/Product';
import { ScrollView } from 'react-native-gesture-handler';
import { useShop } from './useShop';
import { RootStackParamList, Routes } from '../../router/routesName';
import { DrawerScreenProps } from '@react-navigation/drawer';

export const Shop = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.SHOP>) => {
	const { productStore, selectedMerchantName, totalPrice } = useShop();

	return (
		<View className='w-full h-full '>
			<View className='w-full h-[10%] bg-blue-500'>
				<Text className='text-center text-black text-base font-bold'>
					{selectedMerchantName}
				</Text>
			</View>
			{selectedMerchantName.length > 0 ? (
				<ScrollView className='w-full h-[80%]'>
					{productStore.map(product => (
						<Product key={product.id} product={product} />
					))}
				</ScrollView>
			) : (
				<View className='w-full h-[80%] flex items-center justify-center'>
					<Text className='text-center text-black text-base font-bold'>
						Sélectionner un marchant pour voir les produits
					</Text>
				</View>
			)}
			<View className='w-full h-[10%] bg-blue-500'>
				<Pressable onPress={() => navigation.navigate(Routes.CHECKOUT)}>
					<Text className='text-center text-black text-base font-bold'>
						Total: {totalPrice}€
					</Text>
				</Pressable>
			</View>
		</View>
	);
};
