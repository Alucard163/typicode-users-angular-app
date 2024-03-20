import { Component, Inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";

import { UsersService } from "../../../services/users.service";
import { User } from "../../../interfaces/user.interface";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.sass'
})
export class CreateEditUserComponent {
  userForm: FormGroup;
  isEdit: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CreateEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: { user: User; isEdit: boolean },
    private formBuilder: FormBuilder,
    private readonly UsersService: UsersService
  ) {
    this.isEdit = this.data.isEdit || false;

    this.userForm = this.formBuilder.group({
      name: [this.data?.user?.name || '', Validators.required],
      username: [this.data?.user?.username || '', Validators.required],
      id: [
        this.data?.user?.id || this.UsersService.users.length + 1,
        Validators.required
      ],
      email: [this.data?.user?.email || '', [Validators.required, Validators.email]]
    });

    if (this.isEdit) {
      this.userForm.patchValue({
        name: this.data.user.name,
        username: this.data.user.username,
        email: this.data.user.email
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  onSaveClick(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      this.dialogRef.close(userData);
    }
  }

}
