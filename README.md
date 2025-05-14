# Metatrack

Metatrack is a web application designed to manage and organize complex metadata generated during research, with a particular focus on life-science domains. It is built around the ISA (Investigation-Study-Assay) model, a widely adopted standard for representing experimental metadata in the life sciences. The ISA model provides a structured framework for describing the context, design, and results of scientific experiments, facilitating data sharing, reproducibility, and interoperability.

For more details, refer to the [ISA-JSON specifications](https://isa-specs.readthedocs.io/en/latest/isajson.html "ISA-JSON specifications").

---

## Features

- **ISA Model Support:** Native support for the Investigation-Study-Assay metadata model.
- **Modern Tech Stack:** Built with Bun, ElysiaJS, Drizzle ORM, and PostgreSQL.
- **Secure Authentication:** Integrated with Better-Auth for robust authentication flows.
- **Type Safety:** End-to-end type safety with TypeScript and Drizzle ORM.
- **Developer Friendly:** Fast development experience with Bun and hot reloading.

---

## Tech Stack

- **[Bun](https://bun.sh/):** Modern JavaScript/TypeScript runtime, drop-in Node.js replacement.
- **[ElysiaJS](https://elysiajs.com/):** Ergonomic backend framework with type safety.
- **[Better-Auth](https://www.better-auth.com/):** Secure, flexible authentication for TypeScript.
- **[PostgreSQL](https://www.postgresql.org/):** Reliable, advanced open-source relational database.
- **[Drizzle ORM](https://orm.drizzle.team/):** Type-safe SQL builder and ORM for TypeScript.

---

## Prerequisites

- [Bun](https://bun.sh/) (v1.0 or later)
- [PostgreSQL](https://www.postgresql.org/) (v13 or later)
- Node.js (optional, for tooling)
- [Git](https://git-scm.com/)

---

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/metatrack.git
    cd metatrack
    ```

2. **Install dependencies:**
    ```bash
    bun install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and update the values as needed (e.g., database URL, authentication secrets).

4. **Run database migrations (if applicable):**
    ```bash
    bun run migrate
    ```

5. **Start the development server:**
    ```bash
    bun dev
    ```

6. **Open your browser:**
    - Visit [http://localhost:3000/](http://localhost:3000/) to see the application.

---

## Configuration

- All configuration is managed via environment variables. See `.env.example` for required settings.
- Ensure your PostgreSQL instance is running and accessible.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

---
