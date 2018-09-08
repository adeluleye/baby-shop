import { snapshotChanges } from 'angularfire2/database';
import { ShoppingCartService } from './../shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { Subscription, Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  // products: Product[];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService) {
  }

  async ngOnInit() {
   this.cart$ = await this.shoppingCartService.getCart();
    // .snapshotChanges()
    // .subscribe(cart => this.cart$ = cart);

    this.populateProducts();
  }

  private populateProducts() {
    this.productService.getAll().snapshotChanges()
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
          return this.route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
      this.products.filter(p => p.category === this.category) :
      this.products;
  }

}
