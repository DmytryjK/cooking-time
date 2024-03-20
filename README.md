# Cooking Time App
[Demo Link](https://cooking-times.vercel.app/)

## Description
The Cooking Time project aims to provide a platform for users to discover, share, and collaborate on recipes. Users can browse a collection of recipes contributed by the community, as well as add, edit, and update their own recipes. The platform offers authorization features to ensure user privacy and security.

## Features
- **Recipe Management**: Users can add, edit, and update recipes.
- **Authorization**: Secure user authentication and authorization system.
- **Search Functionality**: Users can search for recipes by name or ingredients.
- **Ingredient-Based Search**: Find recipes based on available ingredients.
- **User Profiles**: Personalized profiles for users to manage their recipes and preferences. If a user adds recipes to the site, only the user or admin can make changes. Guests can't edit recipes.
- **Responsive Design**: The platform is designed to be accessible on various devices and screen sizes.

## Technologies Used
- **Frontend**: HTML, CSS, React, TypeScript, Redux, Framer Motion, LazyLoad, Image Compressor
- **Backend**: Firebase
- **Authentication**: 
    1) Email + Password Authentication
    2) Google Authentication
- **Version Control**: Git for code management, hosted on GitHub

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
