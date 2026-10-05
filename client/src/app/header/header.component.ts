import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  imports: [RouterLink],
})
export class HeaderComponent {
  constructor(private readonly authService: AuthService) {}

  get authenticated() {
    return this.authService.isAuthenticated() !== null;
  }

  onLogout() {
    this.authService.logout();
  }
}
