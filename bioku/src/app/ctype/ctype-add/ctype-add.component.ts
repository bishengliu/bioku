import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-ctype-add',
  templateUrl: './ctype-add.component.html',
  styleUrls: ['./ctype-add.component.css']
})
export class CtypeAddComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // this.router.navigate(['/ctype']);
  }

}
