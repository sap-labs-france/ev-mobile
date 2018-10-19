import axios from "axios";
import Constants from "../utils/Constants";
// const jwt = require('jsonwebtoken');

// const centralRestServerServiceBaseURL = 'https://192.168.1.130';
const centralRestServerServiceBaseURL = "https://sap-charge-angels-rest-server.cfapps.eu10.hana.ondemand.com";
const centralRestServerServiceAuthURL = centralRestServerServiceBaseURL + "/client/auth";
const centralRestServerServiceSecuredURL = centralRestServerServiceBaseURL + "/client/api";
// Paste the tokken below
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViM2EyODkxYzA4ZWQyNzc0NzkzYzQ5ZSIsInJvbGUiOiJBIiwibmFtZSI6IkZBQklBTk8iLCJ0YWdJRHMiOlsiOUM3MDlGMTYiXSwiZmlyc3ROYW1lIjoiTGlhbSIsImxvY2FsZSI6ImVuX1VTIiwibGFuZ3VhZ2UiOiJlbiIsImF1dGhzIjpbeyJBdXRoT2JqZWN0IjoiVXNlcnMiLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiTGlzdCJdfX0seyJBdXRoT2JqZWN0IjoiVXNlciIsIkF1dGhGaWVsZFZhbHVlIjp7IlVzZXJJRCI6IioiLCJBY3Rpb24iOlsiQ3JlYXRlIiwiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSIsIkxvZ291dCIsIlVubG9ja0Nvbm5lY3RvciJdfX0seyJBdXRoT2JqZWN0IjoiQ29tcGFuaWVzIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IkNvbXBhbnkiLCJBdXRoRmllbGRWYWx1ZSI6eyJDb21wYW55SUQiOiIqIiwiQWN0aW9uIjpbIkNyZWF0ZSIsIlJlYWQiLCJVcGRhdGUiLCJEZWxldGUiXX19LHsiQXV0aE9iamVjdCI6IlNpdGVzIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IlNpdGUiLCJBdXRoRmllbGRWYWx1ZSI6eyJTaXRlSUQiOiIqIiwiQWN0aW9uIjpbIkNyZWF0ZSIsIlJlYWQiLCJVcGRhdGUiLCJEZWxldGUiXX19LHsiQXV0aE9iamVjdCI6IlZlaGljbGVNYW51ZmFjdHVyZXJzIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IlZlaGljbGVNYW51ZmFjdHVyZXIiLCJBdXRoRmllbGRWYWx1ZSI6eyJWZWhpY2xlTWFudWZhY3R1cmVySUQiOiIqIiwiQWN0aW9uIjpbIkNyZWF0ZSIsIlJlYWQiLCJVcGRhdGUiLCJEZWxldGUiXX19LHsiQXV0aE9iamVjdCI6IlZlaGljbGVzIiwiQXV0aEZpZWxkVmFsdWUiOnsiQWN0aW9uIjpbIkxpc3QiXX19LHsiQXV0aE9iamVjdCI6IlZlaGljbGUiLCJBdXRoRmllbGRWYWx1ZSI6eyJWZWhpY2xlSUQiOiIqIiwiQWN0aW9uIjpbIkNyZWF0ZSIsIlJlYWQiLCJVcGRhdGUiLCJEZWxldGUiXX19LHsiQXV0aE9iamVjdCI6IlNpdGVBcmVhcyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6WyJMaXN0Il19fSx7IkF1dGhPYmplY3QiOiJTaXRlQXJlYSIsIkF1dGhGaWVsZFZhbHVlIjp7IlNpdGVBcmVhSUQiOiIqIiwiQWN0aW9uIjpbIkNyZWF0ZSIsIlJlYWQiLCJVcGRhdGUiLCJEZWxldGUiXX19LHsiQXV0aE9iamVjdCI6IkNoYXJnaW5nU3RhdGlvbnMiLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiTGlzdCJdfX0seyJBdXRoT2JqZWN0IjoiQ2hhcmdpbmdTdGF0aW9uIiwiQXV0aEZpZWxkVmFsdWUiOnsiQ2hhcmdpbmdTdGF0aW9uSUQiOiIqIiwiQWN0aW9uIjpbIkNyZWF0ZSIsIlJlYWQiLCJVcGRhdGUiLCJEZWxldGUiLCJSZXNldCIsIkNsZWFyQ2FjaGUiLCJHZXRDb25maWd1cmF0aW9uIiwiQ2hhbmdlQ29uZmlndXJhdGlvbiIsIlN0YXJ0VHJhbnNhY3Rpb24iLCJTdG9wVHJhbnNhY3Rpb24iLCJVbmxvY2tDb25uZWN0b3IiLCJBdXRob3JpemUiXX19LHsiQXV0aE9iamVjdCI6IlRyYW5zYWN0aW9ucyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6WyJMaXN0Il19fSx7IkF1dGhPYmplY3QiOiJUcmFuc2FjdGlvbiIsIkF1dGhGaWVsZFZhbHVlIjp7IlVzZXJJRCI6IioiLCJBY3Rpb24iOlsiUmVhZCIsIlVwZGF0ZSIsIkRlbGV0ZSIsIlJlZnVuZFRyYW5zYWN0aW9uIl19fSx7IkF1dGhPYmplY3QiOiJMb2dnaW5ncyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6WyJMaXN0Il19fSx7IkF1dGhPYmplY3QiOiJMb2dnaW5nIiwiQXV0aEZpZWxkVmFsdWUiOnsiTG9nSUQiOiIqIiwiQWN0aW9uIjpbIlJlYWQiXX19LHsiQXV0aE9iamVjdCI6IlByaWNpbmciLCJBdXRoRmllbGRWYWx1ZSI6eyJBY3Rpb24iOlsiUmVhZCIsIlVwZGF0ZSJdfX0seyJBdXRoT2JqZWN0IjoiVGVuYW50cyIsIkF1dGhGaWVsZFZhbHVlIjp7IkFjdGlvbiI6W119fSx7IkF1dGhPYmplY3QiOiJUZW5hbnQiLCJBdXRoRmllbGRWYWx1ZSI6eyJUZW5hbnRJRCI6IioiLCJBY3Rpb24iOltdfX1dLCJpYXQiOjE1Mzk5MzQ4NjksImV4cCI6MTUzOTk3ODA2OX0.fE1TYcG5cHwnqe_ePmfeTGxMW6pHscwJf3yBD7sM5dQ";

