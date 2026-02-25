import { LayoutService } from '@ghostfolio/client/core/layout.service';
import { UserService } from '@ghostfolio/client/services/user/user.service';
import { TabConfiguration, User } from '@ghostfolio/common/interfaces';
import { hasPermission, permissions } from '@ghostfolio/common/permissions';
import { internalRoutes } from '@ghostfolio/common/routes/routes';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chatbubblesOutline,
  flashOutline,
  peopleOutline,
  readerOutline,
  serverOutline,
  settingsOutline
} from 'ionicons/icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  host: { class: 'page has-tabs' },
  imports: [IonIcon, MatTabsModule, RouterModule],
  selector: 'gf-admin-page',
  styleUrls: ['./admin-page.scss'],
  templateUrl: './admin-page.html'
})
export class AdminPageComponent implements OnInit {
  public deviceType: string;
  public tabs: TabConfiguration[] = [];
  public user: User;

  private unsubscribeSubject = new Subject<void>();

  public constructor(
    private deviceService: DeviceDetectorService,
    private layoutService: LayoutService,
    private userService: UserService
  ) {
    addIcons({
      chatbubblesOutline,
      flashOutline,
      peopleOutline,
      readerOutline,
      serverOutline,
      settingsOutline
    });
  }

  public ngOnInit() {
    this.deviceType = this.deviceService.getDeviceInfo().deviceType;

    this.userService.stateChanged
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((state) => {
        if (state?.user) {
          this.user = state.user;
        }

        this.tabs = [
          {
            iconName: 'reader-outline',
            label: $localize`Overview`,
            routerLink: internalRoutes.adminControl.routerLink
          },
          {
            iconName: 'settings-outline',
            label:
              internalRoutes.adminControl.subRoutes.settings.title +
              '<span class="badge badge-pill badge-secondary ml-2 text-uppercase">' +
              $localize`new` +
              '</span>',
            routerLink: internalRoutes.adminControl.subRoutes.settings.routerLink
          },
          {
            iconName: 'server-outline',
            label: internalRoutes.adminControl.subRoutes.marketData.title,
            routerLink:
              internalRoutes.adminControl.subRoutes.marketData.routerLink
          },
          {
            iconName: 'flash-outline',
            label: internalRoutes.adminControl.subRoutes.jobs.title,
            routerLink: internalRoutes.adminControl.subRoutes.jobs.routerLink
          },
          {
            iconName: 'people-outline',
            label: internalRoutes.adminControl.subRoutes.users.title,
            routerLink: internalRoutes.adminControl.subRoutes.users.routerLink
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
      });
  }

  public ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
