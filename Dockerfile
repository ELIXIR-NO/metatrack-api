FROM maven:3-eclipse-temurin-24 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:24-jre

LABEL maintainer="Joshua Baskaran <joshua.baskaran@uit.no>"
LABEL description="Metatrack API"

RUN groupadd -r spring && useradd -r -g spring spring
USER spring

WORKDIR /app

COPY --from=build /app/target/*jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]