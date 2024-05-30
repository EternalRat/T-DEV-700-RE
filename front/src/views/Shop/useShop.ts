import { useContext, useMemo } from 'react';

import { AuthContext } from '../../domains/Auth/Auth';
import { AuthStore } from '../../domains/Auth/types';
import { CartContext } from '../../domains/Cart/Cart';
import { CartStore } from '../../domains/Cart/types';
import { ProductContext } from '../../domains/Products/Products';
import { ProductStore } from '../../domains/Products/types';

export const useShop = () => {
	const { productStore } = useContext<ProductStore>(ProductContext);
	const { loggedUser } = useContext<AuthStore>(AuthContext);
	const { cartStore } = useContext<CartStore>(CartContext);
	const totalPrice = useMemo(() => {
		return cartStore.reduce((acc, product) => acc + product.price, 0);
	}, [cartStore]);

	return { loggedUser, totalPrice, productStore };
};
