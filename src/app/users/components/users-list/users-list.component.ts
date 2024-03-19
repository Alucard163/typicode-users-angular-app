import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from "@angular/material/dialog";
import { first, Observable, tap } from "rxjs";
import { User } from "../../interfaces/user.interface";

import { UsersApiService } from "../../services/users-api.service";
import { UsersService } from "../../services/users.service";
import { LocalStorageService } from "../../services/local-storage.service";

import { UserCardComponent } from "../user-card/user-card/user-card.component";
import { CreateEditUserComponent } from "../modals/create-edit-user/create-edit-user.component";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    UserCardComponent,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.sass'
})
export class UsersListComponent {
  public users: Observable<User[]> = this.UsersService.getUsers();
  constructor(
    public UsersService: UsersService,
    private readonly UsersApiService: UsersApiService,
    private readonly localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
    const storedData = this.localStorageService.getItem('users');

    if (storedData) {
      this.UsersService.setUsers(JSON.parse(storedData));
    } else {
      this.UsersApiService.getUsers()
        .pipe(
          first(),
          tap((users: User[]) => this.UsersService.setUsers(users)),
        )
        .subscribe();
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed()
      .pipe(
        first(),
        tap((result: User) => {
          if (result) {
            this.UsersService.addUser(result);
          }
        })
      )
      .subscribe();
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '400px',
      data: { isEdit: true, user }
    });

    dialogRef.afterClosed()
      .pipe(
        first(),
        tap(result => {
          if (result) {
            this.UsersService.editUser(result);
          }
        })
      )
      .subscribe();
  }
}
