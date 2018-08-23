import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../category.service';
import { AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;

  categoriesRef: AngularFireList<any>;

  constructor(categoryService: CategoryService, private productService: ProductService) {
    this.categoriesRef = categoryService.getCategories();
    // Use snapshotChanges().map() to store the key
    this.categories$ = this.categoriesRef.snapshotChanges().pipe(
      map(categories$ =>
        categories$.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  save(product) {
    // console.log(product);
    this.productService.create(product);
  }

  ngOnInit() {
  }

}
