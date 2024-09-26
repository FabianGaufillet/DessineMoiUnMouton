# DessineMoiUnMouton

## Cahier des charges
### Présentation
Cet atelier consiste à réaliser un **jeu multijoueur en temps réel.**

### Description
#### Principe
Le jeu est réalisé en JavaScript. Il est multijoueur, i.e. qu'il est possible à au moins deux joueurs de s'affronter dans la **même partie en même temps**. Certaines données, comme le score global des joueurs, sont conservées en base de données.

#### Thématique du jeu
J'ai choisi de réaliser une version très simplifiée du jeu _Pictionary_. Les joueurs s'inscrivent pour la prochaine session et l'un d'entre eux se déclare en tant que dessinateur. Il doit alors renseigner le mot que les autres utilisateurs vont devoir deviner. Le premier à trouver le mot remporte le maximum de points. Le nombre de points à gagner décroit au fur-et-à-mesure que les joueurs trouvent le mot.

### Obligations techniques
Le code source est disponible sur mon Github personnel : https://github.com/FabianGaufillet/DessineMoiUnMouton.
Il est également hébergé sur le site suivant : **TODO : à faire**

### Ergonomie et graphisme
Le jeu est intégré dans le site.
Il propose aux joueurs d'**interagir avec l'affichage** du navigateur en fonction d'actions effectuées soit à l'aide du clavier _via_ des messages dans le tchat soit à l'aide de la souris _via_ la zone de dessin.
Chaque joueur est représenté par ses nom et prénom qu'il a renseignés lors de son inscription sur le site.
Avant de pouvoir commencer une partie, un joueur doit au préalable s'authentifier en saisissant son adresse e-mail ainsi que son mot de passe.

Une partie de jeu se déroule sans qu'**aucun rechargement de page** n'ait lieu. Les modifications de l'état du jeu liées aux actions de chaque joueur se répercutent quasi-instantanément sur les affichages de chacun des joueurs.

Le jeu contient un **mécanisme de score**. Le score de chaque joueur est enregistré en cours de partie. À n'importe quel moment le joueur peut consulter la liste des joueurs qui ont participé au jeu, leur durée de jeu et leur score.


## Réalisation
### Stack technique
Pour répondre au cahier des charges, j'ai choisi d'utiliser la stack **MEAN** (MongoDB, ExpressJS, Angular, NodeJS).

### Lancement du site en local
Pour lancer le site, se rendre dans le répertoire _server_, ajouter un fichier _.env_ en renseignant les informations suivantes :
```
URL = <url du site> (ex: http://localhost:4200)
SERVER_PORT = <port du serveur expressJS> (ex: 3000)
MONGODB_URI = <identifiant de connexion à la base de données avec nom de la base de données> (ex : mongodb://localhost:27017/dmum-db)
JWT_SECRET = <clé secrète pour les tokens>
```
Puis exécuter les commandes suivantes dans un terminal pour démarrer le serveur :
```
npm install
npm start
```
Si tout s'est déroulé correctement, les messages suivants s'affichent dans la console :
```
Server started on port <SERVER_PORT>
```
Ensuite, se rendre à la racine et exécuter la commande suivante :
```
npm install
npm start
```
**ATTENTION :** Si vous utilisez un port différent du port 3000 pour le serveur, vous devrez modifier les valeurs contenues dans le répertoire _/src/environments/environment.ts_. 
Si tout se passe correctement, le site devrait s'afficher en se rendant à l'adresse : http://localhost:4200/.

### Utilisation du site
Une fois sur le site, naviguez sur l'onglet _Inscription_ et renseignez le formulaire. Après validation, vous serez automatiquement redirigé vers la zone de jeu où vous pourrez discuter avec les autres joueurs, rejoindre une partie ou en lancer une.
