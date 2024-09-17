# Sample Figma Plugin Documentation

### Overview
This project is a Figma plugin that helps users search and navigate text within their Figma documents. It includes a server-side application for authentication and user management using Firebase.

### Project Structure

 - plugin/: Contains the Figma plugin using ReactJS and TypeScript.
 - server/: Contains the backend server using ExpressJS, ReactJS,
   TypeScript, and Firebase.
 - package.json: Defines scripts for building, starting, and linting
   both the plugin and server.

### User Flow

 ### 1. Login Flow:

 - The user opens the Figma app and navigates to the plugin.
 - The plugin displays a login page. The user clicks the login button,
   redirecting them to a separate browser page.
 - If the user clicks "Cancel," the plugin closes. If not, they grant
   permission to the plugin.
 - Upon granting permission, the user is logged in, and an account is
   created in Firebase if needed.

 ### 2. Text Finder Flow:

 - After logging in, the user sees the Text Finder UI.
 - The user can search for terms (e.g., "plugins"). If results are
   found, they can navigate through them.
 - Clicking "Next" and "Previous" navigates between occurrences.

### Development

 - Start Plugin: pnpm start-plugin
 - Start Server: pnpm start-server
 - Build Plugin: pnpm build-plugin
 - Build Server: pnpm build-server
 - Lint Plugin: pnpm lint-plugin
 - Lint Server: pnpm lint-server
 - Concurrent Development: pnpm start

### Installation
To initialize the project:

    pnpm run init-project

### Running the Project 

To run the project in development mode:

    pnpm start

To build the project for production:

    pnpm build

### Flowchart

[View on Eraser![](https://app.eraser.io/workspace/F8VBcW2fbVxhed41JoDf/preview?elements=DDu_7JVK97cpk7MpjcFMUQ&type=embed)](https://app.eraser.io/workspace/F8VBcW2fbVxhed41JoDf?elements=DDu_7JVK97cpk7MpjcFMUQ)
