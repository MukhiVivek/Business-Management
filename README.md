# Business Management & Analysis

## 📌 Overview

This Business Management & Analysis is a comprehensive solution designed to streamline and automate various business operations. It offers functionalities such as inventory management, sales tracking, customer relationship management, and more, providing businesses with the tools they need to operate efficiently.

## 🛠️ Features

- **Inventory Management**: Track and manage stock levels, product details, and supplier information.
- **Sales Tracking**: Monitor sales performance, generate invoices, and manage transactions.
- **Customer Management**: Maintain customer records, contact information, and purchase history.
- **Reporting**: Generate detailed reports on sales, inventory, and customer activities.
- **User Authentication**: Secure login and registration system to protect sensitive data.

## 🧰 Tech Stack

- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

<!-- ## 🏢 Our Solution

- **Centralizes** inventory, sales, and customer management into a single, intuitive dashboard.
- **Automates** routine tasks like reporting, stock monitoring, and transaction recording.
- **Secures** sensitive business and customer data with modern authentication practices (JWT-based).
- **Enables** real-time insights through smart reporting tools to drive better decision-making.
- **Scales** with the business, adapting to evolving needs without needing expensive IT overhauls. -->

## 📈 Mermaid Diagram

flowchart TB
    %% Deployment Layer
    subgraph "Deployment/CD" 
        direction TB
        Vercel["Vercel Hosting"]:::deployment
    end

    %% User Browser
    subgraph "Client Side"
        direction TB
        Browser["User Browser"]:::external
        Vercel -->|serves static files: HTML, JS| Browser

        ReactSPA["React SPA"]:::frontend
        Browser -->|loads SPA| ReactSPA

        Config["Config.jsx"]:::frontend
        ReactSPA -->|imports API base URL\nand JWT logic| Config

        subgraph "Pages & Components"
            direction TB
            subgraph "Landing Pages"
                direction TB
                CustomersPage["Customers.jsx"]:::frontend
                AddCustomer["Add_customer.jsx"]:::frontend
                CustomersList["CustomersList.jsx"]:::frontend

                DashboardPage["Dashboard.jsx"]:::frontend
                BarChart["BarChart.jsx"]:::frontend
                LatestTX["LatestTransaction.jsx"]:::frontend

                InvoicePage["Invoice.jsx"]:::frontend

                SignIn["SignIn.jsx"]:::frontend
                Signup["Signup.jsx"]:::frontend

                OrdersPage["Orders.jsx"]:::frontend
                ProductsPage["Products.jsx"]:::frontend
            end

            subgraph "Shared Components"
                direction TB
                Sidebar["Sidebar.jsx"]:::frontend
                Dropdown["Dropdown.jsx"]:::frontend
            end
        end

        ReactSPA --> CustomersPage
        ReactSPA --> DashboardPage
        ReactSPA --> InvoicePage
        ReactSPA --> SignIn
        ReactSPA --> OrdersPage
        ReactSPA --> ProductsPage
        ReactSPA --> Sidebar

        click ReactSPA "Frontend/src/main.jsx"
        click Config "Frontend/src/Config.jsx"
        click CustomersPage "Frontend/src/landing_page/Customers/Customers.jsx"
        click AddCustomer "Frontend/src/landing_page/Customers/Add_customer.jsx"
        click CustomersList "Frontend/src/landing_page/Customers/Component/CustomersList.jsx"
        click DashboardPage "Frontend/src/landing_page/Dashboard/Dashboard.jsx"
        click BarChart "Frontend/src/landing_page/Dashboard/BarChart/BarChart.jsx"
        click LatestTX "Frontend/src/landing_page/Dashboard/LatestTransaction.jsx"
        click InvoicePage "Frontend/src/landing_page/Invoice/Invoice.jsx"
        click SignIn "Frontend/src/landing_page/LoginPag/SignIn.jsx"
        click Signup "Frontend/src/landing_page/LoginPag/Signup.jsx"
        click OrdersPage "Frontend/src/landing_page/Orders/Orders.jsx"
        click ProductsPage "Frontend/src/landing_page/Products/Products.jsx"
        click Sidebar "Frontend/src/landing_page/includes/Sidebar/Sidebar.jsx"
        click Dropdown "Frontend/src/landing_page/includes/Sidebar/Dropdown/Dropdown.jsx"
    end

    %% API Layer
    subgraph "Backend/API Layer"
        direction TB
        APIGateway["API Gateway / Load Balancer"]:::backend
        APIGateway -->|HTTP/JSON| ExpressAPI["Express API\n(index.ts)"]:::backend
        click ExpressAPI "Backend/src/index.ts"

        subgraph "Middleware"
            direction TB
            JWT["JWT Auth Middleware"]:::backend
        end
        ExpressAPI --> JWT

        subgraph "Routes (Controllers)"
            direction TB
            CustomerRoute["customer.ts"]:::backend
            DriverRoute["driver.ts"]:::backend
            InvoiceRoute["invoice.ts"]:::backend
            MapRoute["map.ts"]:::backend
            OrderRoute["order.ts"]:::backend
            TXRoute["transaction.ts"]:::backend
            UserRoute["user.ts"]:::backend
        end
        ExpressAPI --> CustomerRoute
        ExpressAPI --> DriverRoute
        ExpressAPI --> InvoiceRoute
        ExpressAPI --> MapRoute
        ExpressAPI --> OrderRoute
        ExpressAPI --> TXRoute
        ExpressAPI --> UserRoute

        click CustomerRoute "Backend/src/routes/customer.ts"
        click DriverRoute "Backend/src/routes/driver.ts"
        click InvoiceRoute "Backend/src/routes/invoice.ts"
        click MapRoute "Backend/src/routes/map.ts"
        click OrderRoute "Backend/src/routes/order.ts"
        click TXRoute "Backend/src/routes/transaction.ts"
        click UserRoute "Backend/src/routes/user.ts"

        subgraph "Data Models"
            direction TB
            CustomerModel["customer.ts"]:::backend
            UserModel["user.ts"]:::backend
        end
        CustomerRoute --> CustomerModel
        UserRoute --> UserModel

        click CustomerModel "Backend/src/models/customer.ts"
        click UserModel "Backend/src/models/user.ts"

        ConfigBackend["tsconfig.json"]:::backendConfig
        PackageBackend["package.json"]:::backendConfig
        ConfigFrontendPkg["Frontend/package.json"]:::frontendConfig
        click ConfigBackend "Backend/tsconfig.json"
        click PackageBackend "Backend/package.json"
        click ConfigFrontendPkg "Frontend/package.json"
    end

    %% Class Definitions
    classDef frontend fill:#f9f,stroke:#333,stroke-width:2px;
    classDef backend fill:#bbf,stroke:#333,stroke-width:2px;
    classDef deployment fill:#bfb,stroke:#333,stroke-width:2px;
    classDef external fill:#ffb,stroke:#333,stroke-width:2px;
    classDef backendConfig fill:#fcc,stroke:#333,stroke-width:2px;
    classDef frontendConfig fill:#cfc,stroke:#333,stroke-width:2px;
