import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products$;

  constructor(private productService: ProductService) {
    // this.products$ = this.productService.getAll();
    this.products$ = this.productService.getAll().snapshotChanges().pipe(
      map(products =>
        products.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  ngOnInit() {
  }

}
