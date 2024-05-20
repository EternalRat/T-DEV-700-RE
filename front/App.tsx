import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CashManagerRouter } from './src/router/Routes';
import { ProductWrapper } from './src/domains/Products/Products';
import { CartWrapper } from './src/domains/Cart/Cart';
import { WebsocketWrapper } from './src/domains/Websocket/Websocket';
import { AuthWrapper } from './src/domains/Auth/Auth';
import { MessageWrapper } from './src/domains/Message/Context';
import { Message } from './src/domains/Message/Message';

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
