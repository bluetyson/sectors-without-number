import { omitBy, difference, values, includes } from 'lodash';
import { createSelector } from 'reselect';

import { allSectorKeys, coordinateKey } from 'utils/common';
import {
  currentSectorSelector,
  sectorSelector,
  sidebarEditChildrenSelector,
  savedSectorSelector,
  sharedSectorSelector,
} from 'store/selectors/base.selectors';
import { getCurrentSector } from 'store/selectors/entity.selectors';

export const getUserSectors = createSelector(
  [sectorSelector, savedSectorSelector],
  (sectors, saved) =>
    omitBy(
      sectors,
      (sector, key) => sector.isCloudSave || !includes(saved, key),
    ),
);

export const isCurrentSectorSaved = createSelector(
  [currentSectorSelector, savedSectorSelector],
  (currentSector, saved) => includes(saved, currentSector),
);

export const isViewingSharedSector = createSelector(
  [currentSectorSelector, sharedSectorSelector],
  (currentSector, shared) => includes(shared, currentSector),
);

export const getEmptyHexKeys = createSelector(
  [getCurrentSector, sidebarEditChildrenSelector],
  ({ rows, columns }, children = {}) =>
    difference(
      allSectorKeys(columns, rows),
      values(Object.assign({}, ...values(children))).map(({ x, y }) =>
        coordinateKey(x, y),
      ),
    ),
);
