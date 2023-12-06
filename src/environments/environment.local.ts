/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// REPLACE WITH YOUR CLIENT FROM https://developer.bentley.com/register/
export const environment = {
  production: false,
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