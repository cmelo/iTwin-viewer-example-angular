/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// This file is replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.local.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  authorization: {
    clientId: "spa-cb0c17AHQIPCvMv7oC7bTgAj3",
    scope: "itwins:read projects:read itwins:modify projects:modify users:read sensor-data:read sensor-data:modify savedviews:modify imodels:modify storage:modify storage:read savedviews:read library:modify realitydata:read library:read imodels:read realitydata:modify",
    redirectUri: "http://localhost:3000",
    postSignoutRedirectUri: "http://localhost:3000",
    responseType: "code",
    authority: "https://ims.bentley.com"
  },
  iTwinId: "",
  iModelId: "",
  map: {
    bingKey: ""
  }
};

export type IEnvironment = typeof environment;