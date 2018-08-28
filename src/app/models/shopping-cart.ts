import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
    // items: ShoppingCartItem[];
    constructor(public items: ShoppingCartItem[]) {}

    get totalItemsCount() {
        let count = 0;
        // tslint:disable-next-line:forin
        for (const productId in this.items) {
            count += this.items[productId].quantity;
        }
        return count;
    }
}
