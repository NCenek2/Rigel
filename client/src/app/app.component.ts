import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AlertComponent } from "./alert/alert.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [RouterOutlet, HeaderComponent, AlertComponent],
})
export class AppComponent {}
