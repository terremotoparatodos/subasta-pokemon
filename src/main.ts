import { ROSTER, portraitUrl } from './content/roster';
import { newGame } from './game/auction';
import { loadGame } from './game/storage';
import { mountView } from './ui/view';

// Precarga los retratos para que el sorteo no parpadee.
for (const mon of ROSTER) new Image().src = portraitUrl(mon.dex);

mountView(document.getElementById('app')!, loadGame() ?? newGame());
