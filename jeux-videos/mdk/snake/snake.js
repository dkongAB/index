
                        var boutonOk=document.getElementById("boutonOk");
                        var ok=function(){
                            document.getElementById("corps").innerHTML='<h2>Choisissez la taille :</h2><br/><input type="button" value="300x600" class="surligner-bleu" onclick="p300600()"/><input type="button" value="450x900" class="surligner-bleu" onclick="p450900()"/><input type="button" value="600x1200" class="surligner-bleu" onclick="p6001200()"/>';
}
var p300600=function(){
    var corps=document.getElementById("corps");
    corps.innerHTML='<p>Snake by Nick Morgan</p><canvas id="canvas" width="600" height="300"></canvas>';
    // Mettre en place du canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Récupérer la largeur et la hauteur de l'élément canvas
    var largeur = canvas.width;
    var hauteur = canvas.height;

    // Calculer la largeur et la hauteur en blocs
    var tailleBloc = 10;
    var largeurEnBlocs = largeur / tailleBloc;
    var hauteurEnBlocs = hauteur / tailleBloc;

    // Initialiser le score à 0
    var score = 0;

    // Dessiner les murs du plateau de jeu
    var dessinerMurs = function () {
        ctx.fillStyle = "Gray";
        ctx.fillRect(0, 0, largeur, tailleBloc);
        ctx.fillRect(0, hauteur - tailleBloc, largeur, tailleBloc);
        ctx.fillRect(0, 0, tailleBloc, hauteur);
        ctx.fillRect(largeur - tailleBloc, 0, tailleBloc, hauteur)
    };

    // Afficher le score dans le coin haut-gauche
    var afficherScore = function () {
        ctx.font = "20px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score : " + score, tailleBloc, tailleBloc);
    };

    // Annuler l'animation et afficher le message Game Over
    var gameOver = function () {
        clearInterval(idIntervalle);
        ctx.font = "60px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", largeur / 2, hauteur / 2);
    };

    // Dessiner un cercle (avec la fonction du chapitre 14)
    var cercle = function (x, y, rayon, cerclePlein) {
        ctx.beginPath();
        ctx.arc(x, y, rayon, 0, Math.PI * 2, false);
        if (cerclePlein) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    };

    // Le constructeur de Bloc
    var Bloc = function (colonne, ligne) {
        this.colonne = colonne;
        this.ligne = ligne;
    };

    // Dessiner un carré à la position du bloc
    Bloc.prototype.dessinerCarre = function (couleur) {
        var x = this.colonne * tailleBloc;
        var y = this.ligne * tailleBloc;
        ctx.fillStyle = couleur;
        ctx.fillRect(x, y, tailleBloc, tailleBloc);
    };

    // Dessiner un cercle à la position du bloc
    Bloc.prototype.dessinerCercle = function (couleur) {
        var centreX = this.colonne * tailleBloc + tailleBloc / 2;
        var centreY = this.ligne * tailleBloc + tailleBloc / 2;
        ctx.fillStyle = couleur;
        cercle(centreX, centreY, tailleBloc / 2, true);
    };

    // Vérifier si deux blocs se trouvent à la même position
    Bloc.prototype.egal = function (autreBloc) {
        return this.colonne === autreBloc.colonne && this.ligne === autreBloc.ligne;
    };

    // Le constructeur de Serpent
    var Serpent = function () {
        this.segments = [
            new Bloc(7, 5),
            new Bloc(6, 5),
            new Bloc(5, 5)
        ];

        this.direction = "droite";
        this.directionSuivante = "droite";
    };

    // Dessiner un carré pour chaque segment du corps du serpent
    Serpent.prototype.dessiner = function () {
        for (var i = 0; i < this.segments.length; i++) {
            this.segments[i].dessinerCarre("Blue");
        }
    };

    // Créer une nouvelle tête et l'ajouter au début du serpent
    // afin de faire avancer le serpent dans le sens de sa direction
    Serpent.prototype.deplacer = function () {
        var tete = this.segments[0];
        var nouvelleTete;

        this.direction = this.directionSuivante;

        if (this.direction === "droite") {
            nouvelleTete = new Bloc(tete.colonne + 1, tete.ligne);
        } else if (this.direction === "bas") {
            nouvelleTete = new Bloc(tete.colonne, tete.ligne + 1);
        } else if (this.direction === "gauche") {
            nouvelleTete = new Bloc(tete.colonne - 1, tete.ligne);
        } else if (this.direction === "haut") {
            nouvelleTete = new Bloc(tete.colonne, tete.ligne - 1);
        }

        if (this.verifierCollision(nouvelleTete)) {
            gameOver();
            return;
        }

        this.segments.unshift(nouvelleTete);

        if (nouvelleTete.egal(pomme.position)) {
            score++;
            pomme.deplacer();
        } else {
            this.segments.pop();
        }
    };

    // Vérifier si la nouvelle tête du serpent est entrée
    // en collision avec le mur ou avec son propre corps
    Serpent.prototype.verifierCollision = function (tete) {
        var collisionGauche = (tete.colonne === 0);
        var collisionHaut = (tete.ligne === 0);
        var collisionDroite = (tete.colonne === largeurEnBlocs - 1);
        var collisionBas = (tete.ligne === hauteurEnBlocs - 1);

        var collisionMur = collisionGauche || collisionHaut || collisionDroite || collisionBas;

        var collisionCorps = false;

        for (var i = 0; i < this.segments.length; i++) {
            if (tete.egal(this.segments[i])) {
                collisionCorps = true;
            }
        }

        return collisionMur || collisionCorps;
    };

    // Définir la nouvelle direction du serpent avec le clavier
    Serpent.prototype.definirDirection = function (nouvelleDirection) {
        if (this.direction === "haut" && nouvelleDirection === "bas") {
            return;
        } else if (this.direction === "droite" && nouvelleDirection === "gauche") {
            return;
        } else if (this.direction === "bas" && nouvelleDirection === "haut") {
            return;
        } else if (this.direction === "gauche" && nouvelleDirection === "droite") {
            return;
        }

        this.directionSuivante = nouvelleDirection;
    };

    // Le constructeur de Pomme
    var Pomme = function () {
        this.position = new Bloc(10, 10);
    };

    // Dessiner un cercle à la position de la pomme
    Pomme.prototype.dessiner = function () {
        this.position.dessinerCercle("LimeGreen");
    };

    // Déplacer la pomme vers une nouvelle position aléatoire
    Pomme.prototype.deplacer = function () {
        var colonneAleatoire = Math.floor(Math.random() * (largeurEnBlocs - 2)) + 1;
        var ligneAleatoire = Math.floor(Math.random() * (hauteurEnBlocs - 2)) + 1;
        this.position = new Bloc(colonneAleatoire, ligneAleatoire);
    };

    // Créer les objets serpent et pomme
    var serpent = new Serpent();
    var pomme = new Pomme();

    // Passer une fonction d'animation à setInterval
    var idIntervalle = setInterval(function () {
        ctx.clearRect(0, 0, largeur, hauteur);
        afficherScore();
        serpent.deplacer();
        serpent.dessiner();
        pomme.dessiner();
        dessinerMurs();
    }, 100);

    // Convertir les codes des touches des flèches en directions
    var directions = {
        37: "gauche",
        38: "haut",
        39: "droite",
        40: "bas"
    };

    // Le gestionnaire d'événements keydown qui gère les touches de direction
    $("body").keydown(function (evenement) {
        var nouvelleDirection = directions[evenement.keyCode];
        if (nouvelleDirection !== undefined) {
            serpent.definirDirection(nouvelleDirection);
        }
    });
};
var p450900=function(){
    var corps=document.getElementById("corps");
    corps.innerHTML='<p>Snake by Nick Morgan</p><canvas id="canvas" width="900" height="450"></canvas>';
    // Mettre en place du canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Récupérer la largeur et la hauteur de l'élément canvas
    var largeur = canvas.width;
    var hauteur = canvas.height;

    // Calculer la largeur et la hauteur en blocs
    var tailleBloc = 10;
    var largeurEnBlocs = largeur / tailleBloc;
    var hauteurEnBlocs = hauteur / tailleBloc;

    // Initialiser le score à 0
    var score = 0;

    // Dessiner les murs du plateau de jeu
    var dessinerMurs = function () {
        ctx.fillStyle = "Gray";
        ctx.fillRect(0, 0, largeur, tailleBloc);
        ctx.fillRect(0, hauteur - tailleBloc, largeur, tailleBloc);
        ctx.fillRect(0, 0, tailleBloc, hauteur);
        ctx.fillRect(largeur - tailleBloc, 0, tailleBloc, hauteur)
    };

    // Afficher le score dans le coin haut-gauche
    var afficherScore = function () {
        ctx.font = "20px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score : " + score, tailleBloc, tailleBloc);
    };

    // Annuler l'animation et afficher le message Game Over
    var gameOver = function () {
        clearInterval(idIntervalle);
        ctx.font = "60px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", largeur / 2, hauteur / 2);
    };

    // Dessiner un cercle (avec la fonction du chapitre 14)
    var cercle = function (x, y, rayon, cerclePlein) {
        ctx.beginPath();
        ctx.arc(x, y, rayon, 0, Math.PI * 2, false);
        if (cerclePlein) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    };

    // Le constructeur de Bloc
    var Bloc = function (colonne, ligne) {
        this.colonne = colonne;
        this.ligne = ligne;
    };

    // Dessiner un carré à la position du bloc
    Bloc.prototype.dessinerCarre = function (couleur) {
        var x = this.colonne * tailleBloc;
        var y = this.ligne * tailleBloc;
        ctx.fillStyle = couleur;
        ctx.fillRect(x, y, tailleBloc, tailleBloc);
    };

    // Dessiner un cercle à la position du bloc
    Bloc.prototype.dessinerCercle = function (couleur) {
        var centreX = this.colonne * tailleBloc + tailleBloc / 2;
        var centreY = this.ligne * tailleBloc + tailleBloc / 2;
        ctx.fillStyle = couleur;
        cercle(centreX, centreY, tailleBloc / 2, true);
    };

    // Vérifier si deux blocs se trouvent à la même position
    Bloc.prototype.egal = function (autreBloc) {
        return this.colonne === autreBloc.colonne && this.ligne === autreBloc.ligne;
    };

    // Le constructeur de Serpent
    var Serpent = function () {
        this.segments = [
            new Bloc(7, 5),
            new Bloc(6, 5),
            new Bloc(5, 5)
        ];

        this.direction = "droite";
        this.directionSuivante = "droite";
    };

    // Dessiner un carré pour chaque segment du corps du serpent
    Serpent.prototype.dessiner = function () {
        for (var i = 0; i < this.segments.length; i++) {
            this.segments[i].dessinerCarre("Blue");
        }
    };

    // Créer une nouvelle tête et l'ajouter au début du serpent
    // afin de faire avancer le serpent dans le sens de sa direction
    Serpent.prototype.deplacer = function () {
        var tete = this.segments[0];
        var nouvelleTete;

        this.direction = this.directionSuivante;

        if (this.direction === "droite") {
            nouvelleTete = new Bloc(tete.colonne + 1, tete.ligne);
        } else if (this.direction === "bas") {
            nouvelleTete = new Bloc(tete.colonne, tete.ligne + 1);
        } else if (this.direction === "gauche") {
            nouvelleTete = new Bloc(tete.colonne - 1, tete.ligne);
        } else if (this.direction === "haut") {
            nouvelleTete = new Bloc(tete.colonne, tete.ligne - 1);
        }

        if (this.verifierCollision(nouvelleTete)) {
            gameOver();
            return;
        }

        this.segments.unshift(nouvelleTete);

        if (nouvelleTete.egal(pomme.position)) {
            score++;
            pomme.deplacer();
        } else {
            this.segments.pop();
        }
    };

    // Vérifier si la nouvelle tête du serpent est entrée
    // en collision avec le mur ou avec son propre corps
    Serpent.prototype.verifierCollision = function (tete) {
        var collisionGauche = (tete.colonne === 0);
        var collisionHaut = (tete.ligne === 0);
        var collisionDroite = (tete.colonne === largeurEnBlocs - 1);
        var collisionBas = (tete.ligne === hauteurEnBlocs - 1);

        var collisionMur = collisionGauche || collisionHaut || collisionDroite || collisionBas;

        var collisionCorps = false;

        for (var i = 0; i < this.segments.length; i++) {
            if (tete.egal(this.segments[i])) {
                collisionCorps = true;
            }
        }

        return collisionMur || collisionCorps;
    };

    // Définir la nouvelle direction du serpent avec le clavier
    Serpent.prototype.definirDirection = function (nouvelleDirection) {
        if (this.direction === "haut" && nouvelleDirection === "bas") {
            return;
        } else if (this.direction === "droite" && nouvelleDirection === "gauche") {
            return;
        } else if (this.direction === "bas" && nouvelleDirection === "haut") {
            return;
        } else if (this.direction === "gauche" && nouvelleDirection === "droite") {
            return;
        }

        this.directionSuivante = nouvelleDirection;
    };

    // Le constructeur de Pomme
    var Pomme = function () {
        this.position = new Bloc(10, 10);
    };

    // Dessiner un cercle à la position de la pomme
    Pomme.prototype.dessiner = function () {
        this.position.dessinerCercle("LimeGreen");
    };

    // Déplacer la pomme vers une nouvelle position aléatoire
    Pomme.prototype.deplacer = function () {
        var colonneAleatoire = Math.floor(Math.random() * (largeurEnBlocs - 2)) + 1;
        var ligneAleatoire = Math.floor(Math.random() * (hauteurEnBlocs - 2)) + 1;
        this.position = new Bloc(colonneAleatoire, ligneAleatoire);
    };

    // Créer les objets serpent et pomme
    var serpent = new Serpent();
    var pomme = new Pomme();

    // Passer une fonction d'animation à setInterval
    var idIntervalle = setInterval(function () {
        ctx.clearRect(0, 0, largeur, hauteur);
        afficherScore();
        serpent.deplacer();
        serpent.dessiner();
        pomme.dessiner();
        dessinerMurs();
    }, 100);

    // Convertir les codes des touches des flèches en directions
    var directions = {
        37: "gauche",
        38: "haut",
        39: "droite",
        40: "bas"
    };

    // Le gestionnaire d'événements keydown qui gère les touches de direction
    $("body").keydown(function (evenement) {
        var nouvelleDirection = directions[evenement.keyCode];
        if (nouvelleDirection !== undefined) {
            serpent.definirDirection(nouvelleDirection);
        }
    });
};
var p6001200=function(){
    var corps=document.getElementById("corps");
    corps.innerHTML='<p>Snake by Nick Morgan</p><canvas id="canvas" width="1200" height="600"></canvas>';
    // Mettre en place du canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Récupérer la largeur et la hauteur de l'élément canvas
    var largeur = canvas.width;
    var hauteur = canvas.height;

    // Calculer la largeur et la hauteur en blocs
    var tailleBloc = 10;
    var largeurEnBlocs = largeur / tailleBloc;
    var hauteurEnBlocs = hauteur / tailleBloc;

    // Initialiser le score à 0
    var score = 0;

    // Dessiner les murs du plateau de jeu
    var dessinerMurs = function () {
        ctx.fillStyle = "Gray";
        ctx.fillRect(0, 0, largeur, tailleBloc);
        ctx.fillRect(0, hauteur - tailleBloc, largeur, tailleBloc);
        ctx.fillRect(0, 0, tailleBloc, hauteur);
        ctx.fillRect(largeur - tailleBloc, 0, tailleBloc, hauteur)
    };

    // Afficher le score dans le coin haut-gauche
    var afficherScore = function () {
        ctx.font = "20px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Score : " + score, tailleBloc, tailleBloc);
    };

    // Annuler l'animation et afficher le message Game Over
    var gameOver = function () {
        clearInterval(idIntervalle);
        ctx.font = "60px Courier";
        ctx.fillStyle = "Black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over", largeur / 2, hauteur / 2);
    };

    // Dessiner un cercle (avec la fonction du chapitre 14)
    var cercle = function (x, y, rayon, cerclePlein) {
        ctx.beginPath();
        ctx.arc(x, y, rayon, 0, Math.PI * 2, false);
        if (cerclePlein) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    };

    // Le constructeur de Bloc
    var Bloc = function (colonne, ligne) {
        this.colonne = colonne;
        this.ligne = ligne;
    };

    // Dessiner un carré à la position du bloc
    Bloc.prototype.dessinerCarre = function (couleur) {
        var x = this.colonne * tailleBloc;
        var y = this.ligne * tailleBloc;
        ctx.fillStyle = couleur;
        ctx.fillRect(x, y, tailleBloc, tailleBloc);
    };

    // Dessiner un cercle à la position du bloc
    Bloc.prototype.dessinerCercle = function (couleur) {
        var centreX = this.colonne * tailleBloc + tailleBloc / 2;
        var centreY = this.ligne * tailleBloc + tailleBloc / 2;
        ctx.fillStyle = couleur;
        cercle(centreX, centreY, tailleBloc / 2, true);
    };

    // Vérifier si deux blocs se trouvent à la même position
    Bloc.prototype.egal = function (autreBloc) {
        return this.colonne === autreBloc.colonne && this.ligne === autreBloc.ligne;
    };

    // Le constructeur de Serpent
    var Serpent = function () {
        this.segments = [
            new Bloc(7, 5),
            new Bloc(6, 5),
            new Bloc(5, 5)
        ];

        this.direction = "droite";
        this.directionSuivante = "droite";
    };

    // Dessiner un carré pour chaque segment du corps du serpent
    Serpent.prototype.dessiner = function () {
        for (var i = 0; i < this.segments.length; i++) {
            this.segments[i].dessinerCarre("Blue");
        }
    };

    // Créer une nouvelle tête et l'ajouter au début du serpent
    // afin de faire avancer le serpent dans le sens de sa direction
    Serpent.prototype.deplacer = function () {
        var tete = this.segments[0];
        var nouvelleTete;

        this.direction = this.directionSuivante;

        if (this.direction === "droite") {
            nouvelleTete = new Bloc(tete.colonne + 1, tete.ligne);
        } else if (this.direction === "bas") {
            nouvelleTete = new Bloc(tete.colonne, tete.ligne + 1);
        } else if (this.direction === "gauche") {
            nouvelleTete = new Bloc(tete.colonne - 1, tete.ligne);
        } else if (this.direction === "haut") {
            nouvelleTete = new Bloc(tete.colonne, tete.ligne - 1);
        }

        if (this.verifierCollision(nouvelleTete)) {
            gameOver();
            return;
        }

        this.segments.unshift(nouvelleTete);

        if (nouvelleTete.egal(pomme.position)) {
            score++;
            pomme.deplacer();
        } else {
            this.segments.pop();
        }
    };

    // Vérifier si la nouvelle tête du serpent est entrée
    // en collision avec le mur ou avec son propre corps
    Serpent.prototype.verifierCollision = function (tete) {
        var collisionGauche = (tete.colonne === 0);
        var collisionHaut = (tete.ligne === 0);
        var collisionDroite = (tete.colonne === largeurEnBlocs - 1);
        var collisionBas = (tete.ligne === hauteurEnBlocs - 1);

        var collisionMur = collisionGauche || collisionHaut || collisionDroite || collisionBas;

        var collisionCorps = false;

        for (var i = 0; i < this.segments.length; i++) {
            if (tete.egal(this.segments[i])) {
                collisionCorps = true;
            }
        }

        return collisionMur || collisionCorps;
    };

    // Définir la nouvelle direction du serpent avec le clavier
    Serpent.prototype.definirDirection = function (nouvelleDirection) {
        if (this.direction === "haut" && nouvelleDirection === "bas") {
            return;
        } else if (this.direction === "droite" && nouvelleDirection === "gauche") {
            return;
        } else if (this.direction === "bas" && nouvelleDirection === "haut") {
            return;
        } else if (this.direction === "gauche" && nouvelleDirection === "droite") {
            return;
        }

        this.directionSuivante = nouvelleDirection;
    };

    // Le constructeur de Pomme
    var Pomme = function () {
        this.position = new Bloc(10, 10);
    };

    // Dessiner un cercle à la position de la pomme
    Pomme.prototype.dessiner = function () {
        this.position.dessinerCercle("LimeGreen");
    };

    // Déplacer la pomme vers une nouvelle position aléatoire
    Pomme.prototype.deplacer = function () {
        var colonneAleatoire = Math.floor(Math.random() * (largeurEnBlocs - 2)) + 1;
        var ligneAleatoire = Math.floor(Math.random() * (hauteurEnBlocs - 2)) + 1;
        this.position = new Bloc(colonneAleatoire, ligneAleatoire);
    };

    // Créer les objets serpent et pomme
    var serpent = new Serpent();
    var pomme = new Pomme();

    // Passer une fonction d'animation à setInterval
    var idIntervalle = setInterval(function () {
        ctx.clearRect(0, 0, largeur, hauteur);
        afficherScore();
        serpent.deplacer();
        serpent.dessiner();
        pomme.dessiner();
        dessinerMurs();
    }, 100);

    // Convertir les codes des touches des flèches en directions
    var directions = {
        37: "gauche",
        38: "haut",
        39: "droite",
        40: "bas"
    };

    // Le gestionnaire d'événements keydown qui gère les touches de direction
    $("body").keydown(function (evenement) {
        var nouvelleDirection = directions[evenement.keyCode];
        if (nouvelleDirection !== undefined) {
            serpent.definirDirection(nouvelleDirection);
        }
    });};