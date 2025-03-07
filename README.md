# Projet Eco Bliss Bath
Site de vente de produits de beauté écoresponsable.

# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. Ouvrez le site depuis la page http://localhost:8080 

Nb : à l'étape 2, ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateur.

# Ouverture de cypress
1. Ouvrir le terminal
2. Lancer la commande : `npx cypress open`
3. Choisir `E2E Testing`
4. Cliquer sur le navigateur `Chrome`
5. Lancer le fichier de test voulu