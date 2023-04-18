import { ChangeEvent, useState } from 'react';
import './AddRecipeBtn.scss';

const AddRecipeBtn = ({text = ''}) => {
    return (
        <a className="addRecipe-btn" href="/add-recepie">{text}</a>
    )
}

export default AddRecipeBtn;