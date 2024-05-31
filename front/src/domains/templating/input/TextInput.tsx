import NativeImage from '@chouicgames/react-native-images-to-native-images';
import { File } from '@chouicgames/react-native-images-to-native-images/src/types';
import {
	DimensionValue,
	KeyboardTypeOptions,
	NativeSyntheticEvent,
	StyleProp,
	StyleSheet,
	TextInput,
	TextInputChangeEventData,
	TextStyle,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Keyboard } from 'react-native';

import { Color } from '../style';

interface Props {
	value: string;
	style?: StyleProp<TextStyle>;
	imageStyle?: any;
	updateText: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
	icon?: File;
	type?:
		| 'none'
		| 'URL'
		| 'addressCity'
		| 'addressCityAndState'
		| 'addressState'
		| 'countryName'
		| 'creditCardNumber'
		| 'emailAddress'
		| 'familyName'
		| 'fullStreetAddress'
		| 'givenName'
		| 'jobTitle'
		| 'location'
		| 'middleName'
		| 'name'
		| 'namePrefix'
		| 'nameSuffix'
		| 'nickname'
		| 'organizationName'
		| 'postalCode'
		| 'streetAddressLine1'
		| 'streetAddressLine2'
		| 'sublocality'
		| 'telephoneNumber'
		| 'username'
		| 'password'
		| 'newPassword'
		| 'oneTimeCode'
		| undefined;
	secured?: boolean;
	width?: DimensionValue;
	keyboardType?: KeyboardTypeOptions;
}

export const Input = ({
	value,
	style,
	imageStyle,
	updateText,
	icon,
	keyboardType,
	type = 'none',
	secured = false,
	width = '100%',
}: Props) => {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					width: width,
					paddingTop: 5,
				}}>
				{icon && (
					<View
						style={{
							width: 30,
							height: 40,
							backgroundColor: Color.GREY,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<NativeImage
							file={icon}
							style={{
								width: 18,
								height: '100%',
								resizeMode: 'contain',
								tintColor: Color.BLACK,
								...imageStyle,
							}}
						/>
					</View>
				)}
				<TextInput
					keyboardType={keyboardType}
					textContentType={type}
					style={[styles.input, style]}
					value={value}
					onChange={updateText}
					secureTextEntry={secured}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	input: {
		fontSize: 14,
		borderColor: Color.BORDER,
		borderWidth: 1,
		width: '85%',
		height: 39.5,
		paddingLeft: 8,
		left: -1,
		color: '#FFFFFF',
	},
});
