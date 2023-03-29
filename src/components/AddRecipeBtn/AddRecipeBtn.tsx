import { ChangeEvent, useState } from 'react';
import './AddRecipeBtn.scss';

const AddRecipeBtn = ({text = ''}) => {
    return (
        <button className="addRecipe-btn">{text}</button>
    )
}

export default AddRecipeBtn;