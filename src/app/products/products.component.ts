import { snapshotChanges } from 'angularfire2/database';
import { ShoppingCartService } from './../shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  // products: Product[];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart: any;
  subscription: Subscription;

  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private shoppingCartService: ShoppingCartService) {

    productService.getAll().snapshotChanges()
      .pipe(
        map(products =>
          products.map(c => ({
            key: c.payload.key,
            ...c.payload.val() as Product
          }))
        )
      )
      .pipe(
        switchMap(products => {
          this.products = products;
          return route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get('category');

          this.filteredProducts = (this.category) ?
            this.products.filter(p => p.category === this.category) :
            this.products;
        });


  }

  async ngOnInit() {
   this.subscription = (await this.shoppingCartService.getCart())
    .snapshotChanges()
    .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
