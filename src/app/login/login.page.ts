import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core'; 
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class LoginPage implements OnInit {
  user: any;

  constructor(private router: Router) {}

  ngOnInit() {
    if (Capacitor.getPlatform() === 'web') {
      GoogleAuth.initialize({
        clientId: '898105310904-28gnb2p119q7pof1ebuf1dhg0en6db1u.apps.googleusercontent.com',  // Tu Client ID
        scopes: ['profile', 'email'],
      })
      .then(() => console.log('GoogleAuth initialized successfully'))
      .catch(err => console.error('Error initializing GoogleAuth', err));
    }
  }

  async onClickIngresar() {
    this.router.navigate(['/principal']);
    console.log('Inicio de sesión estándar');
  }

  async onGoogleSignIn() {
    try {
      const user = await GoogleAuth.signIn();
      console.log('Usuario autenticado con Google:', user);
      alert(`Bienvenido, ${user.name}`);
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error.message);
      if (error.message.includes('signIn')) {
        alert('Parece que GoogleAuth no está inicializado correctamente.');
      } else {
        alert('Ocurrió un error. Por favor, intenta nuevamente.');
      }
    }
  }
}  