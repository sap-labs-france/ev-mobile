import Constants from "../utils/Constants";

const NETWORK_LATENCY_MILLIS = 500;
export default class CentralServerProviderMock {
  async isAuthenticated() {}

  async resetPassword(email) {
  }

  async login(email, password, eula) {
  }

  async register(name, firstName, email, passwords, eula) {
  }

  async getChargers(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Return a promise
    return new Promise((resolve) => {
      setTimeout(()=> {
        // Filter provided?
        if (params.SiteID) {
          // Filter the list
          let chargersFiltered = CHARGERS.filter((charger) => charger.siteArea.siteID === params.SiteID);
          // Get them all
          let pagedChargersFiltered = this.applyPaging(chargersFiltered, paging);
          // Send mock data
          resolve(pagedChargersFiltered);
        } else {
          // Get them all
          let pagedChargers = this.applyPaging(CHARGERS, paging);
          // Send mock data
          resolve(pagedChargers);
        }
      }, NETWORK_LATENCY_MILLIS);
    });
  }

  async getSites(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Return a promise
    return new Promise((resolve) => {
      setTimeout(()=> {
        let pagedSites = this.applyPaging(SITES, paging);
        // Send mock data
        resolve(pagedSites);
      }, NETWORK_LATENCY_MILLIS);
    });
  }

  applyPaging(data, paging) {
    let pagedData = {
      count: 0
    };
    // Cut the collection
    pagedData.result = data.slice(paging.skip, paging.skip+paging.limit);
    pagedData.count = data.length;
    // Return
    return pagedData;
  }

  async getSiteAreas(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Return a promise
    return new Promise((resolve) => {
      // Filter provided?
      if (params.SiteID) {
        let siteAreasFiltered = {
          count: 0
        };
        // Filter the list
        siteAreasFiltered.result = SITE_AREAS.result.filter((siteArea) => siteArea.siteID === params.SiteID);
        // Set the Count
        if (siteAreasFiltered.result) {
          siteAreasFiltered.count = siteAreasFiltered.result.length;
        }
        // Send mock data
        resolve(siteAreasFiltered);
      } else {
        // Send mock data
        resolve(SITE_AREAS);
      }
    });
  }

  async getEndUserLicenseAgreement(language) {
    throw new Error('Not implemented in class CentralServerProviderMock');
  }
}

const SITES = [{
    "id": "5bbbca22e8c4f3893ca9198a",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins",
    "availableChargers": 5,
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.418Z",
    "lastChangedBy": "Serge FABIANO",
    "lastChangedOn": "2018-10-09T01:14:29.757Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91993",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 10",
    "availableChargers": 8,
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.472Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91994",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 11",
    "availableChargers": 4,
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.473Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91995",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 12",
    "availableChargers": 8,
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.477Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91996",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 13",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.478Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91997",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 14",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.480Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91998",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 15",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.482Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91999",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 16",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.483Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9199a",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 17",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.484Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9199b",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 18",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.484Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9199c",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 19",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.485Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9198b",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 2",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.465Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9199d",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 20",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.488Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9199e",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 21",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.489Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9199f",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 22",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.490Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca919a0",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 23",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.490Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca919a1",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 24",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.491Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca919a2",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 25",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.492Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9198c",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 3",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.467Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9198d",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 4",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.467Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9198e",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 5",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.468Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca9198f",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 6",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.469Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91990",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 7",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.469Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91991",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 8",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.470Z"
  },
  {
    "id": "5bbbca22e8c4f3893ca91992",
    "companyID": "5bbbca22e8c4f3893ca91989",
    "name": "SAP Labs France - Mougins 9",
    "address": {
      "address1": "805 Avenue Maurice Donat",
      "address2": "",
      "postalCode": "06250",
      "city": "Mougins",
      "department": "Alpes-Maritimes",
      "region": "Provence-Alpes-Côte d'Azur",
      "country": "France",
      "latitude": 43.61230630000001,
      "longitude": 7.0169279000000415
    },
    "allowAllUsersToStopTransactions": false,
    "createdBy": "admin last",
    "createdOn": "2018-10-08T21:20:34.471Z"
  }
];

