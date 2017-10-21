import { actions as ReduxToastrActions } from 'react-redux-toastr';
import { push } from 'react-router-redux';
import { omit } from 'lodash';

import { createOrUpdateSector } from 'store/api/local';
import { getCurrentSector } from 'store/selectors/sector.selectors';

export const SYSTEM_HOLD = 'SYSTEM_HOLD';
export const RELEASE_HOLD = 'RELEASE_HOLD';
export const MOVE_SYSTEM = 'MOVE_SYSTEM';
export const SYSTEM_HOVER_START = 'SYSTEM_HOVER_START';
export const SYSTEM_HOVER_END = 'SYSTEM_HOVER_END';
export const EDIT_SYSTEM = 'EDIT_SYSTEM';
export const DELETE_SYSTEM = 'DELETE_SYSTEM';
export const OPEN_SYSTEM_CREATE = 'OPEN_SYSTEM_CREATE';
export const CLOSE_SYSTEM_CREATE = 'CLOSE_SYSTEM_CREATE';

export const openSystemCreate = key => ({ type: OPEN_SYSTEM_CREATE, key });
export const closeSystemCreate = () => ({ type: CLOSE_SYSTEM_CREATE });
export const systemHold = key => ({ type: SYSTEM_HOLD, key });
export const systemRelease = () => ({ type: RELEASE_HOLD });
export const systemHoverStart = key => ({ type: SYSTEM_HOVER_START, key });
export const systemHoverEnd = key => ({ type: SYSTEM_HOVER_END, key });

export const editSystem = (system, changes) => (dispatch, getState) => {
  const state = getState();
  const sector = { ...getCurrentSector(state), updated: Date.now() };
  sector.created = sector.created || Date.now();
  const update = { ...sector.systems[system], ...changes };
  return createOrUpdateSector(sector.key, {
    ...sector,
    systems: {
      ...sector.systems,
      [system]: update,
    },
  }).then(() => {
    dispatch({ type: EDIT_SYSTEM, system, update });
    dispatch(
      ReduxToastrActions.add({
        options: {
          removeOnHover: true,
          showCloseButton: true,
        },
        position: 'bottom-left',
        title: 'System Updated',
        message: 'Your sector has been saved.',
        type: 'success',
      }),
    );
  });
};

export const deleteSystem = system => (dispatch, getState) => {
  const state = getState();
  const sector = { ...getCurrentSector(state), updated: Date.now() };
  const systems = omit(sector.systems, system);
  return createOrUpdateSector(sector.key, {
    ...sector,
    systems,
  }).then(() => {
    dispatch(push(`/sector/${sector.key}`));
    dispatch({ type: DELETE_SYSTEM, system });
    dispatch(
      ReduxToastrActions.add({
        options: {
          removeOnHover: true,
          showCloseButton: true,
        },
        position: 'bottom-left',
        title: 'System Deleted',
        message: 'Your sector has been saved.',
        type: 'success',
      }),
    );
  });
};

export const moveSystem = () => (dispatch, getState) => {
  const state = getState();
  const sector = { ...getCurrentSector(state), updated: Date.now() };
  sector.created = sector.created || Date.now();
  let systems = { ...sector.systems };
  const source = {
    ...systems[state.system.holdKey],
    key: state.system.hoverKey,
  };
  if (systems[state.system.hoverKey]) {
    const destination = { ...systems[state.system.hoverKey] };
    destination.key = state.system.holdKey;
    systems = Object.assign(systems, {
      [state.system.hoverKey]: source,
      [state.system.holdKey]: destination,
    });
  } else {
    systems = omit(systems, state.system.holdKey);
    systems = Object.assign(systems, {
      [state.system.hoverKey]: source,
    });
  }
  return createOrUpdateSector(sector.key, {
    ...sector,
    systems,
  }).then(() => {
    dispatch(push(`/sector/${sector.key}`));
    dispatch({ type: MOVE_SYSTEM, key: sector.key, systems });
    dispatch(
      ReduxToastrActions.add({
        options: {
          removeOnHover: true,
          showCloseButton: true,
        },
        position: 'bottom-left',
        title: 'System Moved',
        message: 'Your sector has been saved.',
        type: 'success',
      }),
    );
  });
};
