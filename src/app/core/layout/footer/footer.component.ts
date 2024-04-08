import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  today: number = Date.now();
}
