import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from "@angular/material/dialog";
import { tap } from "rxjs";
import { User } from "../../interfaces/user.interface";

import { UsersListFacade } from "../../data-access/+state/users.facade";

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
  public usersListFacade = inject(UsersListFacade);
  public users$ = this.usersListFacade.users$;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog
  ) {
    this.usersListFacade.getUsers();
  }

  openAddEditUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      data: user,
    });

    dialogRef.afterClosed()
      .pipe(
        tap(result => {
          if (result) {
            result.id ? this.usersListFacade.editUser(result, result.id) :  this.usersListFacade.createUser(result);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
