import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WidgetService } from 'src/app/dashboard-engine/services/widget/widget.service';

@Component({
  selector: 'app-export-files-to',
  templateUrl: './export-files-to.component.html',
  styleUrls: ['./export-files-to.component.css']
})
export class ExportFilesToComponent implements OnInit, AfterViewInit {
 
  iconFromDashboard: boolean;
  constructor(private widgetService: WidgetService) { }

  ngOnInit(): void {
    this.iconFromDashboard = false
  }

  ngAfterViewInit(){
    // if(this.widgetService.iconFromDashboard){
    //   this.iconFromDashboard = true
    // }
  }
  
  @Output() exportedTo = new EventEmitter();
  // Export file to
  downloadFile(exportedTo) {
    this.exportedTo.emit(exportedTo);
  }

}
