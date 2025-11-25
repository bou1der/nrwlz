import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  imports: [CommonModule],
  selector: "app-s3-image",
  template: `
    <div class="s3-image">
      <div class="overlay" *ngIf="loading">
        <!-- <mat-spinner  [diameter]="diameter"></mat-spinner> -->
      </div>
      <img
        [src]="src"
        (load)="loading = false"
        alt="image"
      />
    </div>
  `,
  styleUrl: "./index.scss",
})
export class S3ImageComponent implements OnInit {
  @Input({
    required: true,
  }) imageId: string;

  @Input({
    required: false,
  }) diameter = 32;

  loading = true;
  error = false;
  src: string | null = null

  ngOnInit() {
    this.src = `/api/file/${this.imageId}`
  }
}
