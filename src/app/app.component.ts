import { UserService } from './user.service';
import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  subscription: Subscription;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    router: Router
  ) {
      this.subscription =  auth.user$.subscribe(user => {
      if (!user) { return; }

      userService.save(user);

      const returnUrl = localStorage.getItem('returnUrl');
      if (!returnUrl) { return; }

      localStorage.removeItem('returnUrl');
      router.navigateByUrl(returnUrl);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
