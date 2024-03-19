import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf } from "@angular/common";

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { User, UserGeo} from "../../../interfaces/user.interface";

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    NgForOf,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.sass'
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output('delete') deleteCard: EventEmitter<number> = new EventEmitter<number>();
  @Output('edit') editCard: EventEmitter<User> = new EventEmitter<User>();

  constructor() { }

  onDeleteClick(id: number): void {
    this.deleteCard.emit(id);
  }

  onEditClick(user: User): void {
    this.editCard.emit(user);
  }
}
