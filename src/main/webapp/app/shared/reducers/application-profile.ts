import axios from 'axios';

import { SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  GET_PROFILE: 'applicationProfile/GET_PROFILE'
};

const initialState = {
  ribbonEnv: '',
  inProduction: true,
  isSwaggerEnabled: false
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export default (state: ApplicationProfileState = initialState, action): ApplicationProfileState => {
  if (action.type === SUCCESS(ACTION_TYPES.GET_PROFILE)) {
    const { data } = action.payload;
    return {
      ...state,
      ribbonEnv: data['display-ribbon-on-profiles'],
      inProduction: data.activeProfiles.includes('prod'),
      isSwaggerEnabled: data.activeProfiles.includes('swagger')
    };
  } else {
    return state;
  }
};

export const getProfile = () => ({
  type: ACTION_TYPES.GET_PROFILE,
  payload: axios.get('management/info')
});
