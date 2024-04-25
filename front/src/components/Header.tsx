import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList, Routes } from '../router/routesName';
import NativeImage from '@chouicgames/react-native-images-to-native-images';
import Images, { Files } from '../../images/Images';

interface Props {
	title: string;
	navigation: DrawerNavigationProp<RootStackParamList, Routes>;
}

export const Header = ({ title, navigation }: Props) => {
	return (
		<View
			style={{
				height: 60,
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
                backgroundColor: '#333',
                marginBottom: 16
			}}>
			<View style={{ position: 'absolute', left: 0 }}>
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
			</View>
			<Text>{title}</Text>
		</View>
	);
};
