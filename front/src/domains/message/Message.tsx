import React, { useContext, useEffect } from 'react';

import { MessageContext } from './Context';
import { SnackBar } from './Snackbar/SnackBar';
import { DisplayMode } from './Snackbar/type';
import { ActionTypeMessage } from './types';

let callBack: NodeJS.Timeout | null = null;

export const Message = () => {
	const { message, dispatch } = useContext(MessageContext);

	useEffect(() => {
		if (message.duration > 0) {
			callBack = setTimeout(() => {
				dispatch({ type: ActionTypeMessage.CLOSE_MESSAGE });
				callBack = null;
			}, message.duration);
		} else if (callBack) {
			clearTimeout(callBack);
			callBack = null;
		}
	}, [message.duration]);

	const onPressSnackbar = () => {
		dispatch({ type: ActionTypeMessage.CLOSE_MESSAGE });
	};

	return (
		<SnackBar
			isVisible={message.message.length > 0}
			text={message.message}
			type={message.type}
			onPress={onPressSnackbar}
			mode={DisplayMode.BACKGROUND_COLOR}
			colorStyle={message.colorStyle}
		/>
	);
};
