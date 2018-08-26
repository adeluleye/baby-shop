import { Product } from './../../models/product';
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
  products: Product[] = [];
  filteredProducts: any[];
  subscription: Subscription;

  // tableResource: DataTableResource<Product>;
  // items: Product[];
  // itemCount: number;

  constructor(private productService: ProductService) {
    // this.products$ = this.productService.getAll();
    this.subscription = this.productService.getAll().snapshotChanges()
      .pipe(
        map(products =>
          products.map(c => ({
            key: c.payload.key,
            ...c.payload.val() as Product }))
        )
      )
      .subscribe(products => {
        this.filteredProducts = this.products = products;
        // this.initializeTable(products);

      });
  }

  // map(item$ =>
  //   item$.map(c => {
  //       const data = c.payload.val() as Product;
  //       const id = c.payload.key;
  //       return { id, ...data };
  //   })
  // private initializeTable(products: Product[]) {
  //   this.tableResource = new DataTableResource(products);
  //   this.tableResource.query({ offset: 0 })
  //     .then(items => this.items = items);
  //   this.tableResource.count()
  //     .then(count => this.itemCount = count);
  // }

  // reloadItems(params) {
  //   if (!this.tableResource) {
  //     return;
  //   }

  //   this.tableResource.query(params)
  //     .then(items => this.items = items);
  // }

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
