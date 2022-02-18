import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: [ './about.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
