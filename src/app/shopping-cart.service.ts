import { Product } from './models/product';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {


  constructor(private db: AngularFireDatabase) { }

  private create() {
    return this.db.list('shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart() {
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-cart/' + cartId);
  }

  // async getCart() {
  //   const cartId = await this.getOrCreateCartId();
  //   return this.db.object('/shopping-cart/' + cartId).snapshotChanges()
  //     .subscribe(carts => {
  //       console.log(carts);
  //     });
  // }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');
    if (cartId) { return cartId; }

    const result = await this.create();
    localStorage.setItem('cartId', result.key);

    return result.key;

  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.key);

    item$.snapshotChanges()
      .pipe(take(1))
      .subscribe(item => {
        item$.update({ product: product, quantity: (item.payload.child('quantity').val() || 0) + change });
    });
  }

}
