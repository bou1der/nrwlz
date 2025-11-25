// import { CommonModule } from "@angular/common";
// import { Component, Input, OnInit } from "@angular/core";
// import { AbstractControl, FormControl, ValidationErrors, Validators } from "@angular/forms";
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
// import { LucideAngularModule } from "lucide-angular";
//
//
// @Component({
//   selector: "app-image-input",
//   standalone: true,
//   imports: [
//     MatFormFieldModule,
//     MatProgressSpinnerModule,
//     LucideAngularModule,
//     CommonModule
//   ],
//   template: `
//     <label for="image-input"  class="image-input_wrapper">
//       <input
//         id="image-input"
//         accept="image/*"
//         type="file"
//         class="image_input"
//         (change)="onPickFile($event)"
//       />
//       <div
//         class="image-input_hover_wrapper"
//         [class.uploaded]="src"
//         *ngIf="!processing"
//       >
//         <i-lucide  name="file-image"></i-lucide>
//       </div>
//       <div class="processing_wrapper" *ngIf="processing">
//         <mat-spinner diameter="24"></mat-spinner>
//       </div>
//
//       <img alt="image-input" *ngIf="src" [src]="src" class="image-input_preview" />
//     </label>
//   `,
//   styleUrl: "./image-input.scss",
// })
// export class ImageInputComponent implements OnInit {
//   processing = false;
//
//   @Input({
//     required: false
//   }) required = true;
//
//   @Input() control!: FormControl<File | Blob | null | string>
//
//   src: string | null = null;
//
//   ngOnInit() {
//     console.log(this.control)
//     if (!this.control) {
//       this.control = new FormControl(null, {
//         validators: [
//           this.required ? Validators.required : () => null,
//           this.fileValidator
//         ]
//       });
//     }
//     console.log(this.control.value)
//     if (typeof this.control.value === "string") {
//       this.src = `/api/file/${this.control.value}`
//     }
//   }
//
//   onPickFile(event: Event) {
//     const file = (event.target as HTMLInputElement)?.files?.[0];
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadstart = () => this.processing = true
//       reader.onloadend = () => {
//         this.processing = false
//         this.src = reader.result instanceof ArrayBuffer
//           ? null
//           : reader.result
//       }
//       reader.readAsDataURL(file)
//       this.control?.patchValue(file)
//     }
//   }
//
//   fileValidator(control: AbstractControl): ValidationErrors | null {
//     if (!(control.value instanceof File)) return {
//       fileType: true
//     }
//     return null;
//   };
//
// }
