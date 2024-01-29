import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})
export class CardContainerComponent implements OnInit {

  constructor() { }

  @Input()  green;
  @Input()  aqua;
  @Input() extraCard;
  ngOnInit(): void {
  }

}
