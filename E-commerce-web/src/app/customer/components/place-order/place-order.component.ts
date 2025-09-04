import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {

  orderForm!: FormGroup;
  deliveryMethods = [
    { value: 'standard', label: 'Standard (3-5 jours)' },
    { value: 'express', label: 'Express (1-2 jours)' },
    { value: 'pickup', label: 'Point relais' }
  ];

  cartItems: any[] = [];
  order: any = {
    amount: 0,
    totalAmount: 0,
    couponName: null,
    couponCode: null
  };

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      address: [null, Validators.required],
      orderDescription: [null],
      deliveryMethod: ['standard', Validators.required]
    });

    // Charger le panier de l'utilisateur
    this.customerService.getCartByUserId().subscribe(res => {
      this.cartItems = res;

      // Calcul du total
      this.order.amount = this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
      this.order.totalAmount = this.order.amount; // si pas de coupon
    });
  }

  placeOrder(): void {
    if (this.orderForm.invalid) return;

    const payload = {
      ...this.orderForm.value,
      items: this.cartItems
    };

    this.customerService.placeOrder(payload).subscribe({
      next: res => {
        if (res.id != null) {
          this.snackBar.open('✅ Commande passée avec succès !', 'Fermer', { duration: 5000 });
          this.router.navigateByUrl('/'); // redirection vers page d'accueil
        } else {
          this.snackBar.open('⚠️ Une erreur est survenue, veuillez réessayer.', 'Fermer', { duration: 5000 });
        }
      },
      error: () => {
        this.snackBar.open('⚠️ Impossible de passer la commande.', 'Fermer', { duration: 5000 });
      }
    });
  }

}
