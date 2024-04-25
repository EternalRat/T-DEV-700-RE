/* eslint-disable indent */
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import {
	GestureHandlerRootView,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import { MessageType } from '../types';
import { DisplayMode, SnackBarProps } from './type';
import { configStyle, getColorStyle } from './utils';

const BASE_TOP_ERROR = -55;
const FINAL_TOP_ERROR = 56;

export const SnackBar = ({
	text,
	type,
	mode,
	isVisible,
	colorStyle,
	onPress = () => null,
}: SnackBarProps) => {
	const topValue = useSharedValue(
		mode === DisplayMode.BACKGROUND_COLOR ? BASE_TOP_ERROR : FINAL_TOP_ERROR
	);

	const snackAnimation = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: topValue.value,
				},
			],
		};
	});

	useEffect(() => {
		if (mode !== DisplayMode.BACKGROUND_COLOR) {
			return;
		}
		if (isVisible) {
			topValue.value = withSpring(BASE_TOP_ERROR, {
				mass: 1,
				stiffness: 320,
				damping: 40,
			});
		} else {
			if (topValue.value !== FINAL_TOP_ERROR) {
				topValue.value = withSpring(FINAL_TOP_ERROR, {
					mass: 1,
					stiffness: 320,
					damping: 40,
				});
			}
		}
	}, [isVisible]);

	return (
		<GestureHandlerRootView>
			{isVisible && (
				<Animated.View style={[styles.container, snackAnimation]}>
					<TouchableOpacity
						activeOpacity={1}
						style={[
							styles.snackbar,
							type === MessageType.ERROR
								? styles.error
								: styles.success,
							configStyle[mode].background(
								getColorStyle(colorStyle)
							),
						]}
						onPress={() => {
							onPress();
						}}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								flex: 1,
							}}>
							<Text
								style={
									[
										{
											paddingLeft: 0,
											paddingRight: 0,
											flexWrap: 'wrap',
											alignSelf: 'center',
											textAlign: 'center',
										},
										configStyle[mode].text(
											getColorStyle(colorStyle)
										),
									] as TextStyle
								}>
								{text}
							</Text>
						</View>
					</TouchableOpacity>
				</Animated.View>
			)}
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		zIndex: 100,
	},
	snackbar: {
		maxWidth: 350,
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 10,
	},
	success: {
		backgroundColor: 'palegreen',
		borderRadius: 5,
		zIndex: 5,
	},
	error: {
		backgroundColor: '#0c0a0a',
		borderRadius: 5,
		borderColor: '#DC0000',
		borderWidth: 2,
		color: '#fff',
		zIndex: 5,
	},
});
