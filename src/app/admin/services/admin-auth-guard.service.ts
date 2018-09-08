import { UserService } from 'shared/services/user.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'shared/services/auth.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'shared/models/app-user';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private userService: UserService) { }

  canActivate(): Observable<boolean> {
    return this.auth.appUSer$
      .pipe(map((appUser: AppUser) => appUser.isAdmin));
  }
}