export default class CentralServerProvider {
  async isAuthenticated() {
    // try {
    //   console.log('====================================');
    //   console.log(jwt);
    //   console.log('====================================');
    //   let result = await jwt.verify(token, Configuration.getJWTSecretKey());

    //   console.log('====================================');
    //   console.log(result);
    //   console.log('====================================');

    // } catch (error) {
    //   console.log('====================================');
    //   console.log(error);
    //   console.log('====================================');
    // }
  }

  async resetPassword(email) {
    // Call
    let result = await axios.post(`${centralRestServerServiceAuthURL}/Reset`,
      { email },
      { headers: this._builHeaders() }
    );
  }

  async login(email, password, eula) {
    // Call
    let result = await axios.post(`${centralRestServerServiceAuthURL}/Login`,
      { email, password, "acceptEula": eula },
      { headers: this._builHeaders() }
    );
    console.log(result.data.token);
    // Keep the token
    token = result.data.token;
  }

  async register(name, firstName, email, passwords, eula) {
    let result = await axios.post(`${centralRestServerServiceAuthURL}/RegisterUser`,
      { name, firstName, email, passwords, "acceptEula": eula },
      { headers: this._builHeaders() }
    );
    return result.data;
  }

  async getChargers(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/ChargingStations`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSites(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/Sites`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSiteAreas(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/SiteAreas`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getEndUserLicenseAgreement(language) {
    let result = await axios.get(`${centralRestServerServiceAuthURL}/EndUserLicenseAgreement?Language=${language}`, {
      headers: this._builHeaders()
    });
    return result.data;
  }

  _buildPaging(paging, queryString) {
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

  _buildOrdering(ordering, queryString) {
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

  _builHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
  }

  _builSecuredHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    };
  }
}
