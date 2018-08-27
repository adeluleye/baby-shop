import { Product } from './../models/product';
import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input('product') product: Product;
  // tslint:disable-next-line:no-input-rename
  @Input('show-actions') showActions = true;
  // tslint:disable-next-line:no-input-rename
  @Input('shopping-cart') shoppingCart;

  constructor(private shoppingCartService: ShoppingCartService) {
    if (! this.shoppingCart) {
      this.shoppingCart = {};
    }
  }

  addToCart() {
    this.shoppingCartService.addToCart(this.product);
  }

  removeFromCart() {
    this.shoppingCartService.removeFromCart(this.product);
  }

  getQuantity() {
    if (!this.shoppingCart) { return 0; }

    // const item = this.shoppingCart.items[this.product.key];
    const item = this.shoppingCart.payload.child('items').ref;

    // console.log(item);

    return item ? item.quantity : 0;

  }

}
