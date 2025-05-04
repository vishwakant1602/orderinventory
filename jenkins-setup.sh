#!/bin/bash
# Jenkins Setup Script for Order Inventory System
# This script helps set up Jenkins for your project

set -e

echo "===== Jenkins Setup for Order Inventory System ====="
echo "Setting up Jenkins for your project..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "Docker installed successfully!"
else
    echo "Docker is already installed."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully!"
else
    echo "Docker Compose is already installed."
fi

# Create Jenkins data directory
echo "Creating Jenkins data directory..."
mkdir -p jenkins_home

# Ask for custom web port
read -p "Enter port for Jenkins web interface (default: 8080): " JENKINS_WEB_PORT
JENKINS_WEB_PORT=${JENKINS_WEB_PORT:-8080}

# Ask for custom agent port
read -p "Enter port for Jenkins agent connections (default: 50000): " JENKINS_AGENT_PORT
JENKINS_AGENT_PORT=${JENKINS_AGENT_PORT:-50000}

# Create docker-compose file for Jenkins
echo "Creating docker-compose file for Jenkins..."
cat > jenkins-docker-compose.yml << EOL
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    restart: unless-stopped
    privileged: true
    user: root
    ports:
      - ${JENKINS_WEB_PORT}:8080
      - ${JENKINS_AGENT_PORT}:50000
    volumes:
      - ./jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=true
EOL

# Create Jenkins plugins file
echo "Creating Jenkins plugins file..."
cat > jenkins-plugins.txt << 'EOL'
git
workflow-aggregator
pipeline-stage-view
blueocean
docker-workflow
credentials-binding
timestamper
ansicolor
sonar
checkstyle
warnings-ng
dependency-check-jenkins-plugin
github-branch-source
slack
EOL

# Create initial Jenkins job
echo "Creating initial Jenkins job configuration..."
mkdir -p jenkins_home/jobs/order-inventory-system/
cat > jenkins_home/jobs/order-inventory-system/config.xml << 'EOL'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.42">
  <description>Order Inventory System Pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.94">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.10.0">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/vishwakant1602/orderinventorysystem4.git</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="empty-list"/>
      <extensions/>
    </scm>
    <scriptPath>Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOL

echo "Starting Jenkins container..."
docker-compose -f jenkins-docker-compose.yml up -d

echo "Waiting for Jenkins to start..."
sleep 10

echo "===== Jenkins Setup Complete ====="
echo "Jenkins is now running at http://localhost:${JENKINS_WEB_PORT}"
echo "To get the initial admin password, run:"
echo "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
echo ""
echo "IMPORTANT: Before using the pipeline, please:"
echo "1. Complete the Jenkins setup wizard"
echo "2. Install the suggested plugins from jenkins-plugins.txt"
echo "3. Set up Docker Hub credentials in Jenkins with ID 'docker-hub-credentials'"
echo ""
echo "For more information, see the README.md file."
