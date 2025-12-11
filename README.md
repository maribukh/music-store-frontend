# Music Store Frontend

![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Copyright](https://img.shields.io/badge/Copyright-Mariam%20Bukhaidze-blue?style=flat-square)

This repository contains the client-side application for the Music Store platform. It is a Single Page Application (SPA) built with **React** and **TypeScript**, designed to interact with a RESTful backend API. The application provides a comprehensive user interface for browsing music catalogs, managing a shopping cart, and processing user authentication.

---

## Project Overview

The primary goal of this project is to demonstrate a scalable frontend architecture using modern React patterns. It focuses on component reusability, strict type safety, and responsive design principles.

### Key Features

*   **Catalog Management:** Dynamic rendering of music albums and artists fetched from the API.
*   **Search & Filtering:** Real-time search functionality and category filtering.
*   **Shopping Cart Logic:** Client-side state management for adding/removing items and calculating totals.
*   **Authentication:** JWT-based login and registration flows.
*   **Responsive Design:** Adaptive layout optimized for desktop, tablet, and mobile interfaces.

---

## Technology Stack

The project utilizes the following technologies and libraries:

| Category | Technology |
| :--- | :--- |
| **Core Framework** | React 18 |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | SCSS / CSS Modules |
| **Routing** | React Router DOM |
| **HTTP Client** | Fetch API / Axios |
| **Code Quality** | ESLint, Prettier |

---

## Project Structure

The application follows a modular directory structure to ensure maintainability and separation of concerns:

```text
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components (Buttons, Inputs, Cards)
├── context/         # Global state management context
├── hooks/           # Custom React hooks
├── pages/           # Route-specific components (Home, Catalog, Cart)
├── services/        # API integration and HTTP request handlers
├── types/           # TypeScript interfaces and type definitions
├── utils/           # Helper functions and utilities
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```
### 2. Install Dependencies

npm install

### 3. Environment Configuration
Create a **.env** file in the root directory. You must define the backend API URL.
```bash
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Server
```bash
npm run dev
```

## Backend Integration

This frontend application functions as a dependent client and requires an active instance of the **Music Store API**.

Ensure the backend service is configured to accept Cross-Origin Resource Sharing (CORS) requests from the frontend and supports the following RESTful endpoints:

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | User authentication and token generation |
| `POST` | `/auth/register` | New user account creation |
| `GET` | `/products` (or `/albums`) | Retrieval of music catalog data |
| `POST` | `/orders` | Processing of shopping cart checkout |

For comprehensive API documentation, including request payloads and response schemas, please refer to the **[Music Store Backend Repository](https://github.com/maribukh/music-store-backend)**.

## Copyright & License

**© 2025 Mariam Bukhaidze. All Rights Reserved.**

This project is the intellectual property of the author. The source code is published for **portfolio demonstration and educational purposes only**.

*   **Allowed:** Viewing the code and cloning the repository for personal study or evaluation.
*   **Prohibited:** Commercial use, redistribution, modification, or using this code in other projects without explicit permission from the author.


