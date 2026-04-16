import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'lib-category-card',
    templateUrl: './category-card.component.html',
    styleUrls: ['./category-card.component.scss'],
    standalone: false
})
export class CategoryCardComponent implements OnInit {

  // TODO: Create interface for type check
  // TODO: replace mat-icon
  @Input() category: any;

  constructor() { }

  ngOnInit() {
    console.log(this.category);
  }

}

