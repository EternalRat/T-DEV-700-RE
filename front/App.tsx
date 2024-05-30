import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthWrapper } from './src/domains/authentification/Auth';
import { CartWrapper } from './src/domains/userCart/Cart';
import { MessageWrapper } from './src/domains/message/Context';
import { Message } from './src/domains/message/Message';
import { ProductWrapper } from './src/domains/product/Products';
import { WebsocketWrapper } from './src/domains/socket/Websocket';
import { CashManagerRouter } from './src/router/Routes';

function App(): React.JSX.Element {
	return (
		<SafeAreaView
			style={{
				backgroundColor: '#0c0a0a',
				flex: 1,
				minHeight: '100%',
				height: '100%',
			}}>
			<NavigationContainer>
				<MessageWrapper>
					<ProductWrapper>
						<CartWrapper>
							<WebsocketWrapper>
								<AuthWrapper>
									<GestureHandlerRootView
										style={{
											flex: 1,
											minHeight: '100%',
											height: '100%',
										}}>
										<CashManagerRouter />
									</GestureHandlerRootView>
									<Message />
								</AuthWrapper>
							</WebsocketWrapper>
						</CartWrapper>
					</ProductWrapper>
				</MessageWrapper>
			</NavigationContainer>
		</SafeAreaView>
	);
}

export default App;
