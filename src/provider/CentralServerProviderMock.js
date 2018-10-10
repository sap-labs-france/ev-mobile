import Constants from "../utils/Constants";

export default class CentralServerProviderMock {
    async isAuthenticated() {}

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
        // Return a promise
        return new Promise((resolve) => {
            // Filter provided?
            if (params.SiteID) {
                let chargersFiltered = {
                    count: 0
                };
                // Filter the list
                chargersFiltered.result = CHARGERS.result.filter((charger) => charger.siteArea.siteID === params.SiteID);
                // Set the Count
                if (chargersFiltered.result) {
                    chargersFiltered.count = chargersFiltered.result.length;
                }
                // Send mock data
                resolve(chargersFiltered);
            } else {
                // Send mock data
                resolve(CHARGERS);
            }
        });
    }

    async getSites(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
        // Return a promise
        return new Promise((resolve) => {
            let pagedSites = this.applyPaging(SITES, paging);
            // Send mock data
            resolve(pagedSites);
        });
    }

    applyPaging(data, paging) {
        let pagedData = {
            count: 0
        };
        // Cut the collection
        pagedData.result = data.result.slice(paging.skip, paging.skip + paging.limit);
        // Set the count
        if (pagedData.result) {
            pagedData.count = pagedData.result.length;
        }
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

const SITES = {
    "count": 25,
    "result": [{
            "id": "5bbbca22e8c4f3893ca9198a",
            "companyID": "5bbbca22e8c4f3893ca91989",
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
            "createdBy": "admin last",
            "createdOn": "2018-10-08T21:20:34.418Z",
            "lastChangedBy": "Serge FABIANO",
            "lastChangedOn": "2018-10-09T01:14:29.757Z"
        },
        {
            "id": "5bbbca22e8c4f3893ca91993",
            "companyID": "5bbbca22e8c4f3893ca91989",
            "name": "SAP Labs France - Mougins 10",
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
    ]
};

const CHARGERS = {
    "count": 3750,
    "result": [{
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
    ]
};

const SITE_AREAS = {
    "count": 4,
    "result": [{
            "id": "5abebb1b4bae1457eb565e98",
            "name": "Area 1 - South",
            "accessControl": true,
            "siteID": "5abeba8d4bae1457eb565e5b",
            "createdBy": "Sergio FABIANO",
            "createdOn": "2018-03-30T22:32:59.607Z",
            "lastChangedBy": "Sergio FABIANO",
            "lastChangedOn": "2018-08-30T08:15:22.348Z",
            "chargeBoxes": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
            "chargeBoxes": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
            "chargeBoxes": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
            "chargeBoxes": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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
                    "connectors": [{
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