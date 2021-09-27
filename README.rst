Il s'agit d'un programme pour navigateur web destiné à construire une séquence
pour le robot de Šikula Robotik à l'aide d'une webcam et sans contact, dans le
cadre de la fête de la Science sous contraintes sanitaires.

1) Lancer un serveur web, par exemple avec `python -m http.server 8080`.

2) Se connecter à l'interface http://localhost:8080/

3) Accepter l'utilisation de la webcam en sélectionnant laquelle utiliser

4) Saisir l'adresse du serveur web du robot dans la zone de saisie au dessus du
bouton enregistrer

L'utilisation de l'interface peut se faire avec la souris ou avec la main se
déplaçant devant la webcam. Il est conseillé d'avoir un fond uni pour une
meilleure détection.

L'ajout d'actions se fait à l'aide des boutons de la liste d'actions
disponibles. Il est possible de déplacer ou supprimer des actions de la liste
affichée au centre. L'appui sur le bouton enregistrer envoie une requête au
robot, créant une séquence au nom fixe pouvant être utilisée dans iamultiseq.
Penser à redémarrer celui-ci pour la prise en compte du programme.
