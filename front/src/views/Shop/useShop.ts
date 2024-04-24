import { useContext, useMemo } from 'react';
import { CartContext } from '../../domains/Cart/Cart';
import { CartStore } from '../../domains/Cart/types';
import { MerchantContext } from '../../domains/merchants/Merchants';
import { MerchantStore } from '../../domains/merchants/types';
import { ProductContext } from '../../domains/products/Products';
import { ProductStore } from '../../domains/products/types';

export const useShop = () => {
	const { productStore } = useContext<ProductStore>(ProductContext);
	const { merchantStore } = useContext<MerchantStore>(MerchantContext);
	const { cartStore } = useContext<CartStore>(CartContext);
	const selectedMerchantName = useMemo(() => {
		if (productStore.length === 0) {
			return '';
		}
		return (
			merchantStore.find(
				merchant => merchant.id === productStore[0].merchantId
			)?.name ?? ''
		);
	}, [merchantStore, productStore]);
	const totalPrice = useMemo(() => {
		return cartStore.reduce((acc, product) => acc + product.price, 0);
	}, [cartStore]);

	return { selectedMerchantName, totalPrice, productStore };
};
