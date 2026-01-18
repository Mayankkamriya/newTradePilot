# Trade Pilot

Trade Pilot is a **project-based freelancing platform** that connects **Clients** with **Freelancers** for transparent bidding, structured project execution, and controlled delivery.

## Overview

The platform enables clients to post projects with budgets and deadlines, while freelancers bid with proposals and timelines. Projects move through a clear lifecycle from creation to completion.

## Roles

### Client

* Creates projects with budget and deadline
* Reviews bids submitted by freelancers
* Selects a bid to start the project
* Tracks project progress
* Receives final deliverables

### Freelancer

* Browses available projects
* Submits bids with price and estimated time
* Works on selected projects
* Uploads deliverables to complete projects

## Core Workflow

1. **Client posts a project**
2. **Freelancers submit bids**
3. **Client selects a bid**
4. **Project moves to In Progress**
5. **Freelancer submits deliverables**
6. **Project marked as Completed**

## Key Features

* Role-based access (Client / Freelancer)
* Secure authentication with JWT
* Project bidding system
* Project status tracking
* Deliverable upload support
* Email notifications for key project updates
* Responsive UI for desktop and mobile

## Testing Credentials

Use the following credentials to test the platform:

### Client Account

* **Email:** [mayankkamriya305@gmail.com](mailto:mayankkamriya305@gmail.com)
* **Password:** 123456

### Freelancer Account

* **Email:** [mayankkamriya99@gmail.com](mailto:mayankkamriya99@gmail.com)
* **Password:** 123456

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** PostgreSQL with Prisma ORM
* **Authentication:** JWT-based auth
* **Email:** Nodemailer
* **Deployment:** Vercel (Frontend & API)

## Design Highlights

* Clear separation between public and authenticated routes
* Role-based UI rendering without changing routes
* Stateless backend suitable for serverless deployment
* Scalable schema design for future features
