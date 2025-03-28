# User Management React Application

## Project Overview

This is a comprehensive User Management application built with React, integrating with the Reqres API to provide authentication, user listing, editing, and deletion functionalities.

## Features

- User Authentication
- Paginated User List
- User Edit Functionality
- User Delete Functionality
- Dark Mode Toggle
- Responsive Design

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/user-management-app.git
cd user-management-app
```

2. Install dependencies:
```bash
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

## Project Dependencies

- React
- React Router
- Axios
- Tailwind CSS
- Lucide React (for icons)

## Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`:
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryWhite: {
          100: '#F8FAFC',
          200: '#D9EAFD',
          300: '#BCCCDC',
          400: '#9AA6B2',
        }
      }
    },
  },
  plugins: [],
}
```

## API Integration

The application uses the Reqres API (https://reqres.in/) for:
- Authentication
- User Listing
- User Editing
- User Deletion

### Authentication Credentials
- Email: eve.holt@reqres.in
- Password: cityslicka

## Project Structure

```
src/
├── components/
│   ├── Login.js
│   └── UserList.js
├── App.js
├── index.js
└── App.css
```

## Assumptions and Considerations

1. Authentication
- Token is stored in localStorage
- Simple token-based authentication
- No refresh token mechanism implemented

2. User Management
- Uses mock API (Reqres)
- Supports basic CRUD operations
- Pagination limited to API capabilities

3. Error Handling
- Basic error messages for API interactions
- Client-side error catching
- No advanced error logging

4. Responsiveness
- Fully responsive design
- Mobile-friendly layout
- Adaptive to different screen sizes

5. Dark Mode
- Persistent dark mode preference
- Stored in localStorage
- Toggleable with Sun/Moon icons

## Contact

[Shahid/shahidsaifi138@gmail.com]