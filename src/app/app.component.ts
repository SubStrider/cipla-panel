import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router, NavigationEnd } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.initAuthListener();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0,0)

      if($('.main-panel')){
        $('.main-panel').scrollTop(0)
      }
    });
  }
}
