import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebsocketWrapper } from './src/domains/Websocket/Websocket';
import { CashManagerRouter } from './src/router/Routes';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Message } from './src/domains/Message/Message';

function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
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
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default App;
