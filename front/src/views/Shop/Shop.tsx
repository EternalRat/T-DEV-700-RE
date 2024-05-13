import { Text, View } from 'react-native';
import { Product } from '../../components/Product';
import { ScrollView } from 'react-native-gesture-handler';
import { useShop } from './useShop';
import { RootStackParamList, Routes } from '../../router/routesName';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Header } from '../../components/Header';
import { Button } from '../../domains/templating/buttons/Button';

export const Shop = ({
	navigation,
}: DrawerScreenProps<RootStackParamList, Routes.SHOP>) => {
	const { productStore, loggedUser, totalPrice } = useShop();

	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: '#444',
				flex: 1,
			}}>
			<Header title={loggedUser.name} navigation={navigation} />
			{loggedUser.name.length > 0 ? (
				<>
					<ScrollView style={{ marginBottom: 32 }}>
						{productStore.map(product => (
							<Product key={product.id} product={product} />
						))}
					</ScrollView>
					<View style={{ height: 60 }}>
						<Button
							onClick={() => navigation.navigate(Routes.CHECKOUT)}
							children={`Total: ${totalPrice.toString()}€`}
							style={{
								height: 60,
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: 'red',
								margin: 16,
								bottom: 32,
								borderRadius: 5,
							}}
						/>
					</View>
				</>
			) : (
				<View>
					<Text>Sélectionner un marchant pour voir les produits</Text>
				</View>
			)}
		</View>
	);
};
