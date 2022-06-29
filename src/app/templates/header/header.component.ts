import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedataService } from 'src/app/core/sharedata.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(protected shareData: SharedataService) { }

  auto: boolean | undefined;
  subscription: Subscription | undefined;

  autoToggle() {
    this.shareData.changeBoolean(!this.auto);
  }

  ngOnInit(): void {
    this.subscription = this.shareData.currentBoolean.subscribe(boolean => this.auto = boolean);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
