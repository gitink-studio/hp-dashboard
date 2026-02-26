import { DataProvider, fetchUtils } from "react-admin";
import restProvider from "ra-data-simple-rest";
import { QueryNames, ROOT_URL } from "../common/constants";

const baseProvider: DataProvider = restProvider(ROOT_URL);

export const restDataProvider: DataProvider = {
  ...baseProvider,

  create: async (resource, params) => {
    let url: string = "";
    let options = {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    if (resource === QueryNames.GET_ALL_GAME_PLATFORM_DATA) {
      url = ROOT_URL + "/gamePlatforms/new";
    }

    if (resource === QueryNames.GET_ALL_GAME_DATA) {
      console.log(JSON.stringify(params.data));
      options.body = JSON.stringify({
        gamePlatformId: params.data.name,
        name: params.data.gameName,
      });
      url = ROOT_URL + "/games/new";
    }

    const { json } = await fetchUtils.fetchJson(url, options);

    return json;
  },
};
