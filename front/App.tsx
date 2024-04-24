import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from './src/domains/message/Message';
import { CashManagerRouter } from './src/router/Routes';
import { MessageWrapper } from './src/domains/message/Context';
import { ProductWrapper } from './src/domains/products/Products';
import { CartWrapper } from './src/domains/Cart/Cart';
import { MerchantWrapper } from './src/domains/merchants/Merchants';
import { WebsocketWrapper } from './src/domains/Websocket/Websocket';

function App(): React.JSX.Element {
	return (
		<SafeAreaView>
			<NavigationContainer>
				<MessageWrapper>
					<ProductWrapper>
						<CartWrapper>
							<MerchantWrapper>
								<WebsocketWrapper>
									<GestureHandlerRootView
										style={{
											flex: 1,
										}}>
										<CashManagerRouter />
									</GestureHandlerRootView>
									<Message />
								</WebsocketWrapper>
							</MerchantWrapper>
						</CartWrapper>
					</ProductWrapper>
				</MessageWrapper>
			</NavigationContainer>
		</SafeAreaView>
	);
}

export default App;
