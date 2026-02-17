/* Modellprüfung 2 — Exam data (answers, themes, quotes) */
'use strict';

const EXAM_DATA = {
  title: 'Modellprüfung 2',

  correct: {
    lv1: { 1:'c', 2:'b', 3:'d', 4:'a', 5:'e', 6:'h' },
    lv2: { 7:'a', 8:'b', 9:'c', 10:'d', 11:'e', 12:'e' },
    lv3: {
      13:'falsch', 14:'richtig', 15:'nicht', 16:'richtig', 17:'falsch', 18:'falsch',
      19:'richtig', 20:'falsch', 21:'richtig', 22:'falsch', 23:'falsch', 24:'b'
    },
    sb: {
      25:'b',26:'b',27:'a',28:'b',29:'b',30:'a',31:'a',32:'b',33:'c',34:'b',
      35:'a',36:'c',37:'a',38:'c',39:'b',40:'a',41:'a',42:'a',43:'b',44:'a',
      45:'a',46:'a',47:'b'
    },
    hv1: { 47:'d', 48:'i', 49:'c', 50:'b', 51:'h', 52:'a', 53:'g', 54:'e' },
    hv2: { 55:'b', 56:'a', 57:'b', 58:'c', 59:'b', 60:'b', 61:'b', 62:'b', 63:'b', 64:'a' },
    hv3: {
      65: ['nach 1989', '1990', 'nach der wende', 'ab 1990', 'seit 1990'],
      66: ['experimentelle', 'neue', 'diverse', 'vielfältige', 'verschiedene'],
      '67a': ['migration', 'flucht', 'einwanderung', 'zuwanderung'],
      '67b': ['identität', 'identitätssuche', 'selbstfindung'],
      '68a': ['klimawandel', 'umwelt', 'klimakrise', 'ökologie'],
      '68b': ['ungleichheit', 'soziale ungleichheit', 'gerechtigkeit', 'armut'],
      69: ['gesellschaftliche entwicklung', 'zeitgeist', 'gegenwart', 'gesellschaft', 'aktuelle entwicklung'],
      '70a': ['öffentliche', 'gesellschaftliche', 'politische'],
      '70b': ['bewusstsein', 'sensibilisierung', 'aufklärung', 'veränderung'],
      '71a': ['konzentration', 'fusionen', 'zusammenschlüsse', 'konzentrationsprozess'],
      '71b': ['selfpublishing', 'self-publishing', 'selbstverlag', 'eigenverlag'],
      72: ['rückgang', 'rückläufig', 'sinken', 'weniger', 'abnahme'],
      73: ['sinkende honorare', 'niedrige honorare', 'geringe bezahlung', 'honorare'],
      74: ['diversität', 'vielfalt', 'diverse autoren', 'verschiedene stimmen', 'mehr vielfalt']
    }
  },

  themaTexte: {
    a1: 'Beschreiben Sie, wie Künstliche Intelligenz bereits heute unser tägliches Leben beeinflusst. Gehen Sie auf verschiedene Bereiche ein (z.B. Smartphone, soziale Medien, Arbeit, Gesundheit). Welche Chancen und Risiken sehen Sie?',
    a2: '„Man lernt nie aus" – erklären Sie, warum kontinuierliche Weiterbildung in der modernen Gesellschaft wichtig ist. Welche Möglichkeiten gibt es für Erwachsene, sich weiterzubilden? Welche Herausforderungen sehen Sie?',
    b1: 'Beschreiben Sie, welche Faktoren bei der Wahl eines Studiengangs oder Berufs eine Rolle spielen sollten. Was ist wichtiger: Interesse und Leidenschaft oder finanzielle Sicherheit? Wie haben Sie selbst Ihre Entscheidung getroffen?',
    b2: 'Welche Rolle kann Nachhaltigkeit im universitären Alltag spielen? Denken Sie an Mobilität, Ernährung, Konsum und Energieverbrauch. Was können Studierende konkret tun, um umweltbewusster zu leben?',
    c1: 'Beschreiben Sie, wie soziale Medien die Art und Weise verändert haben, wie wir kommunizieren. Welche positiven und negativen Auswirkungen haben Plattformen wie Instagram, TikTok oder Twitter auf die Gesellschaft?',
    c2: 'Erklären Sie die Bedeutung wissenschaftlicher Forschung für die gesellschaftliche Entwicklung. Welche aktuellen wissenschaftlichen Themen beschäftigen die Öffentlichkeit? Wie kann man das Vertrauen in die Wissenschaft stärken?'
  },

  saThemen: {
    digitalisierung: {
      title: 'Thema 1: Digitalisierung in der Hochschulbildung',
      zitate: [
        '„Online-Vorlesungen und digitale Lernplattformen machen Bildung zugänglicher und flexibler. Studierende können in ihrem eigenen Tempo lernen und haben Zugriff auf Ressourcen aus der ganzen Welt. Die Zukunft der Hochschule ist digital."',
        '„Digitale Lehre kann den persönlichen Kontakt zwischen Lehrenden und Studierenden niemals ersetzen. Akademische Bildung lebt vom direkten Austausch, von Diskussionen und der gemeinsamen Arbeit im Seminarraum. Ohne Präsenz verliert die Universität ihre Seele."'
      ]
    },
    benotung: {
      title: 'Thema 2: Noten und Leistungsbewertung',
      zitate: [
        '„Noten sind ein notwendiges Instrument, um Leistungen objektiv zu messen und zu vergleichen. Sie motivieren Studierende, sich anzustrengen, und helfen Arbeitgebern, die Qualifikation von Bewerbern einzuschätzen. Ohne Noten gäbe es keinen fairen Wettbewerb."',
        '„Noten reduzieren komplexe Lernprozesse auf eine einzige Zahl und fördern Konkurrenzdenken statt Zusammenarbeit. Sie verursachen Stress und Prüfungsangst und messen nur einen Bruchteil dessen, was wirklich wichtig ist. Wahres Lernen braucht keine Noten."'
      ]
    }
  },

  diskussionZitate: {
    1: {
      text: '„Bildung ist die mächtigste Waffe, die du verwenden kannst, um die Welt zu verändern."',
      autor: 'Nelson Mandela (1918–2013), südafrikanischer Anti-Apartheid-Kämpfer und Politiker',
      aspekte: [
        'Inwiefern kann Bildung tatsächlich die Welt verändern?',
        'Welche Rolle spielt Bildung bei der Lösung globaler Probleme?',
        'Gibt es Grenzen dessen, was Bildung erreichen kann?',
        'Welche Art von Bildung ist gemeint: formale Bildung, Erfahrung oder beides?'
      ]
    },
    2: {
      text: '„Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt."',
      autor: 'Ludwig Wittgenstein (1889–1951), österreichisch-britischer Philosoph',
      aspekte: [
        'Wie beeinflusst Sprache unser Denken und unsere Wahrnehmung?',
        'Welche Bedeutung hat Mehrsprachigkeit für das Verständnis der Welt?',
        'Können wir Dinge denken, für die wir keine Worte haben?',
        'Welche Rolle spielt Sprache in der internationalen Verständigung?'
      ]
    },
    3: {
      text: '„Der Fortschritt lebt vom Austausch des Wissens."',
      autor: 'Albert Einstein (1879–1955), theoretischer Physiker',
      aspekte: [
        'Warum ist der Austausch von Wissen für den wissenschaftlichen Fortschritt wichtig?',
        'Welche Rolle spielen Open-Access-Publikationen und offene Daten?',
        'Gibt es Wissen, das nicht geteilt werden sollte?',
        'Wie hat das Internet den Wissensaustausch verändert?'
      ]
    },
    4: {
      text: '„Wer ein Warum zu leben hat, erträgt fast jedes Wie."',
      autor: 'Friedrich Nietzsche (1844–1900), deutscher Philosoph',
      aspekte: [
        'Was bedeutet es, einen Sinn im Leben zu finden?',
        'Welche Rolle spielt Motivation bei der Bewältigung von Schwierigkeiten?',
        'Wie finden Menschen ihren persönlichen Lebenssinn?',
        'Kann ein „Warum" auch problematisch sein (z.B. Fanatismus)?'
      ]
    }
  }
};