const CHARGERS = [{
    "id": "Station - 1 - 1",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.817Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.817Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 1",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0,
        "type": "Type2"
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0,
        "type": "Chademo"
      },
      {
        "connectorId": 3,
        "currentConsumption": 321456,
        "totalConsumption": 0,
        "status": "Occupied",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0,
        "type": "ComboCcs"
      },
      {
        "connectorId": 4,
        "currentConsumption": 2130,
        "totalConsumption": 0,
        "status": "Occupied",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0,
      },
      {
        "connectorId": 5,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 6,
        "currentConsumption": 10099,
        "totalConsumption": 0,
        "status": "Occupied",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.817Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 10",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.864Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.864Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 10",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.864Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 2",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.856Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.856Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 2",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.856Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 3",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.857Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.857Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 3",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.857Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 4",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.858Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.858Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 4",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.858Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 5",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.859Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.859Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 5",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.859Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 6",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.859Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.859Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 6",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.859Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 7",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.860Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.860Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 7",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.860Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 8",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.861Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.861Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 8",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.861Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 1 - 9",
    "siteAreaID": "5bbbca22e8c4f3893ca919a3",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.862Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.862Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 1 - 9",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.862Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919a3",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 1",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.493Z"
    }
  },
  {
    "id": "Station - 10 - 1",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.975Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.975Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 1",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.975Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 10",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.986Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.986Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 10",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.986Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 2",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.976Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.976Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 2",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.976Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 3",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.976Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.976Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 3",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.976Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 4",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.977Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.977Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 4",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.977Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 5",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.979Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.979Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 5",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.979Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 6",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.981Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.981Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 6",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.981Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 7",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.982Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.982Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 7",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.982Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 8",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.984Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.984Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 8",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.984Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 10 - 9",
    "siteAreaID": "5bbbca22e8c4f3893ca919ac",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:38.985Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:38.985Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 10 - 9",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:38.985Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca919ac",
      "siteID": "5bbbca22e8c4f3893ca9198a",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.551Z"
    }
  },
  {
    "id": "Station - 100 - 1",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.083Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.083Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 1",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.083Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 10",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.091Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.091Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 10",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.091Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 2",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.084Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.084Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 2",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.084Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 3",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.084Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.084Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 3",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.084Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 4",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.085Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.085Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 4",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.085Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 5",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.086Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.086Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 5",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.086Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 6",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.086Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.086Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 6",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.086Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 7",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.087Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.087Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 7",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.087Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 8",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.088Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.088Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 8",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.088Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  },
  {
    "id": "Station - 100 - 9",
    "siteAreaID": "5bbbca22e8c4f3893ca91a06",
    "chargePointSerialNumber": "3N161010492G1S1B7551700014",
    "chargePointModel": "MONOBLOCK",
    "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002001501FE19",
    "chargePointVendor": "Schneider Electric",
    "iccid": null,
    "imsi": null,
    "meterType": null,
    "firmwareVersion": "3.2.0.6",
    "meterSerialNumber": null,
    "endpoint": "http://192.168.0.112:8080/",
    "ocppVersion": "1.5",
    "lastHeartBeat": "2018-10-08T21:20:40.088Z",
    "deleted": false,
    "inactive": true,
    "lastReboot": "2018-10-08T21:20:40.088Z",
    "chargingStationURL": "http://37.71.38.83:10000/Station - 100 - 9",
    "connectors": [{
        "connectorId": 1,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      },
      {
        "connectorId": 2,
        "currentConsumption": 0,
        "totalConsumption": 0,
        "status": "Available",
        "errorCode": "NoError",
        "power": 22170,
        "activeTransactionID": 0
      }
    ],
    "lastChangedBy": "admin last",
    "lastChangedOn": "2018-10-08T21:20:40.088Z",
    "siteArea": {
      "id": "5bbbca22e8c4f3893ca91a06",
      "siteID": "5bbbca22e8c4f3893ca91990",
      "name": "Area 10",
      "accessControl": true,
      "createdBy": "5bbbca22e8c4f3893ca91924",
      "createdOn": "2018-10-08T21:20:34.664Z"
    }
  }
];

const SITE_AREAS = [];
