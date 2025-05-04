# Jenkins Setup for Order Inventory System

This guide explains how to set up Jenkins for your Order Inventory System project.

## Prerequisites

- Docker and Docker Compose installed
- Git installed
- Access to your GitHub repository

## Setup Instructions

1. Run the setup script:
   \`\`\`bash
   chmod +x jenkins-setup.sh
   ./jenkins-setup.sh
   \`\`\`

2. Access Jenkins at http://localhost:8080

3. Get the initial admin password:
   \`\`\`bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   \`\`\`

4. Complete the Jenkins setup wizard and create an admin user

5. Install the recommended plugins:
   - Git
   - Pipeline
   - Docker Pipeline
   - Blue Ocean
   - SonarQube Scanner
   - Checkstyle
   - Warnings Next Generation
   - OWASP Dependency-Check
   - GitHub Branch Source
   - Slack Notification

6. Configure Jenkins:
   - Go to Manage Jenkins > Configure System
   - Set up SonarQube server
   - Configure GitHub server
   - Set up Docker registry credentials

7. Update the job configuration:
   - Go to the "order-inventory-system" job
   - Click "Configure"
   - Update the GitHub repository URL to your repository

8. Set up credentials:
   - Go to Manage Jenkins > Manage Credentials
   - Add GitHub credentials
   - Add Docker registry credentials
   - Add SonarQube token

## Using the Pipeline

The Jenkins pipeline is configured to use the `Jenkinsfile` in your repository. Make sure your Jenkinsfile is properly configured for your project.

## Troubleshooting

If you encounter any issues:

1. Check the Jenkins logs:
   \`\`\`bash
   docker logs jenkins
   \`\`\`

2. Ensure Docker has sufficient permissions:
   \`\`\`bash
   sudo chmod 666 /var/run/docker.sock
   \`\`\`

3. Verify your Jenkinsfile syntax using the Jenkins Pipeline Linter

## Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
