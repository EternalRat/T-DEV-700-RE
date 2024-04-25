import { Pressable, Text, View } from 'react-native';
import { Product } from '../../components/Product';
import { ScrollView } from 'react-native-gesture-handler';
import { useShop } from './useShop';
import { RootStackParamList, Routes } from '../../router/routesName';
import { DrawerScreenProps } from '@react-navigation/drawer';

export const Shop = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.SHOP>) => {
	const { productStore, loggedUser, totalPrice } = useShop();

	return (
		<View>
			<View>
				<Text>{loggedUser.name}</Text>
			</View>
			{loggedUser.name.length > 0 ? (
				<ScrollView>
					{productStore.map(product => (
						<Product key={product.id} product={product} />
					))}
				</ScrollView>
			) : (
				<View>
					<Text>Sélectionner un marchant pour voir les produits</Text>
				</View>
			)}
			<View>
				<Pressable onPress={() => navigation.navigate(Routes.CHECKOUT)}>
					<Text>Total: {totalPrice}€</Text>
				</Pressable>
			</View>
		</View>
	);
};
