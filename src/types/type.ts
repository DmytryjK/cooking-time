export type IngredientsType = {
	id: string | number;
    tagText: string;
    tagQuantityWithUnit: string;
    tagUnit: string;
}

export interface Recipe {
	id: string|number|null;
	title: string;
	time: {hours: string; minutes: string};
	ingredients?: IngredientsType[];
	img: string;
	previewImg: string;
	description?: string;
	favorites: boolean;
	category: string;
}

export interface Recipes {
	recipes: Recipe[];
	fetchedRecepieInfo?: Recipe | null;
}

export interface PostState {
	loading: 'idle' | 'pending' | 'succeeded' | 'failed';
	loadingForm?: 'idle' | 'pending' | 'succeeded' | 'failed';
	error: null | unknown;
}

export interface tagsType {
    id: number | string;
    tagText: string;
}

export interface objectForFiltered {
	recipes: Recipe[];
	tags: string[];
}

export interface uploadFileType {
    lastModified?: number;
    lastModifiedDate?: Date;
    name?: string;
    size?: number;
    type?: string;
    webkitRelativePath?: string;
}

export interface userType {
	user: {
		uid: string;
		email: string;
	}
}

export interface user {
	uid: string;
	email: string;
}

export type Loading = 'idle' | 'pending' | 'succeeded' | 'failed';
