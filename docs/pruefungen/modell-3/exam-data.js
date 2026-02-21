/* Modellprüfung 3 — Exam data (answers, themes, quotes) */
'use strict';

// TODO: Fill in correct answers and content for Modellprüfung 3
const EXAM_DATA = {
  title: 'Modellprüfung 3',

  correct: {
    lv1: { 1:'g', 2:'f', 3:'a', 4:'h', 5:'b', 6:'d' },
    lv2: { 7:'a', 8:'d', 9:'c', 10:'d', 11:'b', 12:'e' },
    lv3: { 13:'−', 14:'×', 15:'+', 16:'−', 17:'×', 18:'+', 19:'−', 20:'+', 21:'−', 22:'×', 23:'+', 24:'b' },
    sb:  { 25:'',26:'',27:'',28:'',29:'',30:'',31:'',32:'',33:'',34:'',35:'',36:'',37:'',38:'',39:'',40:'',41:'',42:'',43:'',44:'',45:'',46:'',47:'' },
    hv1: { 47:'j',48:'g',49:'h',50:'b',51:'d',52:'i',53:'f',54:'a' },
    hv2: { 55:'b',56:'c',57:'a',58:'b',59:'c',60:'a',61:'b',62:'a',63:'c',64:'b' },
    hv3: {
      65:['zwei drittel','2/3','zwei von drei','rund zwei drittel'],
      66:['gesellschaftliche relevanz','gesellschaftlicher nutzen','relevanz'],
      '67a':['zeitliche starrheit','starrheit','starre zeitraster'],
      '67b':['fehlende externe partner','fehlende partner','externe partner'],
      '68a':['sprachpatenschaften','sprachpatenschaft'],
      '68b':['energiesprechstunden','energiesprechstunde','energie-sprechstunden'],
      69:['reflexionskompetenz','reflexionsfähigkeit','reflexion'],
      '70a':['endprodukt','produktorientierung'],
      '70b':['lernprozess','prozessbewertung','prozessorientierung'],
      '71a':['klare rollen','rollenklärung','rollen'],
      '71b':['verlässliche betreuung','zuverlässige betreuung','betreuung'],
      72:['72 stunden','innerhalb von 72 stunden','drei tagen','3 tagen'],
      73:['dauerhafte koordination','langfristige koordination','koordination'],
      74:['zentrales transferbüro','transferbüro','transferbuero','zentrale transferstelle']
    }
  },

  themaTexte: {
    a1: '/* TODO */',
    a2: '/* TODO */',
    b1: '/* TODO */',
    b2: '/* TODO */',
    c1: '/* TODO */',
    c2: '/* TODO */'
  },

  saThemen: {
    /* TODO: thema1key */ thema1: {
      title: '/* TODO: Thema 1 title */',
      zitate: ['/* TODO */', '/* TODO */']
    },
    /* TODO: thema2key */ thema2: {
      title: '/* TODO: Thema 2 title */',
      zitate: ['/* TODO */', '/* TODO */']
    }
  },

  hvTranskript: `Hörverstehen Teil 1

Sie hören die Meinungen von acht Personen. Sie hören die Meinungen nur einmal. Entscheiden Sie beim Hören, welche Aussage A bis J zu welcher Person passt. Zwei Aussagen passen nicht. Markieren Sie Ihre Lösungen für die Aufgaben 47 bis 54 auf dem Antwortbogen. Lesen Sie jetzt die Aussagen A bis J. Sie haben dazu eine Minute Zeit.

Sprecher 1: Ich habe KI-Tools anfangs eher chaotisch genutzt. Mal habe ich mir eine Zusammenfassung machen lassen, mal eine Gliederung, mal nur einzelne Begriffe erklären lassen. Am Ende war alles irgendwie da, aber ich hatte keinen richtigen Lernplan. Seit diesem Semester nutze ich KI anders: Ich gebe zuerst mein Lernziel ein, danach lasse ich mir einen Wochenplan mit kleinen Schritten vorschlagen. Den passe ich dann selbst an. Für mich war genau das der entscheidende Punkt. Ich lerne mittlerweile strukturierter und verschiebe weniger. Die KI ersetzt mein Denken nicht, aber sie hilft mir, den roten Faden zu halten. Gerade vor Prüfungen ist das ein großer Vorteil, weil ich schneller sehe, was ich schon kann und was noch offen ist.

Sprecher 2: Ich studiere Verwaltungswissenschaft und arbeite nebenbei in einer Behörde. Für mich ist das Thema Datenschutz beim Einsatz von KI zentral. Viele Kommilitonen kopieren einfach Seminartexte oder Fallbeispiele in irgendwelche Tools, ohne genau zu wissen, wo diese Daten landen. Das wäre in meinem Arbeitskontext ein absolutes No-Go. Wir haben oft Inhalte mit Personenbezug oder interne Abläufe. Die darf ich nicht in externe Systeme eingeben. Deshalb nutze ich KI nur sehr eingeschränkt und nur dann, wenn die Hochschule klare, datenschutzkonforme Lösungen bereitstellt. Ich bin nicht grundsätzlich gegen KI, aber solange der Schutz sensibler Daten nicht eindeutig geregelt ist, bleibe ich vorsichtig. Für mich ist das keine Technikfeindlichkeit, sondern professionelle Sorgfalt.

Sprecher 3: In meinem Statistik-Tutorium sehe ich regelmäßig, dass KI-Antworten sehr überzeugend klingen, aber fachlich nicht immer stimmen. Das Problem ist: Wer die Grundlagen nicht sicher beherrscht, merkt viele Fehler gar nicht. Ein Beispiel sind Regressionsmodelle. Die KI nennt manchmal korrekte Formeln, erklärt aber die Voraussetzungen falsch. Wenn man das ungeprüft übernimmt, baut man den Fehler in die ganze Analyse ein. Deshalb sage ich meinen Erstsemestern immer: Erst das Konzept verstehen, dann Tools nutzen. KI kann hilfreich sein, aber nur mit fachlicher Kontrolle. Gerade in datenintensiven Fächern ist sie kein Taschenrechner mit Garantie, sondern eher ein Vorschlagsgenerator. Ohne eigenes Fachwissen kann man die Qualität der Antworten kaum zuverlässig prüfen.

Sprecher 4: Ich sitze in der Fachschaft und bekomme viele Fragen zur KI-Nutzung in Hausarbeiten. Das größte Problem ist derzeit die Uneinheitlichkeit. In einem Seminar ist KI für die Ideenfindung ausdrücklich erlaubt, im nächsten gilt schon die Nutzung von Formulierungshilfen als problematisch. Studierende sind dadurch verunsichert, weil sie nicht wissen, was fair und korrekt ist. Ich finde, Hochschulen brauchen verbindliche, transparente Regeln, die für alle Fächer nachvollziehbar sind. Natürlich kann es fachspezifische Unterschiede geben, aber die Grundlinie sollte klar sein: Was darf man nutzen, was muss man kennzeichnen, wie wird Eigenleistung bewertet? Solange das fehlt, entstehen Missverständnisse und im schlimmsten Fall ungerechte Bewertungen.

Sprecher 5: Ich arbeite in mehreren Projektseminaren, in denen wir in Teams mit sieben bis neun Personen arbeiten. Da hilft uns KI vor allem organisatorisch. Wir lassen uns zum Beispiel erste Zeitpläne erstellen, Sitzungsprotokolle strukturieren oder Aufgabenlisten in klare Schritte aufteilen. Früher haben wir dafür ewig gebraucht, weil jeder eine andere Vorstellung hatte. Heute starten wir schneller in die eigentliche inhaltliche Arbeit. Wichtig ist aber: Die fachlichen Entscheidungen treffen wir weiterhin selbst. KI sagt uns nicht, welche These richtig ist oder wie wir argumentieren sollen. Sie spart uns vor allem Koordinationszeit. Besonders praktisch ist das, wenn Teammitglieder unterschiedliche Arbeitszeiten haben. Dann kann man Informationen schneller zusammenführen und Missverständnisse reduzieren.

Sprecher 6: Ich habe eine diagnostizierte Lese-Rechtschreib-Störung. Für mich sind KI-Tools nicht nur Bequemlichkeit, sondern oft eine Voraussetzung, um im Studium überhaupt auf Augenhöhe mitarbeiten zu können. Vorlesefunktionen, vereinfachte Textzusammenfassungen und Strukturhilfen machen einen großen Unterschied. Wenn ich einen komplexen Aufsatz erst in eine klarere Form bringe, kann ich mich viel besser auf den Inhalt konzentrieren. Ich finde deshalb, dass Hochschulen fairen Zugang zu solchen Tools schaffen sollten, zum Beispiel durch Campuslizenzen und kurze Schulungen. Dann profitieren nicht nur einzelne, die sich teure Abos leisten können, sondern alle. KI löst nicht jedes Problem, aber sie kann Lernchancen deutlich gerechter machen, wenn die Rahmenbedingungen stimmen.

Sprecher 7: Ich schreibe viele wissenschaftliche Texte und nutze KI inzwischen recht gezielt, aber sehr begrenzt. Für inhaltliche Argumente verlasse ich mich nicht auf automatische Vorschläge. Was ich sinnvoll finde, ist die sprachliche Überarbeitung: Ist ein Absatz zu lang? Ist die Argumentation an einer Stelle unklar? Gibt es Wiederholungen? In dieser Rolle ist KI für mich wie ein zusätzlicher Korrekturblick. Ich lasse mir also keine fertigen Inhalte produzieren, sondern überprüfe meinen eigenen Text auf Verständlichkeit und Struktur. Das spart Zeit im Endlektorat, ohne dass ich die Verantwortung abgebe. Ich glaube, genau diese Trennung ist wichtig: Inhaltliche Arbeit bleibt bei mir, sprachliche Feinjustierung kann ein Tool unterstützen.

Sprecher 8: Ich komme aus Spanien und studiere erst seit einem Jahr in Deutschland. Fachlich kann ich gut mithalten, aber bei wissenschaftlichem Deutsch hatte ich anfangs große Unsicherheiten. KI hat mir geholfen, meine Texte sprachlich zu überarbeiten, vor allem bei Satzbau und Register. Ich schreibe zuerst alles selbst und lasse mir dann alternative Formulierungen zeigen, um idiomatischer zu werden. Außerdem übe ich mit KI mündliche Situationen, etwa kurze Seminarbeiträge oder Nachfragen an Dozierende. Das hat mein Selbstvertrauen deutlich verbessert. Für mich ist KI also keine Abkürzung, sondern eine Lernhilfe im Sprachbereich. Gerade internationale Studierende können davon profitieren, solange klar bleibt, dass die fachliche Leistung weiterhin aus eigener Arbeit kommen muss.


Hörverstehen Teil 2

Sie hören eine Radiosendung. Sie hören die Sendung nur einmal. Entscheiden Sie beim Hören, welche Aussage A, B oder C am besten passt. Markieren Sie Ihre Lösungen für die Aufgaben 55 bis 64 auf dem Antwortbogen. Lesen Sie jetzt die Aufgaben 55 bis 64. Sie haben dazu drei Minuten Zeit.

Moderator: Guten Abend und willkommen bei Campus Fokus. Viele Studierende kämpfen mit Konzentrationsproblemen, Lernstress und dem Gefühl, ständig hinterherzulaufen. Was hilft wirklich und was sind nur populäre Lerntipps ohne Wirkung? Darüber sprechen wir heute mit der Lernforscherin Dr. Lena Vogt von der Universität Freiburg. Guten Abend, Frau Dr. Vogt.

Dr. Vogt: Guten Abend, ich freue mich auf das Gespräch.

Moderator: Frau Dr. Vogt, wenn Studierende wichtige Aufgaben aufschieben, heißt es oft: Es fehlt einfach an Disziplin. Ist das aus Ihrer Forschungsperspektive zutreffend?

Dr. Vogt: Nur teilweise. Natürlich spielt Selbststeuerung eine Rolle, aber in der Praxis sehen wir häufiger etwas anderes: Viele wissen gar nicht, wie sie konkret anfangen sollen. Die Aufgabe ist zu groß, der Einstieg unklar, dazu kommen Unsicherheit und Bewertungsangst. Dann wird aufgeschoben, nicht weil jemand faul ist, sondern weil der erste Schritt nicht greifbar ist. Genau hier setzen wir in Trainings an.

Moderator: Ein zweiter Klassiker sind digitale Unterbrechungen. Viele sagen: \"Dann leg halt das Handy weg.\" Warum reicht das nicht?

Dr. Vogt: Weil das Problem nicht nur in der Unterbrechung selbst liegt. Entscheidend ist der kognitive Wiedereinstieg. Nach jeder Benachrichtigung braucht das Gehirn Zeit, um wieder in den gedanklichen Zusammenhang zurückzufinden. Diese versteckten Wechselkosten summieren sich. Wer zehnmal kurz rausgerissen wird, verliert viel mehr als nur zehnmal ein paar Sekunden.

Moderator: Welche Arbeitsrhythmen empfehlen Sie bei anspruchsvollen Aufgaben?

Dr. Vogt: Für komplexes Lesen, Schreiben oder Problemlösen haben sich in unseren Studien 50 Minuten konzentrierte Arbeit plus 10 Minuten Pause bewährt. Kürzere Intervalle funktionieren manchmal bei einfachen Routinen, aber bei tieferen Denkprozessen dauert es oft, bis man wirklich im Thema ist. Deshalb brauchen viele einen etwas längeren Fokusblock.

Moderator: Viele schreiben To-do-Listen, sind danach aber trotzdem blockiert. Was läuft da falsch?

Dr. Vogt: Die Einträge sind oft zu abstrakt. Wenn da steht \"Hausarbeit weitermachen\", hilft das kaum. Besser sind konkrete Handlungen mit Zeitpunkt und Kontext, zum Beispiel: \"Um 9 Uhr lese ich zwei Artikel und notiere jeweils drei Kernaussagen.\" Solche Formulierungen senken die Einstiegshürde deutlich, weil sofort klar ist, was zu tun ist.

Moderator: Lernen in Gruppen gilt als Gegenmittel gegen Aufschieben. Ist das immer sinnvoll?

Dr. Vogt: Nicht automatisch. Gruppen funktionieren dann gut, wenn sie verbindlich organisiert sind: klare Ziele, feste Rollen und ein realistischer Zeitrahmen. Fehlt diese Struktur, werden Treffen leicht zu sozialen Runden mit wenig Lernertrag. Die Gruppe wirkt dann aktiv, produziert aber kaum Fortschritt.

Moderator: Vor Prüfungen setzen viele auf Nachtschichten. Kann das eine sinnvolle Strategie sein?

Dr. Vogt: Kurzfristig kann man damit manchmal Fakten wiederholen. Aber bei Aufgaben, die Transfer, Argumentation und Problemlösen erfordern, ist Schlaf ein Schlüsselfaktor. Eine durchgearbeitete Nacht führt oft dazu, dass man sich subjektiv produktiv fühlt, objektiv aber deutlich mehr Fehler macht und komplexe Zusammenhänge schlechter erkennt.

Moderator: Was sollten Hochschulen tun, statt nur an die Eigenverantwortung zu appellieren?

Dr. Vogt: Ich plädiere für kurze verpflichtende Trainings im ersten Studienjahr. Dort sollten Lernplanung, Stressregulation, Umgang mit digitalen Ablenkungen und realistische Prüfungsstrategien vermittelt werden. Viele Probleme entstehen, weil Studierende diese Kompetenzen nie systematisch gelernt haben.

Moderator: Ab wann sollte man professionelle Hilfe suchen?

Dr. Vogt: Wenn Belastungssymptome über Wochen bestehen bleiben: ständige Erschöpfung, Schlafprobleme, Vermeidungsverhalten oder körperliche Stresssignale. Dann sollte man nicht bis zur nächsten Krise warten, sondern früh Beratung nutzen. Frühe Unterstützung wirkt deutlich besser als spätes Notfallmanagement kurz vor der Prüfung.

Moderator: Ein letztes Thema: KI-Lerntools. Helfen sie oder machen sie abhängig?

Dr. Vogt: Beides ist möglich. Sinnvoll sind sie als Feedbackinstrument: zum Strukturcheck, für Verständnisfragen oder zur sprachlichen Überarbeitung. Problematisch wird es, wenn man sie als Ersatz für eigenes Denken nutzt. Lernwirksam ist KI nur dann, wenn Studierende Ergebnisse kritisch prüfen und fachlich einordnen.

Moderator: Und Ihr bildungspolitischer Wunsch in einem Satz?

Dr. Vogt: Lernkompetenz sollte als verbindliches Querschnittsziel in allen Studiengängen verankert werden, mit aufeinander aufbauenden Meilensteinen über mehrere Semester.

Moderator: Frau Dr. Vogt, vielen Dank für das Gespräch.

Dr. Vogt: Sehr gern.


Hörverstehen Teil 3

Sie hören einen Vortrag. Sie hören den Vortrag nur einmal. Sie haben Handzettel mit den Folien der Präsentation erhalten. Schreiben Sie die fehlenden Informationen stichwortartig in die freien Zeilen 65 bis 74 in der rechten Spalte. Die Lösung 0 ist ein Beispiel. Lesen Sie jetzt die Stichworte. Sie haben dazu eine Minute Zeit.

Dozent: Meine Damen und Herren, ich begrüße Sie herzlich zum heutigen Kolloquium im Bereich Hochschuldidaktik. Unser Thema lautet \"Lernen mit gesellschaftlicher Verantwortung\". Als Referentin begrüßen wir Prof. Dr. Miriam Aydin von der Hochschule Rhein-Main. Sie forscht seit vielen Jahren zu Service Learning und Transferstrukturen an Hochschulen. Frau Professor Aydin, wir freuen uns auf Ihren Vortrag.

Prof. Aydin: Vielen Dank für die freundliche Einführung. Ich möchte Ihnen heute zeigen, warum Service Learning für Hochschulen ein strategisch wichtiges Lehrformat sein kann. Unter Service Learning verstehen wir Lehrveranstaltungen, in denen Studierende fachliche Inhalte mit gesellschaftlichem Engagement verbinden. Es geht also nicht um freiwillige Nebenprojekte, sondern um curricular verankertes Lernen mit realen Partnern.

Prof. Aydin: Lassen Sie mich mit einer aktuellen Zahl beginnen. In unserer hochschulweiten Befragung aus dem Jahr 2025 gaben rund zwei Drittel der Studierenden an, dass sie sich im Studium mehr reale Praxisbezüge wünschen. Noch interessanter war die Frage nach dem Motiv: Am häufigsten nannten die Befragten nicht Karrierevorteile, sondern den Wunsch nach gesellschaftlicher Relevanz. Viele möchten erleben, dass ihr Studium konkrete Wirkung außerhalb der Hochschule entfalten kann.

Prof. Aydin: Trotzdem scheitern viele Vorhaben schon in der Startphase. Zwei Hürden begegnen uns besonders häufig: erstens die zeitliche Starrheit klassischer Seminarpläne und zweitens fehlende externe Partner, die zuverlässig mit den Hochschulen kooperieren. Wenn Lehrveranstaltungen rein auf interne Abläufe ausgerichtet sind, lassen sich Praxisprojekte schwer integrieren.

Prof. Aydin: Ein Beispiel aus unserer Hochschule ist das Programm \"Campus hilft Stadtteil\". Dort arbeiten Studierende mit lokalen Initiativen zusammen. Zwei Projektlinien waren besonders erfolgreich: Sprachpatenschaften für neu zugewanderte Jugendliche und Energiesprechstunden für Mieterinnen und Mieter in älteren Wohnquartieren. In beiden Fällen mussten Studierende fachliche Modelle in alltagstaugliche Kommunikation übersetzen.

Prof. Aydin: Didaktisch ist der größte Gewinn aus meiner Sicht die Reflexionskompetenz. Studierende lernen nicht nur, etwas zu tun, sondern das eigene Handeln fachlich zu begründen und kritisch zu hinterfragen. In älteren Bewertungsrastern stand oft nur das Endprodukt im Zentrum, etwa ein Bericht oder eine Präsentation. Heute rückt stärker der Lernprozess in den Fokus: Wie wurde entschieden? Welche Annahmen wurden korrigiert? Wie wurde mit Zielkonflikten umgegangen?

Prof. Aydin: Damit solche Formate verlässlich funktionieren, brauchen wir Mindeststandards. In unseren Qualitätsleitlinien sind vor allem zwei Punkte zentral: klare Rollen zwischen Lehrenden, Studierenden und Praxispartnern sowie verlässliche Betreuung über die gesamte Laufzeit. Ein dritter Baustein ist schnelles Feedback. Projektgruppen erhalten bei uns in der Regel innerhalb von 72 Stunden eine Rückmeldung auf eingereichte Zwischenstände. Das stabilisiert die Arbeitsdynamik erheblich.

Prof. Aydin: Wenn wir nach vorn schauen, zeigt sich allerdings auch ein strukturelles Problem: Viele Initiativen hängen von einzelnen engagierten Personen ab. Die größte Herausforderung ist deshalb die dauerhafte Koordination über Fakultätsgrenzen hinweg. Unser Ziel bis 2028 ist der Aufbau eines zentralen Transferbüros, das Partnerschaften bündelt, Lehrprojekte begleitet und Qualitätsstandards langfristig sichert.

Prof. Aydin: Service Learning ist kein Ersatz für theoretische Grundlagenarbeit. Aber es ist eine hochwirksame Ergänzung, wenn wir Studium als Verbindung von Wissen, Verantwortung und Handlungsfähigkeit verstehen. Ich danke Ihnen für Ihre Aufmerksamkeit und freue mich auf die Diskussion.

Dozent: Vielen Dank, Frau Professor Aydin, für diesen klar strukturierten und praxisnahen Vortrag. Wir öffnen jetzt das Plenum für Fragen.

Ende des Subtests Hörverstehen.`,

  diskussionZitate: {
    1: { text:'/* TODO */', autor:'/* TODO */',
         aspekte:['/* TODO */','/* TODO */','/* TODO */','/* TODO */'] },
    2: { text:'/* TODO */', autor:'/* TODO */',
         aspekte:['/* TODO */','/* TODO */','/* TODO */','/* TODO */'] },
    3: { text:'/* TODO */', autor:'/* TODO */',
         aspekte:['/* TODO */','/* TODO */','/* TODO */','/* TODO */'] },
    4: { text:'/* TODO */', autor:'/* TODO */',
         aspekte:['/* TODO */','/* TODO */','/* TODO */','/* TODO */'] },
  }
};
