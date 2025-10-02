import { Component } from "@angular/core";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  imports: [MatProgressSpinner],
  selector: "app-loader",
  templateUrl: "./index.html",
  styleUrl: "./index.scss",
})
export class LoadingComponent { }
