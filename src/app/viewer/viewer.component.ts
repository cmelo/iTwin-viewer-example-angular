/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { environment } from 'src/environments/environment';

import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { assert } from '@itwin/core-bentley';
import {
    BentleyCloudRpcManager, IModelReadRpcInterface, IModelTileRpcInterface
} from '@itwin/core-common';
import { IModelApp } from '@itwin/core-frontend';
import { FrontendIModelsAccess } from '@itwin/imodels-access-frontend';
import { IModelsClient } from '@itwin/imodels-client-management';
import { PresentationRpcInterface } from '@itwin/presentation-common';
import { AuthorizationService } from '@shared/services/authorization.service';

import { SelectionLoggerService } from './services/selection-logger.service';
import { ToolsService } from './services/tools.service';
import { from, shareReplay, switchMap } from 'rxjs';

import type { ViewportProps } from '@shared/types/viewport-props';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

  public initialized = false;
  public viewportId = "myFirstViewportId"

  public signed$ = from(this.authService.signIn()).pipe(shareReplay(1));
  public me$ = this.signed$.pipe(
    switchMap(() => this._http.get('https://api.bentley.com/users/me')),
    shareReplay(1),
  );
   public itwins$ = this.signed$.pipe(
    switchMap(() => this._http.get('https://api.bentley.com/itwins/myprimaryaccount')),
    shareReplay(1),
  );
  public model$ = this.itwins$.pipe(
    switchMap((resp: any) => this._http.get(
      `https://api.bentley.com/imodels/`, {params: {
        iTwinId: resp.iTwin.id,
        projectId: 'e46adc53-d9d4-45d6-a852-b437a84a945e'
      }}
    ))
  )
   public members$ = this.signed$.pipe(
    switchMap(() => this._http.get('https://api.bentley.com/accesscontrol/itwins/e46adc53-d9d4-45d6-a852-b437a84a945e/members')),
    shareReplay(1),
  );





  constructor(
    private toolsService: ToolsService,
    private selectionLoggerService: SelectionLoggerService,
    private authService: AuthorizationService,
    private _http: HttpClient,
  ) {}

  ngOnInit() {
    this._initialize();
  }

  /** initialize iTwin services */
  private async _initialize() {
    console.log('init');
    if (!this.authService.signedIn) {
      await this.authService.signIn();
    }
    // for development purposes only
    assert(this.authService.signedIn, "User must sign in before initializing IModelApp");
    // IModelApp.startup must be called before loading any imodel or viewport
    console.log('before startup');
    await IModelApp.startup({
      authorizationClient: this.authService.client,
      hubAccess: new FrontendIModelsAccess(new IModelsClient()),
      rpcInterfaces: [IModelReadRpcInterface],
      mapLayerOptions: {
        BingMaps: {
          key: "key",
          value: environment.map?.bingKey ?? "",
        },
      },
    });
    console.log('after startup');
    BentleyCloudRpcManager.initializeClient(
      {
        uriPrefix: "https://api.bentley.com",
        info: { title: "imodel/rpc", version: "" },
      },
      [IModelReadRpcInterface, IModelTileRpcInterface, PresentationRpcInterface]
    );
    this.initialized = true;
    console.log('client initialized');
  }

  /**
   * Viewport will emit an event when it is done loading.
   *  Use the id you provided (important only if you have more than one viewport)
   *  to add tools, extensions, etc.
   */
  public doSomethingToViewport(viewportProps: ViewportProps) {
    if (viewportProps.viewportId === this.viewportId) {
      // adds basic navigation tools to the viewport
      this.toolsService.addToolbar(viewportProps.viewportDiv);
      // logs element properties to the console when selected
      viewportProps.imodelConnection.selectionSet.onChanged.addListener((evt) => {
        this.selectionLoggerService.onSelectionChanged(viewportProps.imodelConnection, evt);
      });
    }
  }

}
