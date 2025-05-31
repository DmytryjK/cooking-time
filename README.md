# Cooking Time App

### [Demo Link](https://cooking-times.vercel.app/)

![project-preview](https://github.com/DmytryjK/recepies-react/assets/48493462/3652df0b-4174-4971-92eb-09258d2b427a)

## Description

The Cooking Time project aims to provide a platform for users to discover, share, and collaborate on recipes. Users can browse a collection of recipes contributed by the community, as well as add, edit, and update their own recipes. The platform offers authorization features to ensure user privacy and security.

## Technologies Used

- **Frontend**:
<pre>
<img width="20" src="https://user-images.githubusercontent.com/25181517/192158954-f88b5814-d510-4564-b285-dff7d6400dad.png" alt="HTML" title="HTML"/> HTML  <img width="20" src="https://user-images.githubusercontent.com/25181517/192158956-48192682-23d5-4bfc-9dfb-6511ade346bc.png" alt="Sass" title="Sass"/> SCSS  <img width="20" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/> React  <img width="20" src="https://user-images.githubusercontent.com/25181517/187896150-cc1dcb12-d490-445c-8e4d-1275cd2388d6.png" alt="Redux" title="Redux"/> Redux  <img width="20" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/> Typescript

<img width="20" src="https://camo.githubusercontent.com/3bcd317876dc122d3055613c7f5450134050d0c5a8683807c6f2e8e2178737b0/68747470733a2f2f6672616d657275736572636f6e74656e742e636f6d2f696d616765732f34386861395a52396f5a51475136675a38595566456c50335430412e706e67" alt="framer" title="framer"/> Framer-motion ImageCompressor LazyLoad

</pre>

- **Backend**: <img width="20" src="https://user-images.githubusercontent.com/25181517/189716855-2c69ca7a-5149-4647-936d-780610911353.png" alt="Firebase" title="Firebase"/> Firebase
- **Authentication**:
  - Email + Password Authentication
  - Google Authentication
- **Version Control**: `Git` for code management, hosted on GitHub

## Features

- **Recipe Management**: Users can add, edit, and update recipes.
- **Authorization**: Secure user authentication and authorization system.
- **Search Functionality**: Users can search for recipes by name or ingredients.
- **Ingredient-Based Search**: Find recipes based on available ingredients.
- **User Profiles**: Personalized profiles for users to manage their recipes and preferences. If a user adds recipes to the site, only the user or admin can make changes. Guests can't edit recipes.
- **Responsive Design**: The platform is designed to be accessible on various devices and screen sizes.

## Getting Started

To get started with the Cooking Time project, follow these steps:

1. Clone the repository: `git clone https://github.com/DmytryjK/recepies-react.git`
2. Install dependencies: `npm install`
3. Set up the database connection and configuration
4. Start the server: `npm start`
5. Access the application in your web browser: `http://localhost:3000`

## Future Enhancements

- **Advanced Search Filters**: Allow users to filter recipes by name or ingredients. Implementing the Levenshtein Algorithm for searching current ingredients works effectively.
- **Integration with External APIs**: All data is integrated with Firebase.
- **Recipe Form**: The recipe form for adding new recipes or editing existing ones offers convenient functionality.
- **Responsive UI**: The site is fully responsive. All features are well-implemented for the mobile version.
- **Photo Compression and Resizing**: When users upload photos for recipes, the application optimizes and resizes them. Different settings are applied for preview and main photos, which greatly improves site performance.
- **Animations**: Animations are implemented using Framer Motion.

## License

This project is licensed under the [MIT License](LICENSE).
