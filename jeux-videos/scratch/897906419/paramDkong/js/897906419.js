function(rf){
delay(500)
alert("Ce jeu-vidéo nécessite un clavier.")
redirect=confirm("Ce jeu-vidéo peut ne pas s'afficher correctement./nAller sur la page Scratch ?")
if(redirect){
	document.getElementById("rdrct").innerHTML='<meta http-equiv="refresh";URL="https://scratch.mit.edu/projects/897906419/fullscreen">'
}}