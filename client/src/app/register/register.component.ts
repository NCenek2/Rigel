import { Component, signal } from "@angular/core";
import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
} from "@angular/forms/signals";
import { EMAIL, PASSWORD } from "../shared/shared.constants";
import { Register } from "./register.model";
import { RegisterService } from "./register.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  imports: [FormRoot, FormField],
})
export class RegisterComponent {
  constructor(private readonly registerService: RegisterService) {}

  registrationModel = signal({
    email: "",
    passwords: {
      password: "",
      password2: "",
    },
  });

  registrationForm = form(
    this.registrationModel,
    (schemaPath) => {
      required(schemaPath.email, { message: "Email is required" });
      email(schemaPath.email, {
        message: "Please enter a valid email address",
      });
      maxLength(schemaPath.email, EMAIL.EMAIL_MAX_LENGTH, {
        message: "Email is too long",
      });

      required(schemaPath.passwords.password, {
        message: "Primary password is needed",
      });
      minLength(schemaPath.passwords.password, PASSWORD.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${PASSWORD.PASSWORD_MIN_LENGTH} characters long`,
      });

      required(schemaPath.passwords.password2, {
        message: "Secondary password is needed",
      });
      minLength(schemaPath.passwords.password2, PASSWORD.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${PASSWORD.PASSWORD_MIN_LENGTH} characters long`,
      });
    },
    {
      submission: {
        action: async (field) => {
          const { email, passwords } = field().value();
          if (!email || !passwords) return;

          const { password, password2 } = passwords;
          if (!password || !password2) return;

          if (field().invalid()) return;

          const registerData: Register = {
            email,
            password,
            password2,
          };

          this.registerService.register(registerData);
        },
      },
    },
  );
}
