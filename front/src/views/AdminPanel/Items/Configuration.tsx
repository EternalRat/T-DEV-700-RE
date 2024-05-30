import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { SettingsContext } from '../../../domains/settings/Settings';
import { SettingsStore } from '../../../domains/settings/types';
import { CustomButton } from '../../../domains/templating/buttons/Button';
import { Input } from '../../../domains/templating/input/TextInput';
import { Label } from '../../../domains/templating/texts/Label';

export const Configuration = () => {
	const { settings, updateSettings } =
		useContext<SettingsStore>(SettingsContext);
	const [newSettings, setSettings] = useState(settings);

	useEffect(() => {
		setSettings(settings);
	}, [settings]);

	return (
		<View style={{ margin: 16 }}>
			{newSettings.map(setting => {
				return (
					<View key={setting.id}>
						<Label>{setting.property}</Label>
						<Input
							value={setting.value.toString()}
							updateText={e => {
								setSettings(
									newSettings.map(s => {
										if (s.id === setting.id) {
											s.value = parseInt(
												e.nativeEvent.text
											);
										}
										return s;
									})
								);
							}}
							keyboardType='numeric'
						/>
					</View>
				);
			})}
			<CustomButton
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
