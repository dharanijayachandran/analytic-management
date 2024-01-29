import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rack-card-container',
  templateUrl: './rack-card-container.component.html',
  styleUrls: ['./rack-card-container.component.css']
})
export class RackCardContainerComponent implements OnInit {

  constructor() { }
 @Input() widgets;
  ngOnInit(): void {
  }

}
