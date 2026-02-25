import { LayoutService } from '@ghostfolio/client/core/layout.service';
import { UserService } from '@ghostfolio/client/services/user/user.service';
import { TabConfiguration, User } from '@ghostfolio/common/interfaces';
import { hasPermission, permissions } from '@ghostfolio/common/permissions';
import { internalRoutes } from '@ghostfolio/common/routes/routes';

import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chatbubblesOutline,
  diamondOutline,
  keyOutline,
  settingsOutline
} from 'ionicons/icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject, takeUntil } from 'rxjs';

@Component({
  host: { class: 'page has-tabs' },
  imports: [IonIcon, MatTabsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'gf-user-account-page',
  styleUrls: ['./user-account-page.scss'],
  templateUrl: './user-account-page.html'
})
export class GfUserAccountPageComponent implements OnDestroy, OnInit {
  public deviceType: string;
  public tabs: TabConfiguration[] = [];
  public user: User;

  private unsubscribeSubject = new Subject<void>();

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private layoutService: LayoutService,
    private userService: UserService
  ) {
    this.userService.stateChanged
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((state) => {
        if (state?.user) {
          this.user = state.user;

          this.tabs = [
            {
              iconName: 'settings-outline',
              label: internalRoutes.account.title,
              routerLink: internalRoutes.account.routerLink
            },
            {
              iconName: 'diamond-outline',
              label: internalRoutes.account.subRoutes.membership.title,
              routerLink:
                internalRoutes.account.subRoutes.membership.routerLink,
              showCondition: !!this.user?.subscription
            },
            {
              iconName: 'key-outline',
              label: internalRoutes.account.subRoutes.access.title,
              routerLink: internalRoutes.account.subRoutes.access.routerLink
            },
            ...(hasPermission(
              this.user?.permissions,
              permissions.accessAssistant
            )
              ? [
                  {
                    iconName: 'chatbubbles-outline',
                    label: $localize`Chat`,
                    onClick: () => this.layoutService.openAssistant()
                  }
                ]
              : [])
          ];

          this.changeDetectorRef.markForCheck();
        }
      });

    addIcons({
      chatbubblesOutline,
      diamondOutline,
      keyOutline,
      settingsOutline
    });
  }

  public ngOnInit() {
    this.deviceType = this.deviceService.getDeviceInfo().deviceType;
  }

  public ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
