# Exchange

Cette application a été généré en utilisant l'outil:  [https://www.jhipster.tech/documentation-archive/v6.8.0](https://www.jhipster.tech/documentation-archive/v6.8.0).
Il comprend un repertoire exchange avec banckend et frontend.

Le Bankend a été developpé en Java avec le Framework Spring Boot
Le Front end a été developpé en TypeScript avec le Framework React

## Developpement

Avant de pouvoir compiler ce projet , vous devez installer sur votre machine les dépendances suivantes : 

1. [Node.js](https://nodejs.org/en/): Nous utilisons NodeJS pour lancer un server web et compiler le projet ReactJS.
    Vous devez donc installer la version LTS de NodeJS sur votre machine
  
Une fois que vous avez installer NodeJS , vous pouvez lancer la commande ci-dessous pour installer les outils de developpement.
Vous n'aurez besoin de lancer cette commande que lorsque les dependances ont été modifiées dans le fichier  [package.json](package.json).

    yarn install

Nous utilisons des script npm et [Webpack](https://webpack.js.org/) pour compiler le projet.


Pour démarrer l'application , lancer les deux commandes dans des terminaux différents 

    ./mvnw
    yarn start

ou 


npm ou yarn est aussi sont utilisés pour la gestion des CSS et Javascript/TypeScript dans l'application.
Vous pouvez mettre à jour les dépencendes en sprécifiant une nouvelle version dans le fichier  [package.json](package.json). 
Vous pouvez aussi lancer la commande  `npm update` et `npm install` pour la gestion des dépendances


La commande  `npm run`  permet de lister tous les scripts disponibles pour démarrer le projet.

### Support du Progressive Web App (PWA)

L'application supporte le PWA (Progressive Web App) , par defaut cette option est désactivée.
Le composant pour la gestion du PWA est le service worker.

Pour activer le service worker et prendre en charge l'option Progressive Web App , vous pouvez décommanter la ligne ci-dessous dans le fichier  `src/main/webapp/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function() {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Notez l'application s'appuie sur : [Workbox](https://developers.google.com/web/tools/workbox/)  la gestion du service worker. Cela génère automatiquement le fichier  `service-worker.js` .


### Projet maven

Vous pouvez démarrer votre application avec la commande 

    ./mvnm (Sur Mac OS ou Linux )  ou mvnw (Windows)

Vous applicattion sera accessible sur l'url  : [http://localhost:8080](http://localhost:8080)



Si vous souhaitez le live reload ( c'est dire avoir la possibilité de modifier le code TypeScript/ReactJS en live ), 
C'est à dire que votre navigateur va automatiquement se rafraichir, dès que vous modifier un de vos fichiers HTML/CSS/TypeScript 
vous pouvez lancer la commande pour activer le live reload :

    yarn start  (avec yarn )  ou npm start (avec NPM)

Votre application sera donc accessible sur l'url  : [http://localhost:9000](http://localhost:9000)
Les apis du backend seront accessible sur l'url  : [http://127.0.0.1:8080/api](http://127.0.0.1:8080/api)

Vous avez aussi la possibilité d'accélerer la démarrage du serveur en excluant les tache webpack : 

    ./mvnm -P-webpack


### Gestion NPM/Yarn et FrontEnd

Les dépendances du projet sont configurées dans le fichier [package.json](package.json).

Vous pouvez lancer d'autres avec npn ou yarn :

Vérifier la qualité du code TypeScript 

    yarn run lint

Essayer de corriger automatiquement les problèmes de qualité de code lint 

    yarn run lint:fix

Compiler le code TypeScript 

    yarn run tsc

Lancer les tests unitaires 

    yarn run test

Faire en sorte que les tests soient déclenchés lorsque le code est modifié 

    yarn run test:watch


Lancer les tests d'intégration avec Protactor ( Chome version 81 minimum) 

    yarn run e2e


### Gestion des dépendances.

Par exemple pour ajouter la librairie a votre application , [Leaflet](https://leafletjs.com/) , vous pouvez lancer la commande ci-dessous :

    npm install --save --save-exact leaflet

Pour utiliser "TypeScript type definitions"  [DefinitelyTyped](https://definitelytyped.org/) dans votre developpement, vous pouvez lancer la commande :

    npm install --save-dev --save-exact @types/leaflet


### Gestion de la base de données

La gestion de la base de données se font automatiquement, c'est a dire si vous modifiez une entité JPA , vous aver besoin de mettre à jour la base de données.

Nous utilisons Liquibase pour la gestion de la mise à jour de la base de données et enregistrer la configuration dans le repertoire : [/src/main/resources/config/liquibase/](/src/main/resources/config/liquibase/)

Il y a deux façons travailler avec Liquibase 
- Utiliser le goal mavem liquibase:diff
- Mettre à jour la base de données manuellement 

#### Avec le  Goal Maven 

Si vous utilisez une base de données MySQL , vous pouvez utiliser la commande ci-dessous pour générer automatiquement le changelog.

*Attention n'oubliez pas de modifier les mots de passes du plugin Liquibase Hibernate dans le fichier de configuration de Maven.*

**Voici le workflow pour modifier une entité JPA et mettre à jour la base de données.**

1 - Modifier l'entité JPA (champs, relation , type ...)
2 - Compiler le code de votre application et lancer la commande de génération du change log  

    ./mvnw compile liquibase:diff

3 - Un nouveau changelog est crée dans le repertoire [src/main/resources/config/liquibase/changelog](src/main/resources/config/liquibase/changelog)

4 - Vérifier ce changelog et ajouter le dans votre fichier [src/main/resources/config/liquibase/master.xml](src/main/resources/config/liquibase/master.xml)


## Deployer en production

### Packager un jar

Pour construire le jar final pour la production , en optimisant aussi les fichiers de l'application Exchange , cela va compiler , tester et packager votre application :
Un fichier sera généré : generate a file target/exchange-0.0.1-SNAPSHOT.jar, vous pouvez faire les modification nécessaire dans le fichier pom.xml pour générer un war.

    ./mvnw -Pprod clean verify

Cette commande va faire la concaténation et la minification des CSS et javascript, elle va aussi modifier le fichier  `index.html` avec les nouvelles références aux fichiers créés.

Pour vérifier que tout fonctionne correctement , lancer la commande ci-dessous : 

    java -jar target/*.jar

Vous pouvez accéder à l'application via l'url :  [http://localhost:8080](http://localhost:8080) 


### Packager un war

Si vous souhaitez faire le packaging en war pour le déploiement sur un serveur, lancer la commande ci-dessous :

    ./mvnw -Pprod,war clean verify
    
    
### Support HTTPS

Vous pouvez activer le support de HTTP/" dans l'application en modifiant le ficher de configuration application-prod.yml  avec la variable  : **jhipster.http.version: V_2_0**

La configuration qui permet de compresser les fichier static se trouve aussi dans le repertoire :  **server.compression.***

Si vous souhaitez lancer optimisation des fichiers javscript sans passer par Maven , vous pouvez utiliser cette commande :

    npm run build 


Vous pouvez activer le HTTPS , em modifiant la variable **server.ssl** adans le fichier de configuration application-prod.yml

N'oubliez pas non plus de faire la génération de des clés ssl (en utilisant let's Ecrypt

ci-dessous un exemple de configuration

 ```
 server:
     port: 443
     ssl:
         key-store: keystore.p12
         key-store-password: <your-password>
         keyStoreType: PKCS12
         keyAlias: <your-application>
         ciphers: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384, TLS_DHE_RSA_WITH_AES_128_GCM_SHA256, TLS_DHE_RSA_WITH_AES_256_GCM_SHA384, TLS_DHE_RSA_WITH_AES_128_CBC_SHA, TLS_DHE_RSA_WITH_AES_256_CBC_SHA, TLS_DHE_RSA_WITH_AES_128_CBC_SHA256, TLS_DHE_RSA_WITH_AES_256_CBC_SHA256
         enabled-protocols: TLSv1.2
 ```
        
### 


## Testing

### Test du Backend

Nous avons plusieurs types de tests dans l'application :
Des tests Junit 5
Des tests d'intégrations utilisant Spring Test Context

Les fichiers de tests se trouvent dans le repertoire [src/test/java](src/test/java)

Pour lancer les tests dans l'application,lancer la commande :

    ./mvnw verify

ou avec la commande qui supprime le contenu de la base de données

    ./mvnw clean verify



### Test de l'application Client

Les tests unitaires sont lancer par [Jest] (https://jestjs.io/) et écrits avec yearn [Jasmine](https://jasmine.github.io/). 
Les fichiers de test se trouvent dans le répertoire  [src/test/javascript/](src/test/javascript/) et peuvent être lancés par :

    npm test


Lancer les tests d'intégration avec Protactor ( Chome version 81 minimum) , les fichiers de tests se trouvent dans le repertoire :
 [src/test/javascript/e2e](src/test/javascript/e2e)

    yarn run e2e


### Code quality

Sonar est utilisé pour la qualité du code , vous pouvez acceder au seveur local de sonar via cette url :  http://localhost:9001) 
en lancant la commande suivante pour démmarer le serveur sonnar :

```
docker-compose -f src/main/docker/sonar.yml up -d
```


Puis en utilisant le plugin maven de Sonar : 

```
./mvnw -Pprod clean verify sonar:sonar
```


Si vous avez besoin de relancer la phase sonar , n'oubliez pas de spécifier  `initialize`, la configuration utilisée étant chargée à partir du fichier sonar-project.properties.

```
./mvnw initialize sonar:sonar
```


## Utilisation de MAILDEV 

Lors du developpement sur votre poste de travail, vous avez besoin de tester et controler l'envoie des emails.
Vous pouvez utiliser l'outil [MAILDEV](https://github.com/maildev/maildev)


Pour lancer MAILDEV 

    yarn maildev:start


Pour stopper MAILDEV 

    yarn maildev:stop


## Utilisation de ACTIVEMQ 

Lors du developpement sur votre poste de travail, vous avez besoin de tester et controler l'envoie des emails.
Vous pouvez utiliser l'outil [MAILDEV](https://github.com/maildev/maildev)


Pour lancer ActiveMQ 

    yarn activemq:start


Pour stopper ActiveMQ 

    yarn activemq:stop

Tous les emails qui sont envoyez par l'application seront interceptées et visible dans MailDev en local : [http://localhost:1080/#/](http://localhost:1080/#/)


## Utilisation de Docker 

Vous pouvez utiliser Docker lors du developpement de l'application.
Vous trouverez les fichiers de configuration de Docker de l'application dans le repertoire :  [src/main/docker](src/main/docker) .
Vous pouvez ainsi lancer les services que vous souhaitez 

Par exemple , pour démarrer mysql dans un container Docker: 

    docker-compose -f src/main/docker/mysql.yml up -d

Pour arreter le container Mysql :

    docker-compose -f src/main/docker/mysql.yml down

Une autre facon de le faire est d'utiliser yarn 

Pour lancer MYSQL 

    yarn mysql:start


Pour stopper MYSQL 

    yarn mysql:stop


Vous pouvez aussi dockerizer toute l'application et les services dépendants.

Il faut d'abord construire l'image Docker de votre application 

    ./mvnw -Pprod verify jib:dockerBuild

Vous pouvez démarrer ensuite le container avec toutes les dépendances : 

    docker-compose -f src/main/docker/app.yml up -d


Vous pouvez aussi utiliser la commande yar pour lancer l'application 

    yarn exchange:start

Pour stopper MYSQL 

    yarn exchange:stop


### Quelques liens utiles 

- [node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.org/)
- [webpack](https://webpack.github.io/)
- [browsersync](https://www.browsersync.io/)
- [jest](https://facebook.github.io/jest/)
- [jasmine](https://jasmine.github.io/2.0/introduction.html)
- [protractor](https://angular.github.io/protractor/)
- [leaflet](https://leafletjs.com/)
- [definitelytyped](https://definitelytyped.org/) 

