import activityStatus from './activity.status';
import apiMessage from './api.message';
import eventsConstant from './events.constants';
import processStatus from './process.status';
import urlConstants from './url.constants';

export default {
  ...activityStatus,
  ...apiMessage,
  ...eventsConstant,
  ...processStatus,
  ...urlConstants,
};
