import NativeImage from '@chouicgames/react-native-images-to-native-images';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Dispatch, SetStateAction, useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Images, { Files } from '../../images/Images';
import { AuthContext } from '../domains/Auth/Auth';
import { AuthStore } from '../domains/Auth/types';
import { Product, ProductType } from '../domains/Products/types';
import { RootStackParamList, Routes } from '../router/routesName';

interface Props {
	title: string;
	navigation: DrawerNavigationProp<RootStackParamList, Routes>;
	setProductModal?: Dispatch<SetStateAction<boolean>>;
	setSelectedProduct?: Dispatch<SetStateAction<Product | undefined>>;
}

export const Header = ({
	title,
	navigation,
	setProductModal,
	setSelectedProduct,
}: Props) => {
	const { loggedUser } = useContext<AuthStore>(AuthContext);

	return (
		<View
			style={{
				height: 60,
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#333',
				marginBottom: 16,
			}}>
			<View style={{ position: 'absolute', left: 0 }}>
				{loggedUser.id !== -1 && (
					<TouchableOpacity onPress={() => navigation.openDrawer()}>
						<NativeImage
							file={Images[Files.hamburger]}
							style={{
								height: 32,
								width: 32,
								resizeMode: 'contain',
								tintColor: 'white',
								margin: 16,
							}}
						/>
					</TouchableOpacity>
				)}
			</View>
			<Text style={{ color: 'white' }}>{title}</Text>
			<View style={{ position: 'absolute', right: 0 }}>
				{setProductModal && (
					<TouchableOpacity
						onPress={() => {
							setProductModal(true);
							setSelectedProduct!({
								name: '',
								description: '',
								merchantId: loggedUser.id,
								price: 0,
								type: ProductType.CLOTHINGS,
							} as Product);
						}}>
						<NativeImage
							file={Images[Files.add]}
							style={{
								height: 32,
								width: 32,
								resizeMode: 'contain',
								tintColor: 'white',
								margin: 16,
							}}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};
