import ApiError from './api.error';
import constants from '../constants';

const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_API,
  AUTH_REQUIRED,
  INVALID_PERMISSION,
  INVALID_CREDENTIALS,
  ACCESS_REVOKED,
  CREATE_USER_FAILED,
  ERROR_CREATING_TEAM,
  ERROR_REMOVING_TEAM,
  ERROR_EDITING_TEAM,
  TEAM_DOES_NOT_EXIST,
  ERROR_FETCHING_TEAM,
  ERROR_FETCHING_PAGE_TEAM,
  CANNOT_PERFORM_SEARCH,
  DUPLICATE_TEAM_NAME,
  DUPLICATE_FIXTURE_NAME,
  ERROR_ADDING_FEATURES,
  INVALID_FIXTURE,
  ERROR_DELETING_FIXTURE,
  ERROR_UPDATING_FIXTURES,
  ERROR_FETCHING_FIXTURE,
  ERROR_FETCHING_PENDING_FIXTURES,
  ERROR_FETCHING_FIXTURES,
  THROTTLE_LIMIT
} = constants;

export default {
  serverError: new ApiError({ message: INTERNAL_SERVER_ERROR, status: 500 }),
  notFoundApi: new ApiError({ message: NOT_FOUND_API, status: 404 }),
  unAuthorized: new ApiError({ message: INVALID_PERMISSION, status: 403 }),
  accessRevoked: new ApiError({ message: ACCESS_REVOKED, status: 403 }),
  inValidLogin: new ApiError({ message: INVALID_CREDENTIALS, status: 401 }),
  conflictSignupError: new ApiError({ message: INVALID_CREDENTIALS, status: 409, }),
  errorCreatingStaff: new ApiError({message: CREATE_USER_FAILED, status: 401, }),
  authRequired: new ApiError({ message: AUTH_REQUIRED, status: 401 }),
  errorAddingTeam: new ApiError({ message: ERROR_CREATING_TEAM, status: 400 }),  
  errorRemovingTeam: new ApiError({ message: ERROR_REMOVING_TEAM, status: 400 }),
  errorEditingTeam: new ApiError({ message: ERROR_EDITING_TEAM, status: 400 }),
  invalidTeam: new ApiError({ message: TEAM_DOES_NOT_EXIST, status: 400 }),
  errorFetchingTeam: new ApiError({ message: ERROR_FETCHING_PAGE_TEAM, status: 400  }),
  cannotSearchForTeam: new ApiError({ message: CANNOT_PERFORM_SEARCH, status: 400  }),
  duplicateTeamName: new ApiError({ message: DUPLICATE_TEAM_NAME, status: 400  }),
  duplicateFixtures: new ApiError({ message: DUPLICATE_FIXTURE_NAME, status: 400  }), 
  errorAddingFixtures: new ApiError({ message: ERROR_ADDING_FEATURES, status: 400  }), 
  invalidFixture:  new ApiError({ message: INVALID_FIXTURE, status: 400  }), 
  errorDeletingFixture:  new ApiError({ message: ERROR_DELETING_FIXTURE, status: 400  }), 
  errorUpdatingFixture:  new ApiError({ message: ERROR_UPDATING_FIXTURES, status: 400  }), 
  errorFetchingSingleFixture:  new ApiError({ message: ERROR_FETCHING_FIXTURE, status: 400  }),
  errorFetchingAllFixture:  new ApiError({ message: ERROR_FETCHING_FIXTURES, status: 400  }), 
  errorFetchingPendingFixture:  new ApiError({ message: ERROR_FETCHING_PENDING_FIXTURES, status: 400  }),
  throttleError:  new ApiError({ message: THROTTLE_LIMIT, status: 429  }),
 





};
