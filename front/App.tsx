import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from './src/domains/message/Message';
import { CashManagerRouter } from './src/router/Routes';
import { MessageWrapper } from './src/domains/message/Context';
import { ProductWrapper } from './src/domains/products/Products';

function App(): React.JSX.Element {
	return (
		<SafeAreaView>
			<NavigationContainer>
				<MessageWrapper>
					<ProductWrapper>
						<GestureHandlerRootView
							style={{
								flex: 1,
							}}>
							<CashManagerRouter />
						</GestureHandlerRootView>
						<Message />
					</ProductWrapper>
				</MessageWrapper>
			</NavigationContainer>
		</SafeAreaView>
	);
}

export default App;
