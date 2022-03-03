"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("./api.error"));
const constants_1 = __importDefault(require("../constants"));
const { INTERNAL_SERVER_ERROR, NOT_FOUND_API, AUTH_REQUIRED, INVALID_PERMISSION, INVALID_CREDENTIALS, ACCESS_REVOKED, CREATE_USER_FAILED, ERROR_CREATING_TEAM, ERROR_REMOVING_TEAM, ERROR_EDITING_TEAM, TEAM_DOES_NOT_EXIST, ERROR_FETCHING_TEAM, ERROR_FETCHING_PAGE_TEAM, CANNOT_PERFORM_SEARCH, DUPLICATE_TEAM_NAME, DUPLICATE_FIXTURE_NAME, ERROR_ADDING_FEATURES, INVALID_FIXTURE, ERROR_DELETING_FIXTURE, ERROR_UPDATING_FIXTURES, ERROR_FETCHING_FIXTURE, ERROR_FETCHING_PENDING_FIXTURES, ERROR_FETCHING_FIXTURES } = constants_1.default;
exports.default = {
    serverError: new api_error_1.default({ message: INTERNAL_SERVER_ERROR, status: 500 }),
    notFoundApi: new api_error_1.default({ message: NOT_FOUND_API, status: 404 }),
    unAuthorized: new api_error_1.default({ message: INVALID_PERMISSION, status: 403 }),
    accessRevoked: new api_error_1.default({ message: ACCESS_REVOKED, status: 403 }),
    inValidLogin: new api_error_1.default({ message: INVALID_CREDENTIALS, status: 401 }),
    conflictSignupError: new api_error_1.default({ message: INVALID_CREDENTIALS, status: 409, }),
    errorCreatingStaff: new api_error_1.default({ message: CREATE_USER_FAILED, status: 401, }),
    authRequired: new api_error_1.default({ message: AUTH_REQUIRED, status: 401 }),
    errorAddingTeam: new api_error_1.default({ message: ERROR_CREATING_TEAM, status: 400 }),
    errorRemovingTeam: new api_error_1.default({ message: ERROR_REMOVING_TEAM, status: 400 }),
    errorEditingTeam: new api_error_1.default({ message: ERROR_EDITING_TEAM, status: 400 }),
    invalidTeam: new api_error_1.default({ message: TEAM_DOES_NOT_EXIST, status: 400 }),
    errorFetchingTeam: new api_error_1.default({ message: ERROR_FETCHING_PAGE_TEAM, status: 400 }),
    cannotSearchForTeam: new api_error_1.default({ message: CANNOT_PERFORM_SEARCH, status: 400 }),
    duplicateTeamName: new api_error_1.default({ message: DUPLICATE_TEAM_NAME, status: 400 }),
    duplicateFixtures: new api_error_1.default({ message: DUPLICATE_FIXTURE_NAME, status: 400 }),
    errorAddingFixtures: new api_error_1.default({ message: ERROR_ADDING_FEATURES, status: 400 }),
    invalidFixture: new api_error_1.default({ message: INVALID_FIXTURE, status: 400 }),
    errorDeletingFixture: new api_error_1.default({ message: ERROR_DELETING_FIXTURE, status: 400 }),
    errorUpdatingFixture: new api_error_1.default({ message: ERROR_UPDATING_FIXTURES, status: 400 }),
    errorFetchingSingleFixture: new api_error_1.default({ message: ERROR_FETCHING_FIXTURE, status: 400 }),
    errorFetchingAllFixture: new api_error_1.default({ message: ERROR_FETCHING_FIXTURES, status: 400 }),
    errorFetchingPendingFixture: new api_error_1.default({ message: ERROR_FETCHING_PENDING_FIXTURES, status: 400 }),
};
//# sourceMappingURL=generic.js.map