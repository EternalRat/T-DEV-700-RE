import { useContext, useMemo } from 'react';

import { AuthContext } from '../../domains/authentification/Auth';
import { AuthStore } from '../../domains/authentification/types';
import { ProductContext } from '../../domains/product/Products';
import { ProductStore } from '../../domains/product/types';
import { CartContext } from '../../domains/userCart/Cart';
import { CartStore } from '../../domains/userCart/types';

export const useShop = () => {
	const { productStore } = useContext<ProductStore>(ProductContext);
	const { loggedUser } = useContext<AuthStore>(AuthContext);
	const { cartStore } = useContext<CartStore>(CartContext);
	const totalPrice = useMemo(() => {
		return cartStore.reduce((acc, product) => acc + product.price, 0);
	}, [cartStore]);

	return { loggedUser, totalPrice, productStore };
};
