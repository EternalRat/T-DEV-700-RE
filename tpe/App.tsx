import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MessageWrapper } from './src/domains/Message/Context';
import { Message } from './src/domains/Message/Message';
import { WebsocketWrapper } from './src/domains/Websocket/Websocket';
import { CashManagerRouter } from './src/router/Routes';

function App() {
	return (
		<SafeAreaProvider
			style={{
				backgroundColor: '#0c0a0a',
				flex: 1,
				minHeight: '100%',
				height: '100%',
			}}>
			<NavigationContainer>
				<MessageWrapper>
					<WebsocketWrapper>
						<GestureHandlerRootView
							style={{
								flex: 1,
								minHeight: '100%',
								height: '100%',
							}}>
							<CashManagerRouter />
						</GestureHandlerRootView>
						<Message />
					</WebsocketWrapper>
				</MessageWrapper>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default App;
