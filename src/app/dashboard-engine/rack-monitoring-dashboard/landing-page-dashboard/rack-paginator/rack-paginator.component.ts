import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rack-paginator',
  templateUrl: './rack-paginator.component.html',
  styleUrls: ['./rack-paginator.component.css']
})
export class RackPaginatorComponent implements OnInit {

  constructor() { }
  current_page = 1;
  records_per_page = 2;
  ngOnInit(): void {
    this.changePage(1);
  }

  objJson = [
    { adName: "AdName 1" },
    { adName: "AdName 2" },
    { adName: "AdName 3" },
    { adName: "AdName 4" },
    { adName: "AdName 5" },
    { adName: "AdName 6" },
    { adName: "AdName 7" },
    { adName: "AdName 8" },
    { adName: "AdName 9" },
    { adName: "AdName 10" }
  ];
  prevPage() {
    if (this.current_page > 1) {
      this.current_page--;
      this.changePage(this.current_page);
    }
  }

  nextPage() {
    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.changePage(this.current_page);
    }
  }

  changePage(page) {
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    let listing_table = document.getElementById("listingTable");
    let page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > this.numPages()) page = this.numPages();

    listing_table.innerHTML = "";

    for (let i = (page - 1) * this.records_per_page; i < (page * this.records_per_page); i++) {
      listing_table.innerHTML += this.objJson[i].adName + "<br>";
    }
    page_span.innerHTML = page;

    if (page == 1) {
      btn_prev.style.visibility = "hidden";
    } else {
      btn_prev.style.visibility = "visible";
    }

    if (page == this.numPages()) {
      btn_next.style.visibility = "hidden";
    } else {
      btn_next.style.visibility = "visible";
    }
  }

  numPages() {
    return Math.ceil(this.objJson.length / this.records_per_page);
  }

  // window.onload = function () {
  //   this.changePage(1);
  // };

}
