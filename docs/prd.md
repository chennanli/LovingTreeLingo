# LovingTree Lingo Product Requirements Document (PRD)

## Goals and Background Context

### Goals
* To create a simple, clean, and accessible mobile-first experience for bidirectional language learning between English and Chinese.
* To provide an intuitive and uncluttered user interface using Chakra UI, focusing on the specific needs of learners in this language pair.
* To achieve 10,000 user sign-ups within the first six months.
* To maintain a first-month user retention rate above 40%.

### Background Context
While many language apps exist, there is a gap for learners focusing specifically on the English-Chinese language pair, particularly in a mobile-first environment. Existing tools can be overly complex, generic, or fail to address the unique challenges of learning Mandarin characters for English speakers or nuanced English grammar for Chinese speakers. LovingTree Lingo aims to solve this by providing a minimalist, streamlined application that prioritizes ease of use and a clear learning path, making the difficult task of learning English or Chinese more enjoyable and effective on the go.

### Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2025-08-04 | 1.1 | Revised PRD draft with new project name and scope. | John, Product Manager |

## Requirements

### Functional
* **FR1:** The system must provide a secure user authentication system (e.g., email/password and social logins) to allow users, particularly children, to have their own accounts and track progress.
* **FR2:** The application must feature a browsable library of single Chinese characters, with content sourced from the "Jinan Chinese" (暨南中文) curriculum.
* **FR3:** When a user selects a character, the application must display its details, including pinyin, an animated stroke order diagram, and associated vocabulary words.
* **FR4:** The application must provide interactive practice modules and tests for the characters and vocabulary learned (e.g., multiple-choice, matching games).
* **FR5:** The application must include a personal dashboard for each user to track their learning progress, showing metrics like characters mastered and test scores.
* **FR6:** The system must have a simple content management interface for an administrator to input and manage the character and vocabulary data from the Jinan Chinese textbooks.

### Non-Functional
* **NFR1:** The application must be designed with a mobile-first approach, ensuring a seamless and responsive experience on smartphones, tablets, and desktops.
* **NFR2:** The user interface shall be built using Chakra UI, focusing on a clean, inviting, and simple design that is engaging for young children.
* **NFR3:** To support the learning environment, the application's UI text (instructions, buttons, menus) must support both English and Simplified Chinese.
* **NFR4:** The application must be performant, with all user interactions and page loads completing in under 2 seconds on a typical mobile network connection.
* **NFR5:** The backend infrastructure will be designed to minimize operational costs, leveraging free or low-cost tiers of the selected cloud services where feasible.

## User Interface Design Goals

### Overall UX Vision
The user experience will be simple, encouraging, and free of distractions. The primary goal is to make learning feel like a gentle, guided activity, not a chore. The app will use positive reinforcement, clear progression, and a friendly tone to keep young learners engaged.

### Key Interaction Paradigms
Interactions will be designed for small hands on mobile devices. This includes large, easy-to-tap buttons and clear visual feedback for every action. Navigation will be simple, with a clear path back to the main dashboard at all times. Swiping and tapping will be the primary interaction methods.

### Core Screens and Views
* **Login/Welcome Screen**: A simple, friendly entry point to the app.
* **Main Dashboard**: The user's "home base," showing their current lesson, overall progress, and access to different learning modules.
* **Character Library**: A screen where users can browse the characters they can learn.
* **Lesson Screen**: The main learning interface where a character's stroke order, pinyin, and vocabulary are presented.
* **Practice/Test Screen**: The interactive quiz view for testing knowledge.
* **Settings Page**: For managing account details and preferences.

### Accessibility: WCAG AA
The application will be designed to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

### Branding
The branding for "LovingTree Lingo" will be playful, soft, and encouraging. The visual design will utilize a color palette with soft, friendly colors, rounded shapes, and clean typography.

### Target Device and Platforms: Web Responsive
The application will be built using a mobile-first, responsive web design.

## Technical Assumptions

### Repository Structure: Monorepo
A monorepo (a single repository for all code) is recommended to simplify development and code sharing.

### Service Architecture: Serverless/BaaS-driven
The architecture will be driven by a Backend-as-a-Service (BaaS) platform (e.g., Supabase) to accelerate MVP development.

