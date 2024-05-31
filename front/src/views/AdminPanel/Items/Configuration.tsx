import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { SettingsContext } from '../../../domains/settings/Settings';
import { SettingsStore } from '../../../domains/settings/types';
import { CustomButton } from '../../../domains/templating/buttons/Button';
import { Input } from '../../../domains/templating/input/TextInput';
import { Label } from '../../../domains/templating/texts/Label';

const PropertyName: Record<string, string> = {
	maxProduct: 'Maximum de produit dans le panier',
};

export const Configuration = () => {
	const { settings, updateSettings } =
		useContext<SettingsStore>(SettingsContext);
	const [newSettings, setSettings] = useState(settings);

	useEffect(() => {
		setSettings(settings);
	}, [settings]);

	return (
		<View style={{ margin: 16, gap: 16 }}>
			{newSettings.map(setting => {
				return (
					<View key={setting.id}>
						<Label>{PropertyName[setting.property] ?? ''}</Label>
						<Input
							value={setting.value.toString()}
							updateText={e => {
								setSettings(
									newSettings.map(s => {
										if (s.id === setting.id) {
											s.value =
												e.nativeEvent.text.length > 0
													? parseInt(
															e.nativeEvent.text
													  )
													: 0;
										}
										return s;
									})
								);
							}}
							keyboardType='numeric'
							width='100%'
							style={{ width: '100%' }}
						/>
					</View>
				);
			})}
			<CustomButton
				style={{
					backgroundColor: 'white',
					height: 40,
					width: 180,
					display: 'flex',
					alignSelf: 'center',
					justifyContent: 'center',
					borderRadius: 5,
				}}
				textStyle={{
					color: 'black',
					textAlign: 'center',
				}}
				text='Sauvegarder'
				onClick={async () => {
					for (const setting of settings) {
						await updateSettings(
							setting.id,
							setting.property,
							setting.value
						);
					}
				}}
			/>
		</View>
	);
};
