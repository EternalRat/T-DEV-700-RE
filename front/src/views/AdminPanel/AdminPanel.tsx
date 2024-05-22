import { useContext } from 'react';
import { ProductContext } from '../../domains/Products/Products';
import { ProductStore } from '../../domains/Products/types';

export const AdminPanel = () => {
	const { productStore } = useContext<ProductStore>(ProductContext);

	return <></>;
};
