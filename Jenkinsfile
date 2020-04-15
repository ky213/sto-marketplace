#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
    }

    gitlabCommitStatus('build') {
        docker.image('jhipster/jhipster:v6.8.0').inside('-u jhipster -e MAVEN_OPTS="-Duser.home=./"') {
            stage('check java') {
                sh "java -version"
            }

            stage('clean') {
                sh "chmod +x mvnw"
                sh "./mvnw -ntp clean"
            }
            stage('nohttp') {
                sh "./mvnw -ntp checkstyle:check"
            }

            stage('install tools') {
                sh "./mvnw -ntp com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v12.16.1 -DnpmVersion=6.14.2"
            }

            stage('npm install') {
                sh "./mvnw -ntp com.github.eirslett:frontend-maven-plugin:npm"
            }

            stage('backend tests') {
                try {
                    sh "./mvnw -ntp verify"
                } catch(err) {
                    throw err
                } finally {
                    junit '**/target/test-results/**/TEST-*.xml'
                }
            }

            stage('frontend tests') {
                try {
                    sh "./mvnw -ntp com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='run test-ci'"
                } catch(err) {
                    throw err
                } finally {
                    junit '**/target/test-results/**/TEST-*.xml'
                }
            }

            stage('packaging') {
                sh "./mvnw -ntp verify -Pprod -DskipTests"
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
            }
            stage('quality analysis') {
                withSonarQubeEnv('sonar') {
                    sh "./mvnw -ntp initialize sonar:sonar"
                }
            }
        }

        def dockerImage
        stage('publish docker') {
            // A pre-requisite to this step is to setup authentication to the docker registry
            // https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#authentication-methods
            sh "./mvnw -ntp jib:build"
        }
    }
}