### Testing Requirements: Unit + Integration
Our testing strategy for the MVP will focus on a combination of Unit tests and Integration tests.

### Additional Technical Assumptions and Requests
* The frontend will be built using **React** (likely with **Next.js**).
* **Chakra UI** will be the primary UI component library.
* The application will be deployed on a modern hosting platform like **Vercel** or **Netlify**.
* The curriculum content will be managed within the database of the chosen BaaS platform.

## Epic List

* **Epic 1: Foundation & Core Learning Experience**
    * **Goal:** Establish the core application infrastructure, user authentication, and the fundamental feature of Browse and viewing Chinese characters and their associated vocabulary.
* **Epic 2: Interactive Practice & Progress Tracking**
    * **Goal:** Introduce interactive learning through practice modules and tests, and provide users with a personal dashboard to track their learning journey and accomplishments.
* **Epic 3: Content Management**
    * **Goal:** Develop a secure administrative interface for managing the curriculum content.

## Epic 1: Foundation & Core Learning Experience

### Story 1.1: Project Initialization & Foundational Setup
**As a** developer, **I want** the initial project structure set up, **so that** we have a working foundation.
* **Acceptance Criteria:** A new Next.js project is initialized, Chakra UI is configured, a BaaS project is created, and a "Welcome" page is deployed.

### Story 1.2: User Authentication
**As a** new user, **I want** to sign up and log in, **so that** my progress can be saved.
* **Acceptance Criteria:** A user can create an account, log in, and log out. Protected routes are in place.

### Story 1.3: Character Library Display
**As a** logged-in user, **I want** to see a library of characters, **so that** I can choose what to learn.
* **Acceptance Criteria:** A `/library` page displays characters fetched from the database.

### Story 1.4: Character Detail View
**As a** logged-in user, **I want** to view the details of a character, **so that** I can learn about it.
* **Acceptance Criteria:** Clicking a character navigates to a detail page showing pinyin, stroke order, and vocabulary.

## Epic 2: Interactive Practice & Progress Tracking

### Story 2.1: Interactive Practice Module
**As a** learner, **I want** to practice vocabulary, **so that** I can reinforce my knowledge.
* **Acceptance Criteria:** A "Practice" button launches a multiple-choice quiz with feedback and a final score.

### Story 2.2: Track Quiz Results
**As a** developer, **I want** to save quiz results, **so that** progress can be tracked.
* **Acceptance Criteria:** Quiz scores are saved to the database, associated with the user and character.

### Story 2.3: User Progress Dashboard
**As a** learner, **I want** a dashboard to see my progress, **so that** I can stay motivated.
* **Acceptance Criteria:** A `/dashboard` page displays a summary of learned characters and recent quiz scores.

## Epic 3: Content Management

### Story 3.1: Admin Interface & Security
**As an** administrator, **I want** a secure section to manage content, **so that** I can maintain the curriculum.
* **Acceptance Criteria:** An `/admin` area is restricted to users with an "admin" role.

### Story 3.2: Manage Characters
**As an** administrator, **I want** to add, edit, and delete characters, **so that** I can build the curriculum.
* **Acceptance Criteria:** Full CRUD (Create, Read, Update, Delete) functionality for characters is available in the admin area.

### Story 3.3: Manage Associated Vocabulary
**As an** administrator, **I want** to manage vocabulary for a character, **so that** I can create lessons.
* **Acceptance Criteria:** Full CRUD functionality for a character's associated vocabulary is available.

## Checklist Results Report
This PRD is well-aligned with the core requirements for an MVP. The scope is appropriately limited, and the epics and stories are logically sequenced to deliver value incrementally.

## Next Steps

### UX Expert Prompt
> Please review this PRD to create a detailed UI/UX Specification for the 'LovingTree Lingo' application. Focus on creating a child-friendly, engaging, and accessible mobile-first design system based on the specified Chakra UI component library.

### Architect Prompt
> Please review this PRD to create a detailed technical architecture document. The key technical assumptions include using Next.js, Chakra UI, a BaaS backend (like Supabase), and a monorepo structure. Your architecture should provide a clear blueprint for implementation.