import axios from "axios";

// const centralRestServerServiceBaseURL = 'https://192.168.1.130';
const centralRestServerServiceBaseURL = "https://sap-charge-angels-rest-server.cfapps.eu10.hana.ondemand.com";
const centralRestServerServiceAuthURL = centralRestServerServiceBaseURL + "/client/auth";
const centralRestServerServiceSecuredURL = centralRestServerServiceBaseURL + "/client/api";
let token;

export default class CentralServerProvider {

  static async resetPassword(email) {
    // Call
    let result = await axios.post(`${centralRestServerServiceAuthURL}/Reset`,
      { email },
      { headers: CentralServerProvider._builHeaders() }
    );
  }

  static async login(email, password, eula) {
    // Call
    let result = await axios.post(`${centralRestServerServiceAuthURL}/Login`,
      { email, password, "acceptEula": eula },
      { headers: CentralServerProvider._builHeaders() }
    );
    // Keep the token
    token = result.data.token;
  }

  static async register(name, firstName, email, passwords, eula) {
    let result = await axios.post(`${centralRestServerServiceAuthURL}/RegisterUser`,
      { name, firstName, email, passwords, "acceptEula": eula },
      { headers: CentralServerProvider._builHeaders() }
    );
    return result.data;
  }

  static async getChargers(params = {}, paging = {}, ordering = {}) {
    // Build Paging
    CentralServerProvider._buildPaging(paging, params);
    // Build Ordering
    CentralServerProvider._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/ChargingStations`, {
      headers: CentralServerProvider._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  static async getSites(params = {}, paging = {}, ordering = {}) {
    // Build Paging
    CentralServerProvider._buildPaging(paging, params);
    // Build Ordering
    CentralServerProvider._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/Sites`, {
      headers: CentralServerProvider._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  static async getEndUserLicenseAgreement(language) {
    let result = await axios.get(`${centralRestServerServiceAuthURL}/EndUserLicenseAgreement?Language=${language}`, {
      headers: CentralServerProvider._builHeaders()
    });
    return result.data;
  }

  static _buildPaging(paging, queryString) {
    // Check
    if (paging) {
      // Limit
      if (paging.limit) {
        queryString.Limit = paging.limit;
      }
      // Skip
      if (paging.skip) {
        queryString.Skip = paging.skip;
      }
    }
  }

  static _buildOrdering(ordering, queryString) {
    // Check
    if (ordering && ordering.length) {
      if (!queryString.SortFields) {
        queryString.SortFields = [];
        queryString.SortDirs = [];
      }
      // Set
      ordering.forEach((order) => {
        queryString.SortFields.push(order.field);
        queryString.SortDirs.push(order.direction);
      });
    }
  }

  static _builHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
  }

  static _builSecuredHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    };
  }
}
