import { Component, OnInit } from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup, Validators} from '@angular/forms';
import{AlertService} from '../../_services/AlertService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(fb: FormBuilder, private alertService: AlertService) { 
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  onSubmit(value: any): void{
    this.alertService.success('form posted!');
    console.log(this.loginForm);
    console.log(value); 
  }

  ngOnInit() {
  }

}
