import { useEffect, useState } from 'react';
import { getSettings } from '../../../api/settings.api';

interface Settings {
	id: number;
	property: string;
	value: number;
	merchantId: number;
}

export const Configuration = () => {
	const [settings, setSettings] = useState<Settings[]>([]);

	useEffect(() => {
		if (settings.length > 0) return;
		getSettings().then(response => {
			const { data } = response;
			setSettings(data);
		});
	}, []);
};
