import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'analytic-management-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'analytic-management';
  topMenu: any;
  sidebarMenuFlag: any;
  sideMenuBarStatus: boolean;
  mySubscription;
  constructor(private router: Router){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
  // Trick the Router into believing it's last link wasn't previously loaded
      this.router.navigated = false;
      }
    }); 

  //reading topMenu and sidebar menu flags from session storage
  this.topMenu = JSON.parse(sessionStorage.getItem("topMenu"));
  this.sidebarMenuFlag = JSON.parse(sessionStorage.getItem("sidebarMenu"));
  //if no theme selected,means theme don;t have any preference for menu,we are making side bar as true here.
  if (this.sidebarMenuFlag == undefined && this.topMenu == undefined) {
    this.sidebarMenuFlag = true;
  }
  }

  ngOnDestroy(){
    if (this.mySubscription) {
     this.mySubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    const value = sessionStorage.getItem('sideMenuBarStatus');
    if (value === 'closed') {
      this.sideMenuBarStatus = true;
    }
    else if (value === 'open') {
      this.sideMenuBarStatus = false;
    }
  }
}
