import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { WidgetService } from 'src/app/dashboard-engine/services/widget/widget.service';
import { ShareddataService } from 'src/app/dashboard-engine/shared/shareddata.service';

@Component({
  selector: 'app-rack-container',
  templateUrl: './rack-container.component.html',
  styleUrls: ['./rack-container.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class RackContainerComponent implements OnInit {

  constructor(private router:Router,private sharedDataService: ShareddataService) { }

  ngOnInit(): void {
    
  }

}
