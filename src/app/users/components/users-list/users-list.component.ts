import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from "@angular/material/dialog";
import { Observable, tap } from "rxjs";
import { User } from "../../interfaces/user.interface";

import { UsersApiService } from "../../services/users-api.service";
import { UsersService } from "../../services/users.service";
import { LocalStorageService } from "../../services/local-storage.service";

import { UserCardComponent } from "../user-card/user-card/user-card.component";
import { CreateEditUserComponent } from "../modals/create-edit-user/create-edit-user.component";
import { LOCAL_STORAGE_USERS_KEY } from "../../../core/constants/storage-keys.constant";

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
  public users: Observable<User[]> = this.usersService.getUsers();
  private readonly destroyRef = inject(DestroyRef);
  constructor(
    public usersService: UsersService,
    private readonly usersApiService: UsersApiService,
    private readonly localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
    const storedData = this.localStorageService.getItem(LOCAL_STORAGE_USERS_KEY);

    if (storedData) {
      this.usersService.setUsers(JSON.parse(storedData));
    } else {
      this.usersApiService.getUsers()
        .pipe(
          tap((users: User[]) => this.usersService.setUsers(users)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  openAddEditUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      data: user,
    });

    dialogRef.afterClosed()
      .pipe(
        tap(result => {
          if (result) {
            this.usersService.editUser(result);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
