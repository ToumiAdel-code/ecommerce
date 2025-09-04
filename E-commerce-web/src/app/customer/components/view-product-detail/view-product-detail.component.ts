import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.scss']
})
export class ViewProductDetailComponent implements OnInit {

  productId!: number;
  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];
  similarProducts: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit() {
    // Écouter les changements de route
    this.activatedRoute.params.subscribe(params => {
      this.productId = +params['productId'];
      this.getProductDetailById();
    });
  }

  getProductDetailById() {
    this.customerService.getProductDetailById(this.productId).subscribe(res => {
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;

      this.FAQS = res.faqDtoList;
      this.reviews = res.reviewDtoList.map(element => ({
        ...element,
        processedImg: 'data:image/png;base64,' + element.returnedImg
      }));

      this.getSimilarProducts(this.product.categoryId);
    });
  }

  getSimilarProducts(categoryId: number) {
    this.similarProducts = [];
    this.customerService.getSimilarProducts(categoryId).subscribe(res => {
      res.forEach((element: any) => {
        element.processedImg = 'data:image/png;base64,' + element.byteImg;
        this.similarProducts.push(element);
      });
    });
  }

  addToWishlist() {
    const wishListDto = {
      productId: this.productId,
      userId: UserStorageService.getUserId()
    };
    this.customerService.addProductToWishlist(wishListDto).subscribe(res => {
      if (res.id != null) {
        this.snackBar.open('✅ Product Added to wishlist Successfully!', 'Close', {
          duration: 5000
        });
      } else {
        this.snackBar.open("⚠️ Already in Wishlist", "ERROR", {
          duration: 5000
        });
      }
    });
  }

addToCart(productId: number) {
  this.customerService.addToCart(productId).subscribe({
    next: (res) => {
      this.snackbar.open("Product added to cart Successfully!", "Close", { duration: 5000 });
    },
    error: (err) => {
      console.error(err);
      this.snackbar.open("Error adding product to cart!", "Close", { duration: 5000 });
    }
  });
}


}
