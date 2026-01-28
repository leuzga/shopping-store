import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  isVisible = false;

  ngOnInit() {
    // Trigger fade-in animation after component is rendered
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
