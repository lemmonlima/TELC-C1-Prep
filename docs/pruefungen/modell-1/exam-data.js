/* Modellprüfung 1 — Exam data (answers, themes, quotes) */
'use strict';

const EXAM_DATA = {
  title: 'Modellprüfung 1',

  correct: {
    lv1: { 1:'g', 2:'e', 3:'a', 4:'b', 5:'h', 6:'d' },
    lv2: { 7:'a', 8:'d', 9:'c', 10:'a', 11:'d', 12:'e' },
    lv3: { 13:'−', 14:'×', 15:'+', 16:'×', 17:'−', 18:'×', 19:'−', 20:'+', 21:'−', 22:'×', 23:'−', 24:'b' },
    sb:  { 25:'a',26:'d',27:'a',28:'b',29:'d',30:'d',31:'a',32:'b',33:'a',34:'a',35:'c',36:'c',37:'b',38:'c',39:'d',40:'c',41:'c',42:'c',43:'d',44:'d',45:'a',46:'c',47:'a' },
    hv1: { 47:'g',48:'f',49:'c',50:'i',51:'b',52:'d',53:'h',54:'j' },
    hv2: { 55:'a',56:'a',57:'a',58:'c',59:'b',60:'a',61:'a',62:'a',63:'b',64:'c' },
    hv3: {
      65:['jeder vierte','4.','vierte','keine bücher','liest keine','liest nicht'],
      66:['bücher werden','weiter','weiterhin','noch','immer noch','gelesen'],
      '67a':['verfassen','schreiben','eigener','texte'],
      '67b':['kreative verarbeitung','verarbeitung','kreative','methoden'],
      '68a':['lieder','songs','musik'],
      '68b':['theater','stücke','theaterstücke','interviews','hörspiele'],
      69:['alltagskommunikation','interpretation','literatur'],
      '70a':['kreatives schreiben','neue lust','lesen','nicht mehr mittelpunkt'],
      '70b':['kreatives schreiben','neue lust','lesen','mittelpunkt'],
      '71a':['liebe','erste liebe','freundschaft','familie'],
      '71b':['freundschaft','familie','liebe'],
      72:['neues ende','ende','brief','hauptfigur'],
      73:['doppelsinnig','lustig','witzig'],
      74:['autonomie','leser','selbst entscheiden']
    }
  },

  themaTexte: {
    a1: 'Welche Erfindung halten Sie für besonders wichtig? Hat diese Erfindung nur Vorteile oder auch Nachteile?',
    a2: 'Beschreiben Sie das System der universitären Ausbildung in einem Land Ihrer Wahl.',
    b1: 'Beschreiben Sie, welche Erfahrungen oder bisherigen Tätigkeiten Sie zu Ihrer Studien- oder Berufswahl bewogen haben.',
    b2: 'Welche künstlerischen Fächer sollten im Schulunterricht gelehrt werden? Begründen Sie Ihre Meinung.',
    c1: 'Wie man Fremdsprachen lernt, ist kulturell unterschiedlich. Beschreiben Sie Gemeinsamkeiten und Unterschiede.',
    c2: 'Welche Fächer sind wichtiger: Natur- oder Geisteswissenschaften? Begründen Sie Ihre Meinung.'
  },

  saThemen: {
    literatur: {
      title: 'Thema 1: Literatur',
      zitate: [
        'Literatur hat nie etwas Negatives verhindern können.',
        'Literatur bietet mehr Orientierung als alles andere.'
      ]
    },
    gruppenarbeit: {
      title: 'Thema 2: Gruppenarbeit',
      zitate: [
        'Gruppenarbeit kostet doch nur Zeit, weil man alles ausdiskutieren muss.',
        'Teamarbeit bietet dem Einzelnen viel mehr Möglichkeiten.'
      ]
    }
  },

  hvTranskript: '/* TODO: Hörverstehen-Transkript hier einfügen */',

  diskussionZitate: {
    1: { text:'Die beste Bildung findet ein kluger Mensch auf Reisen.', autor:'Goethe',
         aspekte:['Was bedeutet „Bildung durch Reisen"?','Welche Erfahrungen haben Sie?','Kann man ohne Reisen gebildet werden?','Rolle von Büchern, Internet?'] },
    2: { text:'Am Mut hängt der Erfolg.', autor:'Fontane',
         aspekte:['Ist Mut die wichtigste Voraussetzung?','Rolle anderer Faktoren?','Beispiele aus Erfahrung?','Kann zu viel Mut schaden?'] },
    3: { text:'Auf Kinder wirkt das Vorbild, nicht die Kritik.', autor:'Thiersch',
         aspekte:['Warum Vorbilder wichtiger als Worte?','Rolle konstruktiver Kritik?','Eigene Vorbilder?','Was macht ein gutes Vorbild aus?'] },
    4: { text:'Ohne Leiden bildet sich kein Charakter.', autor:'Feuchtersleben',
         aspekte:['Muss man leiden um zu wachsen?','Positive Erfahrungen?','Beispiele aus Geschichte?','Ist Leiden notwendig?'] },
  }
};
