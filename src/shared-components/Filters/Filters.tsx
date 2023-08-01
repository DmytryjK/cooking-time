import React from 'react';
import Tags from '../Tags/Tags';
import SortByCategories from '../SortByCategories/SortByCategories';
import './Filters.scss';

const Filters = () => {
  return (
    <div className="filters">
        <Tags />
        <SortByCategories />
    </div>
  )
}

export default Filters;