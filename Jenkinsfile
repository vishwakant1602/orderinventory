pipeline {
    agent none // We'll define agents per stage
    
    environment {
        VERSION = "${BUILD_NUMBER}"
        // DOCKER_REGISTRY = "your-docker-registry" // Optional: if pushing to a registry
    }
    
    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
                echo "Checked out code from repository"
            }
        }
        
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-u root -v /tmp/npm-cache:/root/.npm' // Cache npm packages
                }
            }
            steps {
                sh '''
                    echo "Using Node.js $(node -v)"
                    npm install --legacy-peer-deps
                    npm run build
                '''
                stash(name: 'frontend-build', includes: 'build/')
            }
            post {
                failure {
                    echo "Frontend build failed - check npm logs"
                }
            }
        }
        
        stage('Test Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-u root'
                }
            }
            steps {
                unstash 'frontend-build'
                sh 'npm test -- --watchAll=false --ci'
            }
        }
        
        stage('Build Backend Services') {
            agent {
                docker {
                    image 'maven:3.8.6-openjdk-11'
                    args '-u root -v $HOME/.m2:/root/.m2' // Cache Maven packages
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        ./mvnw clean package -DskipTests
                        # If no wrapper, fallback to system mvn
                        [ -f "./mvnw" ] || mvn clean package -DskipTests
                    '''
                }
                stash(name: 'backend-jars', includes: 'backend/target/*.jar')
            }
        }
        
        stage('Test Backend Services') {
            agent {
                docker {
                    image 'maven:3.8.6-openjdk-11'
                    args '-u root -v $HOME/.m2:/root/.m2'
                }
            }
            steps {
                dir('backend') {
                    sh './mvnw test || [ -f "./mvnw" ] || mvn test'
                }
            }
        }
        
        stage('Build Docker Images') {
            agent {
                docker {
                    image 'docker:20.10-dind'
                    args '--privileged -v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                unstash 'frontend-build'
                unstash 'backend-jars'
                
                script {
                    // Frontend image
                    if (fileExists('Dockerfile')) {
                        docker.build("orderinventory-frontend:${VERSION}", ".")
                    }
                    
                    // Backend images
                    if (fileExists('backend')) {
                        dir('backend') {
                            def services = [
                                'eureka-server',
                                'api-gateway', 
                                'order-service',
                                'inventory-service',
                                'auth-service',
                                'payment-service'
                            ]
                            
                            services.each { service ->
                                if (fileExists("${service}/Dockerfile")) {
                                    docker.build("orderinventory-${service}:${VERSION}", "./${service}")
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Integration Test') {
            agent {
                docker {
                    image 'docker/compose:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                script {
                    try {
                        sh 'docker-compose up -d --build'
                        sleep(time: 30, unit: 'SECONDS')
                        // Add your actual test commands here
                        // Example: sh './run-integration-tests.sh'
                    } finally {
                        sh 'docker-compose down'
                    }
                }
            }
        }
        
        stage('Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            agent {
                docker {
                    image 'docker:20.10'
                    args '-v /var/run/docker.sock:/var/run/docker.sock -u root'
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        
                        // Push frontend
                        if (fileExists('Dockerfile')) {
                            docker.withRegistry("https://${DOCKER_REGISTRY}") {
                                docker.image("orderinventory-frontend:${VERSION}").push()
                            }
                        }
                        
                        // Push backend services
                        if (fileExists('backend')) {
                            def services = [
                                'eureka-server',
                                'api-gateway',
                                // ... other services
                            ]
                            
                            services.each { service ->
                                if (fileExists("backend/${service}/Dockerfile")) {
                                    docker.withRegistry("https://${DOCKER_REGISTRY}") {
                                        docker.image("orderinventory-${service}:${VERSION}").push()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
        success {
            echo "Pipeline succeeded!"
            slackSend(color: 'good', message: "Build ${BUILD_NUMBER} succeeded!")
        }
        failure {
            echo "Pipeline failed!"
            slackSend(color: 'danger', message: "Build ${BUILD_NUMBER} failed!")
        }
    }
}