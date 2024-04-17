import { Component, Inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";

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
  constructor(
    private dialogRef: MatDialogRef<CreateEditUserComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private readonly user?: User,
  ) {

    this.userForm = this.formBuilder.group({
      name: [this.user?.name || '', Validators.required],
      username: [this.user?.username || '', Validators.required],
      id: [this.user?.id || ''],
      email: [this.user?.email || '', [Validators.required, Validators.email]]
    });

    if (this.isEdit) {
      const modifiedUser = {...this.user};
      this.userForm.patchValue(modifiedUser);
    }
  }

  get isEdit(): boolean {
    return Boolean(this.user);
  }

  onDialogCloseClick(user?: User): void {
    this.dialogRef.close(user);
  }

  onValidateField(field: string): boolean {
    return this.userForm.controls[field].invalid && this.userForm.controls[field].touched;
  }

}
