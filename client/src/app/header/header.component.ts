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

  get auth() {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
  }
}
