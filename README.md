Project Description

YO!APARTMENTS is a web application for searching and browsing real estate properties. The platform allows users to find apartments and houses for both rent and sale in various cities across Ukraine. The project is developed using modern technologies and web development practices.
Key Features

Listing Type Filter: rent or sale options
Property Type Filter: apartment or house selection
City Selection: Kyiv, Odessa, Lviv, Kharkiv
Advanced Search: search by streets and addresses with autocomplete
Interactive Map: property visualization on Google Maps
Detailed Information: description, price, area, number of bedrooms and bathrooms for each property
Image Gallery: browse through property images
Pagination: convenient navigation through property pages
Responsive Design: optimized for mobile devices and tablets


Technologies

TypeScript: strongly typed foundation for the codebase
Vanilla JS: no frameworks, pure JavaScript
SCSS: for styling with variables and mixins
Google Maps API: for map integration and interactive display
Webpack: for project bundling and optimization
ESLint & Stylelint: for code quality assurance
JSON: for storing and managing property data


Project Architecture
The project is built on object-oriented programming principles and a component-based approach:

Components: modular approach to creating UI elements
State Management: reactive system using the Observer pattern
Asynchronous Operations: using Promises and async/await for data handling
Type Safety: complete typing of all components and data


Project Structure

src/
├── components/         # UI components
│   ├── city/           # City selection component
│   ├── header/         # Header component
│   ├── map/            # Google Maps integration
│   ├── paginator/      # Pagination component
│   ├── property/       # Property display components
│   ├── search/         # Search component
│   └── toggle/         # Filter toggle components
├── models/             # Data models
│   ├── types.ts        # Types and interfaces
│   └── propertyData.ts # Data handling logic
├── services/           # Services
│   └── StateManager.ts # Application state management
├── styles/             # SCSS styles
│   └── main.scss       # Main styles file
└── index.ts            # Application entry point


Installation and Setup

1. Clone the repository:
git clone https://gitlab.com/Zhenyapas/yoapartments.git

2. Install dependencies:
npm install

3. Run the local development server:
npm start

4. Open in your browser:
http://localhost:8080

5. Production Build:
npm run build

Future Improvements

Adding favorites functionality
Authentication system integration
Extended filters (price range, additional parameters)
Performance improvements for image loading
Adding real estate market statistics


## Assets Information

- **Fonts**: All fonts used in the project are freely available:
  - Konkhmer Sleokchher (Google Fonts)
  - Inter (Google Fonts)
  - Satoshi (Fontshare)

- **Design**: The website design and logo are original creations, custom-made for this project

- **Brand**: The "YO!APARTMENTS" name is an original concept created for this project

- **Images**: All property images are AI-generated using neural networks to ensure copyright compliance

Author
This project was developed as part of the EPAM Front-End program.
