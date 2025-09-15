Kubernetes secrets for Metatrack deployments

This document explains how to create and apply the Kubernetes Secrets needed by the manifests in this repository, what
variables are required, and provides a ready-to-use template you can fill in.

Important

- Never commit real secret values to Git. Only commit templates or placeholder values.
- All values under data: in a Secret must be base64-encoded. See How to base64 encode values below.
- Ensure you apply the secrets into the same namespace used by the deployments (default here: elixir-uit-ns11105k).

Secrets required
The manifests in k8s/nird reference the following Secrets and keys:

1. postgres-secret (Opaque)

- username: PostgreSQL user for Keycloak database.
- password: PostgreSQL user password.

2. keycloak-secret (Opaque)

- admin-username: Initial Keycloak admin username.
- admin-password: Initial Keycloak admin password.

3. neo4j-secret (Opaque)

- auth: auth string (username/password)

4. metatrack-secret (Opaque)

- oauth-client-id: OAuth2 client ID registered in Keycloak for the metatrack-api client.
- oauth-client-secret: OAuth2 client secret matching the client above.

Where these are used

- k8s/nird/keycloak/deployment.yaml uses postgres-secret (KC_DB_USERNAME, KC_DB_PASSWORD) and keycloak-secret (
  KC_BOOTSTRAP_ADMIN_USERNAME, KC_BOOTSTRAP_ADMIN_PASSWORD).
- k8s/nird/metatrack/deployment.yaml uses neo4j-secret (SPRING_NEO4J_AUTHENTICATION_USERNAME,
  SPRING_NEO4J_AUTHENTICATION_PASSWORD) and metatrack-secret (
  SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_KEYCLOAK_CLIENT_ID,
  SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_KEYCLOAK_CLIENT_SECRET).

Namespace
All provided manifests use namespace: elixir-uit-ns11105k. If you deploy to another namespace, update:

- metadata.namespace in the secrets and deployments, or
- pass -n <your-namespace> to kubectl commands and ensure matching namespaces in all manifests.

Secrets template (fill in and apply)
Save the following as k8s/nird/secrets.yaml (or another path of your choice). Replace the placeholder values after
base64-encoding your real values.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: elixir-uit-ns11105k
type: Opaque
data:
  username: <base64-encoded-postgres-username>
  password: <base64-encoded-postgres-password>
---
apiVersion: v1
kind: Secret
metadata:
  name: keycloak-secret
  namespace: elixir-uit-ns11105k
type: Opaque
data:
  admin-username: <base64-encoded-keycloak-admin-username>
  admin-password: <base64-encoded-keycloak-admin-password>
---
apiVersion: v1
kind: Secret
metadata:
  name: neo4j-secret
  namespace: elixir-uit-ns11105k
type: Opaque
data:
  auth: <base64-encoded-neo4j-auth-string-or-remove-line>
---
apiVersion: v1
kind: Secret
metadata:
  name: metatrack-secret
  namespace: elixir-uit-ns11105k
type: Opaque
data:
  oauth-client-id: <base64-encoded-oauth-client-id>
  oauth-client-secret: <base64-encoded-oauth-client-secret>
```

How to base64 encode values

- macOS/Linux: echo -n "your-value" | base64
- Windows PowerShell: [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("your-value"))
  Notes:
- Use echo -n to avoid adding a trailing newline. If you accidentally include a newline, decoding may produce an
  unexpected suffix.
- To decode and verify: echo -n "<encoded>" | base64 --decode

Apply the secrets
From the repository root (or from within k8s/nird), run:

- kubectl apply -f k8s/nird/secrets.yaml
  If you use a different namespace than the one inside the file, override with:
- kubectl apply -f k8s/nird/secrets.yaml -n <your-namespace>

Verify the secrets

- kubectl get secrets -n elixir-uit-ns11105k
- kubectl describe secret postgres-secret -n elixir-uit-ns11105k
  (Values are not shown in plaintext, but you can verify key names exist.)

Updating existing secrets
If you change a value in the YAML and apply again, Kubernetes will update the Secret. Pods that consume secrets as
environment variables generally need to be restarted to pick up changes. You can restart a Deployment with:

- kubectl rollout restart deployment/<deployment-name> -n <namespace>
  Examples:
- kubectl rollout restart deployment/keycloak -n elixir-uit-ns11105k
- kubectl rollout restart deployment/metatrack-api -n elixir-uit-ns11105k

Alternative: create secrets with kubectl create secret generic
Instead of maintaining YAML, you can create the same secrets via CLI (values are NOT base64 here; kubectl encodes them
for you):

```shell
kubectl create secret generic postgres-secret \
  -n elixir-uit-ns11105k \
  --from-literal=username=<postgres-username> \
  --from-literal=password=<postgres-password>

kubectl create secret generic keycloak-secret \
  -n elixir-uit-ns11105k \
  --from-literal=admin-username=<admin-user> \
  --from-literal=admin-password=<admin-pass>

kubectl create secret generic neo4j-secret \
  -n elixir-uit-ns11105k \
  --from-literal=auth=<neo4j-auth>

kubectl create secret generic metatrack-secret \
  -n elixir-uit-ns11105k \
  --from-literal=oauth-client-id=<client-id> \
  --from-literal=oauth-client-secret=<client-secret>
```

Security best practices

- Store real secrets in a dedicated secret manager (e.g., External Secrets Operator, sealed-secrets, SOPS) and avoid
  plain YAML in repos.
- Limit RBAC access to read/update secrets in the namespace.
- Rotate credentials regularly and after any potential exposure.

Troubleshooting

- Pod fails to start due to missing env: Ensure the Secret exists in the same namespace and key names match exactly
  those referenced in the deployment manifests.
- Authentication errors after rotate: Confirm pods were restarted so they pick up the new secret values.
- Base64 mismatch: Re-encode using echo -n to avoid trailing newline characters.