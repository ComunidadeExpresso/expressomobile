EXPRESSO MOBILE - WWW
===

Este repositório é a unificação dos outros 3 repositórios seguindo o padrão do projeto Apache Cordova de forma a termos um único código para as 3 plataformas (WEB, IOS, ANDROID).

# Instalação
	
	git clone https://github.com/ComunidadeExpresso/expressomobile.git
	npm install
	bower install

	
## Tarefas do gulp
  build           Create a new build on the build folder.
  clean:build     Delete all files from build folder.

  gulp default         [help]
  gulp help            Display this help text.
  gulp install         Install all project dependencies NODE_MODULES and BOWER.
  gulp minify-css      Minifica CSS na pasta de build.
  gulp minify-scripts  Minifica JS na pasta de build.
  gulp vulcanize       Minify Polymer Elements into a index.html and index.js on the build folder.
  gulp serve           Inicia um servidor web local na pasta: /source/ 
  gulp serve-www       Inicia um servidor web local na pasta: /www/  
  

## Compilar para o Android
	gulp clean:build
	gulp build
	cordova run android


# Projeto desenvolvido por:
    CELEPAR - Companhia de Tecnologia da Informação e Comunicação do Estado do Paraná

# Desenvolvedores dos Aplicativos

	- Alexandre Rocha Wendling
	- Jair Gonçalves Pereira Jr
	- Rafael Katayama Gobara


# Desenvolvedores da API
	
	- Alexandre Luiz Correia
	- Alexandre Rocha Wendling
	- Anderson Tadayuki Saikawa
	- Jair Gonçalves Pereira Jr
	- Nilton Emilio Buhrer Neto
	- Rafael Katayama Gobara


# Biliotecas utilizadas

	- Cordova	
	- Bacbkone
	- RequireJS
	- Underscore
	- Polymer
	- Webcomponents
	- jQuery
	- Moment.js
	- jQuery XMPP

