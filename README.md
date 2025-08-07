# Metatrack API

Metatrack API is a RESTful web service for managing scientific metadata following the ISA (Investigation-Study-Assay)
model. It provides a comprehensive solution for tracking and managing metadata related to scientific experiments, with a
focus on biological and biomedical research.

## Features

- **ISA Model Implementation**: Structured data model following the Investigation-Study-Assay framework
- **Sample Management**: Create, retrieve, and delete sample metadata
- **Study Organization**: Group related samples and assays within studies
- **Investigation Management**: Organize studies within investigations
- **Ontology Support**: Link metadata to standard ontologies for better interoperability
- **User Authentication**: Register and manage user accounts
- **File Upload**: Support for uploading and managing experimental data files
- **RESTful API**: Well-structured endpoints following REST principles

## Technologies Used

- **Java 24+**: Core programming language
- **Spring Boot**: Application framework
- **Spring Data Neo4j**: Data access layer
- **Neo4j**: Graph database for storing connected metadata
- **Maven**: Dependency management and build tool
- **MinIO**: Object storage for experimental data files
- **Spring Security**: Authentication and authorization
- **Keycloak**: Identity and access management solution

## Getting Started

### Prerequisites

- Java 24 or higher
- Maven 3.6 or higher
- Neo4j 5 or higher
- MinIO
- Keycloak 22.0 or higher
- PostgreSQL 17 or higher (for Keycloak)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ELIXIR-NO/metatrack-api.git
   cd metatrack-api
   ```

2. Configure the application:
    - Edit `src/main/resources/application.yaml` to set up database connections and other properties

3. Build the application:
   ```bash
   ./mvnw clean install
   ```

4. Start the infrastructure services:
   ```bash
   docker-compose up -d
   ```

5. Configure Keycloak (available at `http://localhost:8090`):
    - Log in to the admin console using username `admin` and password `admin`
    - Create a new realm for the application
    - Configure client settings and user roles

6. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The API will be available at `http://localhost:8080/api/v1/`.
Keycloak administration console will be available at `http://localhost:8090`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contact

ELIXIR Norway - [https://elixir.no/](https://elixir.no/)

Project Link: [https://github.com/ELIXIR-NO/metatrack-api](https://github.com/ELIXIR-NO/metatrack-api)
