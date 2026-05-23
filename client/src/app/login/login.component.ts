import { Component, signal } from "@angular/core";
import { email, form, minLength, required, FormRoot, FormField } from "@angular/forms/signals";
import { AlertService } from "../alert/alert.service";
import { AuthService } from "../auth/auth.service";
import { PASSWORD } from "../shared/shared.constants";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [FormRoot, FormField, RouterLink],
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
  ) {}

  loginModel = signal({
    email: "",
    password: "",
  });

  loginForm = form(
    this.loginModel,
    (schemaForm) => {
      required(schemaForm.email, { message: "Email is required" });
      email(schemaForm.email, { message: "Email must be a valid email" });
      required(schemaForm.password, { message: "Password is required" });
      minLength(schemaForm.password, PASSWORD.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${PASSWORD.PASSWORD_MIN_LENGTH} characters long`,
      });
    },
    {
      submission: {
        action: async (field) => {
          const { email, password } = field().value();
          if (!email || !password) {
            return this.alertService.setAlert("Email or password is empty.");
          }

          this.authService.login({ email, password });
        },
      },
    },
  );
}
