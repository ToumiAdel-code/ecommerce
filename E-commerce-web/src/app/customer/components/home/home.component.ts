import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  topProducts: any[] = [];
  bestSellers: any[] = [];
  categories: string[] = ['Électronique','Mode','Maison','Beauté'];
  heroImage: string = 'https://images.unsplash.com/photo-1609948655374-9f44e093e4cd?auto=format&fit=crop&w=1350&q=80';
  newsletterForm!: FormGroup;

  constructor(private customerService: CustomerService, private snackbar: MatSnackBar, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadProducts();
    this.newsletterForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  loadProducts(): void {
    this.customerService.getAllProducts().subscribe(res => {
      this.products = res.map(p => ({
        ...p,
        processedImg: 'data:image/jpeg;base64,' + p.byteImg
      }));
      this.topProducts = this.products.slice(0, 4);
      this.bestSellers = this.products.slice(4, 8);
    });
  }

  addToCart(id: any): void {
    this.customerService.addToCart(id).subscribe(() => {
      this.snackbar.open('Produit ajouté au panier!', 'Fermer', { duration: 3000 });
    });
  }

  subscribeNewsletter(): void {
    if(this.newsletterForm.valid){
      this.snackbar.open('Merci pour votre inscription à la newsletter!', 'Fermer', { duration: 3000 });
      this.newsletterForm.reset();
    }
  }
}
