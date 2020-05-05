import FilterComponent from '../components/create-site-filters.js';

import {renderTemplate, RenderPosition, replaceTemplate} from '../utils/render.js';
import {getTasksByFilter} from '../utils/filter.js';
import {FilterType} from '../constants.js';

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    // this._tasksModel.setDataChangeHandler(this._onDataChange);

  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.renderFilter();
  }

  renderFilter() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasksAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldFilterComponent) {
      replaceTemplate(this._filterComponent, oldFilterComponent);
    } else {
      renderTemplate(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }
}
