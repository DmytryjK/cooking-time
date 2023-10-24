import React from 'react';
import Tags from './Tags/Tags';
import SortByCategories from './SortByCategories/SortByCategories';
import './Filters.scss';

const Filters = ({title}: {title: string}) => {
  return (
    <div className="filters">
        <h2 className="filters__title">{title}</h2>
        <Tags />
        <SortByCategories />
    </div>
  )
}

export default Filters;