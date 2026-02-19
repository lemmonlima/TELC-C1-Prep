/* Modellprüfung 2 — Exam data (answers, themes, quotes) */
'use strict';

const EXAM_DATA = {
  title: 'Modellprüfung 2',

  correct: {
    lv1: { 1:'e', 2:'f', 3:'a', 4:'d', 5:'b', 6:'c' },
    lv2: { 7:'a', 8:'b', 9:'c', 10:'d', 11:'e', 12:'a' },
    lv3: { 13:'+', 14:'−', 15:'+', 16:'−', 17:'+', 18:'−', 19:'+', 20:'−', 21:'×', 22:'+', 23:'+', 24:'b' },
    sb:  { 25:'a',26:'c',27:'b',28:'b',29:'d',30:'a',31:'d',32:'b',33:'c',34:'a',35:'a',36:'d',37:'d',38:'c',39:'a',40:'d',41:'a',42:'b',43:'c',44:'b',45:'c',46:'b',47:'a' },
    hv1: { 47:'b',48:'e',49:'d',50:'h',51:'a',52:'f',53:'c',54:'j' },
    hv2: { 55:'b',56:'b',57:'b',58:'a',59:'b',60:'a',61:'b',62:'b',63:'b',64:'c' },
    hv3: {
      65:['stau','staus','verkehrsstau','überlastung','überlastet','zu viele autos'],
      66:['ein fünftel','20 prozent','zwanzig prozent','20%','fünftel'],
      '67a':['zu fuß','fußweg','gehen','fußgänger'],
      '67b':['fahrrad','rad','radfahren','mit dem rad'],
      '68a':['mehr radfahrer','radverkehr gestiegen','62 prozent','radanteil'],
      '68b':['weniger autos','autoverkehr gesunken','co2 reduziert','emissionen'],
      69:['takterhöhung','häufigere verbindungen','dichterer takt','besserer takt','takt'],
      '70a':['ländliche gebiete','auf dem land','schlechte anbindung','land','randgebiete'],
      '70b':['on-demand','rufbus','bedarfsverkehr','flexible angebote','shuttles'],
      '71a':['elf prozent','11 prozent','11%','elf'],
      '71b':['25 prozent','verdoppeln','fünfundzwanzig','25%','verdoppelung'],
      72:['sichere radwege','geschützte radwege','radinfrastruktur','radwege'],
      73:['politischen willen','mut','politische entscheidungen','mut und geld','investitionen'],
      74:['nicht für autos','für menschen','lebenswert','autoarm','autofrei']
    }
  },

  themaTexte: {
    a1: 'Welche Rolle spielen Medien in einer Demokratie? Diskutieren Sie sowohl Chancen als auch Risiken. Begründen Sie Ihre Meinung mit Beispielen.',
    a2: 'Welche Vor- und Nachteile hat das Arbeiten im Homeoffice? Vergleichen Sie mit der Arbeit im Büro und nehmen Sie Stellung.',
    b1: 'Welche Bedeutung hat regelmäßige Bewegung für die körperliche und geistige Gesundheit? Begründen Sie Ihre Meinung.',
    b2: 'Sollte ein Auslandssemester für alle Studierenden Pflicht sein? Diskutieren Sie Pro- und Contra-Argumente.',
    c1: 'Wie beeinflussen soziale Medien das Zusammenleben in der Gesellschaft? Diskutieren Sie positive und negative Aspekte.',
    c2: 'Welche Rolle spielt Kunst in der modernen Gesellschaft? Ist sie ein Luxus oder eine Notwendigkeit? Begründen Sie Ihre Meinung.'
  },

  saThemen: {
    digitalisierung: {
      title: 'Thema 1: Digitalisierung der Bildung',
      zitate: [
        'Der Computer wird den Lehrer niemals ersetzen können — aber ein Lehrer, der den Computer nicht nutzt, wird ersetzt werden.',
        'Bildschirme in Kinderhänden sind das Ende des eigenständigen Denkens.'
      ]
    },
    ehrenamt: {
      title: 'Thema 2: Ehrenamtliches Engagement',
      zitate: [
        'Wer sich ehrenamtlich engagiert, hält die Gesellschaft zusammen.',
        'Ehrenamt darf nicht dazu dienen, staatliche Versäumnisse zu kaschieren.'
      ]
    }
  },

  hvTranskript: '/* TODO: Hörverstehen-Transkript hier einfügen */',

  diskussionZitate: {
    1: { text:'Bildung ist nicht das Befüllen von Fässern, sondern das Entzünden von Flammen.', autor:'Heraklit',
         aspekte:['Was versteht Heraklit unter „Flammen entzünden"?','Wie sieht guter Unterricht aus?','Welche Rolle spielen die Lernenden selbst?','Ist reines Faktenwissen noch zeitgemäß?'] },
    2: { text:'Wer fremde Sprachen nicht kennt, weiß nichts von seiner eigenen.', autor:'Goethe',
         aspekte:['Was meint Goethe damit genau?','Wie verändert Fremdsprachenlernen die Sicht auf die Muttersprache?','Ist Mehrsprachigkeit notwendig?','Welche Erfahrungen haben Sie?'] },
    3: { text:'Es ist nicht wenig Zeit, die wir haben, sondern es ist viel Zeit, die wir nicht nutzen.', autor:'Seneca',
         aspekte:['Was meint Seneca mit „nicht nutzen"?','Wie geht man mit Zeitdruck um?','Welche Rolle spielt Zeitmanagement?','Produktivität vs. erfülltes Leben?'] },
    4: { text:'Die Wissenschaft fängt eigentlich erst da an, interessant zu werden, wo sie aufhört.', autor:'Liebig',
         aspekte:['Was meint Liebig?','Grenzen wissenschaftlicher Erkenntnis?','Umgang mit ungeklärten Fragen?','Rolle von Philosophie und Glaube?'] }
  }
};
