import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  auto = false;

  autoToggle() {
    this.auto = !this.auto;
  }

  ngOnInit(): void {
    this.auto = false;
  }

}
