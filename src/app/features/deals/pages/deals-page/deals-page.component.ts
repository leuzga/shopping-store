import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './deals-page.component.html',
  styleUrl: './deals-page.component.css',
})
export class DealsPageComponent implements OnInit {
  isVisible = false;

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
