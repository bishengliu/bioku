
import {FormControl, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomFormValidators{
    constructor(){}

    //validator username
    usernameValidator() {
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            //let username_pattern = new RegExp("^([a-zA-Z]+[0-9_-]*){6,}$");
            if(!control.value.match(/^([a-zA-Z]+[0-9_-]*){6,}$/)){
                return {usernameInvalid: true}
            }
        }
    }
    //validate password
    passwordValidator(){
        return (control: FormControl): {[s: string]: Boolean}=>
        {
            //let password_pattern = new RegExp("^(?=.*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9]).{8,}$");
            if(!control.value.match(/(?=.*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9]).{8,}$/)){
                return {passwordInvalid: true}
            }
        }
    }

    //human_name
    humanNameValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            let human_name_pattern = new RegExp("^[a-zA-Z]+([a-zA-Z]+[0-9_\\-.\\s]*){1,}$");
            if(!control.value.match(human_name_pattern)){
                return { humanNameInvalid: true}
            }
        }
    }

    //filename
    filenameValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            //not reuired
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            let filename_pattern = new RegExp("^([a-zA-Z]+[0-9_\\-.\\s&%$#@()\\[\\]\\|\\^]*){4,}$");
            if(!control.value.match(filename_pattern)){
                return { filenameInvalid: true}
            }
        }
    }
    

    //telephone, need to be improved
    telephoneValidator(){
        return (control: FormControl): {[s: string]: Boolean} => 
        {
            if(!control.value || control.value.length === 0 || control.value ==""){
                return null
            }
            let telephone_pattern = new RegExp("^([0-9]){4,}$");
            if(!control.value.match(telephone_pattern)){
                return { telephoneInvalid: true}
            }
        }
    }
}

