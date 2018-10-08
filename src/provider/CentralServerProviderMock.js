import Constants from "../utils/Constants";

export default class CentralServerProviderMock {
  async isAuthenticated() {
  }

  async resetPassword(email) {
    throw new Error('Not implemented in class CentralServerProviderMock');
  }

  async login(email, password, eula) {
    throw new Error('Not implemented in class CentralServerProviderMock');
  }

  async register(name, firstName, email, passwords, eula) {
    throw new Error('Not implemented in class CentralServerProviderMock');
  }

  async getChargers(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    throw new Error('Not implemented in class CentralServerProviderMock');
  }

  async getSites(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    // Return a promise
    return new Promise((resolve) => {
      // Send mock data
      resolve(SITES);
    });
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
        console.log('====================================');
        console.log(siteAreasFiltered);
        console.log('====================================');
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

const SITES = {
  "count": 2,
  "result": [
      {
          "id": "5abeba9e4bae1457eb565e66",
          "name": "SAP Labs France - Caen",
          "address": {
              "address1": "8 Rue Commodore J H Hallet",
              "address2": "La Folie Couvrechef",
              "postalCode": "14000",
              "city": "Caen",
              "department": "Calvados",
              "region": "Normandie",
              "country": "France",
              "latitude": 49.2011397,
              "longitude": -0.39105530000006183
          },
          "allowAllUsersToStopTransactions": false,
          "companyID": "5abeba344bae1457eb565e27",
          "createdOn": "2018-03-30T22:30:54.557Z",
          "lastChangedBy": "Sergio FABIANO",
          "lastChangedOn": "2018-08-28T07:53:53.604Z",
          "availableChargers": 4
      },
      {
          "id": "5abeba8d4bae1457eb565e5b",
          "name": "SAP Labs France - Mougins",
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
          "companyID": "5abeba344bae1457eb565e27",
          "createdOn": "2018-03-30T22:30:37.574Z",
          "lastChangedBy": "Gerald SEILER",
          "lastChangedOn": "2018-09-27T13:13:37.625Z",
          "availableChargers": 13
      }
  ]
};

const SITE_AREAS = {
  "count": 4,
  "result": [
      {
          "id": "5abebb1b4bae1457eb565e98",
          "name": "Area 1 - South",
          "accessControl": true,
          "siteID": "5abeba8d4bae1457eb565e5b",
          "createdBy": "Sergio FABIANO",
          "createdOn": "2018-03-30T22:32:59.607Z",
          "lastChangedBy": "Sergio FABIANO",
          "lastChangedOn": "2018-08-30T08:15:22.348Z",
          "chargeBoxes": [
              {
                  "id": "SAP-Mougins-03",
                  "chargePointSerialNumber": "3N163730715E2S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N164750700100350246E2",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.6",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.114:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:15.115Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-14T22:18:03.183Z",
                  "siteAreaID": "5abebb1b4bae1457eb565e98",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-03",
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 50983,
                          "status": "Occupied",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 579993026
                      }
                  ],
                  "lastChangedOn": "2018-08-30T08:15:22.333Z"
              },
              {
                  "id": "SAP-Mougins-02",
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
                  "lastHeartBeat": "2018-10-02T00:29:19.717Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-14T22:18:03.353Z",
                  "siteAreaID": "5abebb1b4bae1457eb565e98",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-02",
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-08-30T08:15:22.330Z"
              },
              {
                  "id": "SAP-Mougins-04",
                  "chargePointSerialNumber": "3N163730714C1S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N164750700100450246F7",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.6",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.116:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:25.808Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-14T22:18:03.514Z",
                  "siteAreaID": "5abebb1b4bae1457eb565e98",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-04",
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-08-30T08:15:22.336Z"
              },
              {
                  "id": "SAP-Mougins-06",
                  "chargePointSerialNumber": "3N161950395G2S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N163420600100550219E5",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.6",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.120:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:53.623Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-14T22:18:03.527Z",
                  "siteAreaID": "5abebb1b4bae1457eb565e98",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-06",
                  "numberOfConnectedPhase": 3,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-08-30T08:15:22.341Z"
              },
              {
                  "id": "SAP-Mougins-07",
                  "chargePointSerialNumber": "3N171940993A2S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N172430900500250284FB",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.6",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.122:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:18.277Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-14T22:18:03.311Z",
                  "siteAreaID": "5abebb1b4bae1457eb565e98",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-07",
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-08-30T08:15:22.344Z"
              },
              {
                  "id": "SAP-Mougins-05",
                  "chargePointSerialNumber": "3N161950393C2S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N163420600100450219D9",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.6",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.118:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:20.688Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-14T22:18:03.551Z",
                  "siteAreaID": "5abebb1b4bae1457eb565e98",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-05",
                  "numberOfConnectedPhase": 3,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-08-30T08:15:22.339Z"
              }
          ]
      },
      {
          "id": "5b72cef274ae30000855e458",
          "name": "Area 2 - South Fastcharging",
          "accessControl": true,
          "siteID": "5abeba8d4bae1457eb565e5b",
          "createdBy": "Gerald SEILER",
          "createdOn": "2018-08-14T12:45:38.550Z",
          "lastChangedBy": "Gerald SEILER",
          "lastChangedOn": "2018-10-01T07:20:47.668Z",
          "chargeBoxes": [
              {
                  "id": "SAP-Mougins-14",
                  "chargePointSerialNumber": null,
                  "chargePointModel": "MD_TERRA_53",
                  "chargeBoxSerialNumber": null,
                  "chargePointVendor": "ABB",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": null,
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.100:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:27:25.152Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-08-07T08:30:31.899Z",
                  "siteAreaID": "5b72cef274ae30000855e458",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-14",
                  "numberOfConnectedPhase": 3,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 0,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 0,
                          "activeTransactionID": 0
                      }
                  ],
                  "createdOn": "2018-08-07T08:30:31.900Z",
                  "lastChangedOn": "2018-10-01T07:20:47.667Z"
              },
              {
                  "id": "SAP-Mougins-13",
                  "chargePointSerialNumber": null,
                  "chargePointModel": "MD_TERRA_53",
                  "chargeBoxSerialNumber": null,
                  "chargePointVendor": "ABB",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": null,
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.124:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:55.992Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-08-09T08:17:25.473Z",
                  "siteAreaID": "5b72cef274ae30000855e458",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-13",
                  "numberOfConnectedPhase": 3,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 0,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 0,
                          "activeTransactionID": 0
                      }
                  ],
                  "createdOn": "2018-08-09T08:17:25.474Z",
                  "lastChangedOn": "2018-10-01T07:20:47.663Z"
              }
          ]
      },
      {
          "id": "5abebb014bae1457eb565e85",
          "name": "Area 3 - North",
          "accessControl": true,
          "siteID": "5abeba8d4bae1457eb565e5b",
          "createdBy": "Sergio FABIANO",
          "createdOn": "2018-03-30T22:32:33.022Z",
          "lastChangedBy": "Gerald SEILER",
          "lastChangedOn": "2018-10-01T07:21:38.475Z",
          "chargeBoxes": [
              {
                  "id": "SAP-Mougins-08",
                  "chargePointSerialNumber": "3N164250613H1S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S7P44R3N16501070020015024DB6",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.11",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.130:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:42.754Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-15T05:20:34.535Z",
                  "siteAreaID": "5abebb014bae1457eb565e85",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-08",
                  "numberOfConnectedPhase": 1,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-10-01T07:21:38.460Z"
              },
              {
                  "id": "SAP-Mougins-10",
                  "chargePointSerialNumber": "3N174330202H1S1B7551700016",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S7P44R3N1748113003001502BF76",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.11",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.134:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:21.735Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-15T05:20:34.465Z",
                  "siteAreaID": "5abebb014bae1457eb565e85",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-10",
                  "numberOfConnectedPhase": 1,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-10-01T07:21:38.466Z"
              },
              {
                  "id": "SAP-Mougins-09",
                  "chargePointSerialNumber": "3N174320095F1S1B7551700016",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S7P44R3N1748113003002502BF8B",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.11",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.132:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:27.861Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-15T05:20:34.422Z",
                  "siteAreaID": "5abebb014bae1457eb565e85",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-09",
                  "numberOfConnectedPhase": 1,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-10-01T07:21:38.463Z"
              },
              {
                  "id": "SAP-Mougins-11",
                  "chargePointSerialNumber": "3N165040584F2S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S7P44R3N170250700100350257A7",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.11",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.136:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:24.239Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-16T15:53:40.151Z",
                  "siteAreaID": "5abebb014bae1457eb565e85",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-11",
                  "numberOfConnectedPhase": 1,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-10-01T07:21:38.470Z"
              },
              {
                  "id": "SAP-Mougins-12",
                  "chargePointSerialNumber": "3N161240693E1S1B7551700014",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N1618301002002501FE25",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.11",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.138:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:16.502Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-15T05:20:35.389Z",
                  "siteAreaID": "5abebb014bae1457eb565e85",
                  "chargingStationURL": "http://37.71.38.83:10000/SAP-Mougins-12",
                  "numberOfConnectedPhase": 1,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 7360,
                          "activeTransactionID": 0
                      }
                  ],
                  "lastChangedOn": "2018-10-01T07:21:38.473Z"
              }
          ]
      },
      {
          "id": "5ac678b5c0cc5e7fdd2c5ef3",
          "name": "Parking",
          "accessControl": true,
          "siteID": "5abeba9e4bae1457eb565e66",
          "createdOn": "2018-04-05T19:27:49.282Z",
          "lastChangedBy": "Sergio FABIANO",
          "lastChangedOn": "2018-09-03T14:33:52.285Z",
          "chargeBoxes": [
              {
                  "id": "SAP-Caen-02",
                  "chargePointSerialNumber": "3N180230032G2S1B7551700016",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N16473070040010123456",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.12",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.212:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:55.195Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-05-22T15:02:10.958Z",
                  "siteAreaID": "5ac678b5c0cc5e7fdd2c5ef3",
                  "chargingStationURL": "http://193.251.79.116:10003",
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "createdOn": "2018-05-22T14:48:59.445Z",
                  "lastChangedOn": "2018-09-03T14:33:52.278Z"
              },
              {
                  "id": "SAP-Caen-01",
                  "chargePointSerialNumber": "3N180230032G1S1B7551700016",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N16473070040020123456",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.12",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.210:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:30:05.043Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-06-04T11:41:42.311Z",
                  "siteAreaID": "5ac678b5c0cc5e7fdd2c5ef3",
                  "chargingStationURL": "http://193.251.79.116:10001",
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "createdOn": "2018-05-22T14:38:48.532Z",
                  "lastChangedOn": "2018-09-03T14:33:52.276Z"
              },
              {
                  "id": "SAP-Caen-04",
                  "chargePointSerialNumber": "3N181931024A2S1B7551700016",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N182721600400150314EE",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.12",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.210:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:29:38.129Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-09-03T14:29:21.525Z",
                  "siteAreaID": "5ac678b5c0cc5e7fdd2c5ef3",
                  "chargingStationURL": "http://193.251.79.116:10007",
                  "numberOfConnectedPhase": 3,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "createdOn": "2018-09-03T14:29:21.526Z",
                  "lastChangedOn": "2018-09-03T14:51:56.473Z"
              },
              {
                  "id": "SAP-Caen-03",
                  "chargePointSerialNumber": "3N181931025D1S1B7551700016",
                  "chargePointModel": "MONOBLOCK",
                  "chargeBoxSerialNumber": "EV.2S22P44R3N182721600400250314F1",
                  "chargePointVendor": "Schneider Electric",
                  "iccid": null,
                  "imsi": null,
                  "meterType": null,
                  "firmwareVersion": "3.2.0.12",
                  "meterSerialNumber": null,
                  "endpoint": "http://192.168.0.210:8080/",
                  "ocppVersion": "1.5",
                  "lastHeartBeat": "2018-10-02T00:28:12.975Z",
                  "deleted": false,
                  "inactive": true,
                  "lastReboot": "2018-09-03T14:25:54.552Z",
                  "siteAreaID": "5ac678b5c0cc5e7fdd2c5ef3",
                  "chargingStationURL": "http://193.251.79.116:10005",
                  "numberOfConnectedPhase": 3,
                  "connectors": [
                      {
                          "connectorId": 1,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      },
                      {
                          "connectorId": 2,
                          "currentConsumption": 0,
                          "totalConsumption": 0,
                          "status": "Available",
                          "errorCode": "NoError",
                          "info": null,
                          "vendorErrorCode": null,
                          "power": 22170,
                          "activeTransactionID": 0
                      }
                  ],
                  "createdOn": "2018-09-03T14:25:54.553Z",
                  "lastChangedOn": "2018-09-03T14:51:20.386Z"
              }
          ]
      }
  ]
};
