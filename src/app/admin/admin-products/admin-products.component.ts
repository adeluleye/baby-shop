import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../product.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: any[];
  filteredProducts: any[];
  subscription: Subscription;

  constructor(private productService: ProductService) {
    // this.products$ = this.productService.getAll();
    this.subscription = this.productService.getAll().snapshotChanges()
      .pipe(
        map(products =>
          products.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(products => this.filteredProducts = this.products = products);
    /*.pipe(
      map(products =>
        products.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );*/
  }

  filter(query: string) {
    // console.log(query);
    this.filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
