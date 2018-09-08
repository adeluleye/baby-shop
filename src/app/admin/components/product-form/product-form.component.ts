import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'shared/services/category.service';
import { AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { ProductService } from 'shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product = { };
  id;

  categoriesRef: AngularFireList<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService) {
    this.categoriesRef = categoryService.getAll();
    // Use snapshotChanges().map() to store the key
    this.categories$ = this.categoriesRef.snapshotChanges().pipe(
      map(categories$ =>
        categories$.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.getProduct(this.id).valueChanges().pipe(take(1)).subscribe(p => this.product = p);
    }
  }

  save(product) {
    if (this.id) {
      this.productService.updateProduct(this.id, product);
    } else {
      this.productService.create(product);
    }
    // console.log(product);
    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    this.productService.deleteProduct(this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnInit() {
  }

}
