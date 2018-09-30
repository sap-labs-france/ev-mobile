import axios from "axios";
import jwt from 'react-native-pure-jwt'
import Configuration from "../config/Configuration";


// const centralRestServerServiceBaseURL = 'https://192.168.1.130';
const centralRestServerServiceBaseURL = "https://sap-charge-angels-rest-server.cfapps.eu10.hana.ondemand.com";
const centralRestServerServiceAuthURL = centralRestServerServiceBaseURL + "/client/auth";
const centralRestServerServiceSecuredURL = centralRestServerServiceBaseURL + "/client/api";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmU5NjlmODlkOGUwN2EyYjE2YTc4ZiIsInJvbGUiOiJBIiwibmFtZSI6IkZBQklBTk8iLCJ0YWdJRHMiOlsiRjNDMEI0REQiXSwiZmlyc3ROYW1lIjoiU2VyZ2lvIiwibG9jYWxlIjoiZW5fVVMiLCJsYW5ndWFnZSI6ImVuIiwiYXV0aHMiOlt7IkF1dGhPYmplY3QiOiJVc2VycyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6WyJMaXN0Il19fSx7IkF1dGhPYmplY3QiOiJVc2VyIiwiQXV0aEZpZWxkVmFsdWUiOnsiVXNlcklEIjoiKiIsIkFjdGlvbiI6WyJDcmVhdGUiLCJSZWFkIiwiVXBkYXRlIiwiRGVsZXRlIiwiTG9nb3V0IiwiVW5sb2NrQ29ubmVjdG9yIl19fSx7IkF1dGhPYmplY3QiOiJDb21wYW5pZXMiLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiTGlzdCJdfX0seyJBdXRoT2JqZWN0IjoiQ29tcGFueSIsIkF1dGhGaWVsZFZhbHVlIjp7IkNvbXBhbnlJRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSJdfX0seyJBdXRoT2JqZWN0IjoiU2l0ZXMiLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiTGlzdCJdfX0seyJBdXRoT2JqZWN0IjoiU2l0ZSIsIkF1dGhGaWVsZFZhbHVlIjp7IlNpdGVJRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSJdfX0seyJBdXRoT2JqZWN0IjoiVmVoaWNsZU1hbnVmYWN0dXJlcnMiLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiTGlzdCJdfX0seyJBdXRoT2JqZWN0IjoiVmVoaWNsZU1hbnVmYWN0dXJlciIsIkF1dGhGaWVsZFZhbHVlIjp7IlZlaGljbGVNYW51ZmFjdHVyZXJJRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSJdfX0seyJBdXRoT2JqZWN0IjoiVmVoaWNsZXMiLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiTGlzdCJdfX0seyJBdXRoT2JqZWN0IjoiVmVoaWNsZSIsIkF1dGhGaWVsZFZhbHVlIjp7IlZlaGljbGVJRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSJdfX0seyJBdXRoT2JqZWN0IjoiU2l0ZUFyZWFzIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IlNpdGVBcmVhIiwiQXV0aEZpZWxkVmFsdWUiOnsiU2l0ZUFyZWFJRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSJdfX0seyJBdXRoT2JqZWN0IjoiQ2hhcmdpbmdTdGF0aW9ucyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6WyJMaXN0Il19fSx7IkF1dGhPYmplY3QiOiJDaGFyZ2luZ1N0YXRpb24iLCJBdXRoRmllbGRWYWx1ZSI6eyJDaGFyZ2luZ1N0YXRpb25JRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSIsIlJlc2V0IiwiQ2xlYXJDYWNoZSIsIkdldENvbmZpZ3VyYXRpb24iLCJDaGFuZ2VDb25maWd1cmF0aW9uIiwiU3RhcnRUcmFuc2FjdGlvbiIsIlN0b3BUcmFuc2FjdGlvbiIsIlVubG9ja0Nvbm5lY3RvciIsIkF1dGhvcml6ZSJdfX0seyJBdXRoT2JqZWN0IjoiVHJhbnNhY3Rpb25zIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IlRyYW5zYWN0aW9uIiwiQXV0aEZpZWxkVmFsdWUiOnsiVXNlcklEIjoiKiIsIkFjdGlvbiI6WyJSZWFkIiwiVXBkYXRlIiwiRGVsZXRlIiwiUmVmdW5kVHJhbnNhY3Rpb24iXX19LHsiQXV0aE9iamVjdCI6IkxvZ2dpbmdzIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IkxvZ2dpbmciLCJBdXRoRmllbGRWYWx1ZSI6eyJMb2dJRCI6IioiLCJBY3Rpb24iOlsiUmVhZCJdfX0seyJBdXRoT2JqZWN0IjoiUHJpY2luZyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6WyJSZWFkIiwiVXBkYXRlIl19fV0sImlhdCI6MTUzODI5NDYzMywiZXhwIjoxNTM4MzM3ODMzfQ.8T2qi_CugabsMK6ZzzMiC5gHj_U_2tsOIRtB_nbSNss";

export default class CentralServerProvider {
  static async isAuthenticated() {
    try {
      console.log('====================================');
      console.log(jwt);
      console.log('====================================');
      let result = await jwt.verify(
        token, // the token
        Configuration.getJWTSecretKey(), // the secret
        { alg: 'hs256' }
      );

      console.log('====================================');
      console.log(result);
      console.log('====================================');

    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');      
    }
  }

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

  static async getSiteAreas(siteID) {
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/SiteAreas?WithChargeBoxes=true&SiteID=${siteID}`, {
      headers: CentralServerProvider._builSecuredHeaders()
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
