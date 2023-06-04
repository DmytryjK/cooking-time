import { ChangeEvent, useState } from 'react';
import './AddRecipeBtn.scss';
import { NavLink } from 'react-router-dom';

const AddRecipeBtn = ({text = ''}) => {
    return (
        <NavLink to="/add-recepie" className={({ isActive }) => isActive ? "addRecipe-btn active" : "addRecipe-btn"}>{text}</NavLink>
    )
}

export default AddRecipeBtn;