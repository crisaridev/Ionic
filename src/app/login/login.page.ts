import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadChildren, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from '../api/login.service';
import { LoginRequest, LoginResponse } from '../model/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;


  // eslint-disable-next-line max-len
  constructor(private fb: FormBuilder, private loginService: LoginService, private alert: AlertController, private loading: LoadingController
  ,private router: Router) {
    this.formLogin = this.fb.group({
      username: ['',[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['',[Validators.required, Validators.minLength(2)]],
    });
  }

  async loginClick(): Promise<void>{
    const data = this.formLogin.value as LoginRequest;

    const loadingView = await this.loading.create({
      message: 'Cargando...',
    });

    loadingView.present();

    this.loginService.login(data).subscribe({
      next: (response: LoginResponse) => {
        //Bloque donde se recibe la respuesta de HTTP
        console.log(response);
        loadingView.dismiss();

        this.router.navigate(['menu']);
      },
      error: async (err) => {
        loadingView.dismiss();
        const alert = await this.alert.create({
          header: 'Error',
          message: err.error.error,
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    });
  }

  ngOnInit() {
  }

}
