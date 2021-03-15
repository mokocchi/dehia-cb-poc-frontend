/* eslint-disable camelcase */
import FontAwesome_ttf from 'react-web-vector-icons/fonts/FontAwesome.ttf';
import Entypo_ttf from 'react-web-vector-icons/fonts/Entypo.ttf';
import Ionicons_ttf from 'react-web-vector-icons/fonts/Ionicons.ttf';
import MaterialIcons_ttf from 'react-web-vector-icons/fonts/MaterialIcons.ttf';
import MaterialCommunityIcons_ttf from 'react-web-vector-icons/fonts/MaterialCommunityIcons.ttf';

const IconsCSS = `
@font-face {
  src: url(${FontAwesome_ttf});
  font-family: FontAwesome;
}
@font-face {
  src: url(${Entypo_ttf});
  font-family: Entypo;
}
@font-face {
    src: url(${Ionicons_ttf});
    font-family: Ionicons;
}
@font-face {
    src: url(${MaterialIcons_ttf});
    font-family: MaterialIcons;
}
@font-face {
  src: url(${MaterialCommunityIcons_ttf});
  font-family: MaterialCommunityIcons;
}
`;

const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) style.styleSheet.cssText = IconsCSS;
else style.appendChild(document.createTextNode(IconsCSS));

document.head.appendChild(style);