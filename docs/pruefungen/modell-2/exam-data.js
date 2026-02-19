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

  hvTranskript: `Hörverstehen — Transkript Modellprüfung 2

═══════════════════════════════════════
TEIL 1 — Globalverstehen
Thema: Berufseinstieg nach dem Studium
═══════════════════════════════════════

Moderatorin: Guten Tag, liebe Hörerinnen und Hörer. Willkommen zu unserer Sendung „Karrierewege". Heute geht es um den Berufseinstieg nach dem Studium. Wir haben acht junge Akademikerinnen und Akademiker eingeladen, die uns von ihren ersten Schritten auf dem Arbeitsmarkt berichten. Beginnen wir mit Sprecherin eins.

Sprecherin 1: Also, ich habe Betriebswirtschaft studiert und mich nach dem Abschluss wahnsinnig unter Druck gesetzt, sofort eine Stelle zu finden. Rückblickend muss ich sagen: Das war ein Fehler. Man sollte sich die Zeit nehmen, verschiedene Möglichkeiten auszuloten. Nicht jeder muss sofort den perfekten Job haben. Manchmal braucht es ein paar Monate, bis man weiß, was man wirklich will. Und das ist völlig in Ordnung. Der Druck, den man sich selbst macht, ist oft viel größer als der von außen.

Sprecher 2: Bei mir war es so, dass ich mein ganzes Studium über Kontakte geknüpft habe — bei Konferenzen, Workshops, Stammtischen. Und genau diese Kontakte haben mir den Berufseinstieg ermöglicht. Meine erste Stelle habe ich über einen ehemaligen Kommilitonen bekommen, der bereits in der Firma arbeitete. Ich bin fest davon überzeugt: Netzwerken ist das A und O. Man kann die beste Qualifikation haben — wenn man niemanden kennt, dauert es einfach viel länger.

Sprecherin 3: Ich habe nach dem Studium ein Jahr in Neuseeland verbracht, als Au-pair und Reisende. Viele haben den Kopf geschüttelt — ein Jahr verlorene Zeit, sagten sie. Aber dieses Jahr hat mir beruflich mehr gebracht als mein gesamtes Studium. Ich habe mein Englisch perfektioniert, interkulturelle Kompetenz entwickelt und gelernt, in völlig unbekannten Situationen zurechtzukommen. Mein jetziger Arbeitgeber hat genau das an meinem Lebenslauf geschätzt.

Sprecher 4: Was ich vielen raten würde: Seid offen für verschiedene Arbeitsorte. Ich komme aus Hamburg und wollte unbedingt dort bleiben. Aber dann kam ein tolles Angebot aus Leipzig, und ich habe es angenommen. Das war die beste Entscheidung meines Lebens. Die Jobchancen steigen enorm, wenn man bereit ist, umzuziehen. Nicht jeder muss in eine Großstadt — auch kleinere Städte haben interessante Arbeitgeber, und die Lebenshaltungskosten sind deutlich niedriger.

Sprecherin 5: Ich sage meinen Studierenden immer: Sammelt praktische Erfahrung, so viel ihr könnt. Praktika, Werkstudentenstellen, ehrenamtliche Projekte. Die Noten sind nicht unwichtig, aber ein Arbeitgeber wird immer jemanden bevorzugen, der schon praktische Erfahrung mitbringt. Mein erstes Praktikum habe ich im zweiten Semester gemacht, und von da an war ich fast ununterbrochen neben dem Studium beruflich aktiv. Das hat mir nach dem Abschluss alle Türen geöffnet.

Sprecher 6: Was mir geholfen hat, war die Bereitschaft, auch mal etwas zu machen, das nicht direkt mit meinem Studium zu tun hatte. Nach meinem Philosophiestudium habe ich zunächst im Kundenservice gearbeitet. Das klingt erst mal nicht glamourös, aber ich habe dort unglaublich viel über Kommunikation, Organisation und Teamarbeit gelernt. Und diese Fähigkeiten haben mir später den Sprung in die Unternehmensberatung ermöglicht.

Sprecherin 7: Woran viele scheitern, sind meiner Meinung nach die überzogenen Erwartungen. Man denkt, nach dem Studium wartet das Traumgehalt und der Traumjob. Aber die Realität sieht anders aus. Die ersten Jahre sind Lehrjahre, und das Einstiegsgehalt ist oft ernüchternd. Aber wenn man geduldig bleibt und gute Arbeit leistet, kommt der Rest von allein. Man darf nur nicht gleich aufgeben, wenn es am Anfang holprig läuft.

Sprecher 8: Für mich war der klassische Berufseinstieg mit Bewerbung und Festanstellung nichts. Ich habe mich nach dem Informatikstudium selbstständig gemacht und eine kleine App-Entwicklungsfirma gegründet. Das war riskant, und die ersten Monate waren hart. Aber heute, drei Jahre später, habe ich fünf Mitarbeiter und kann meine eigene Chefin sein. Selbstständigkeit ist nicht für jeden — aber für diejenigen, die eine gute Idee haben und bereit sind, hart zu arbeiten, kann sie eine hervorragende Alternative sein.

Moderatorin: Vielen Dank für diese spannenden Einblicke. Es zeigt sich: Den einen richtigen Weg gibt es nicht. Was zählt, ist Offenheit, Eigeninitiative und eine Portion Geduld.

═══════════════════════════════════════
TEIL 2 — Detailverstehen
Interview mit Prof. Dr. Martina Schäfer über Künstliche Intelligenz in der Medizin
═══════════════════════════════════════

Moderator: Frau Professor Schäfer, Sie forschen seit über zehn Jahren zum Einsatz von KI in der Medizin. Wie sind Sie zu diesem Thema gekommen?

Prof. Schäfer: Das war eigentlich eine glückliche Fügung. Ich habe ursprünglich Informatik studiert und dann in der medizinischen Bildverarbeitung promoviert. Dabei habe ich gemerkt, wie faszinierend die Verbindung von Informatik und Medizin sein kann. Die Möglichkeit, mit Algorithmen Leben zu retten — das hat mich nicht mehr losgelassen.

Moderator: Ein konkretes Beispiel: Wie kann KI bei der Hautkrebsdiagnose helfen?

Prof. Schäfer: KI-Systeme können Hautveränderungen auf Fotografien analysieren und dabei Muster erkennen, die das menschliche Auge schlicht übersieht. In einer Studie haben wir gezeigt, dass unser Algorithmus bei der Erkennung von Melanomen eine Trefferquote von über 95 Prozent erreicht. Das übersteigt die Genauigkeit vieler Dermatologen. Allerdings betone ich immer: Die KI ersetzt nicht den Arzt — sie unterstützt ihn bei der Entscheidungsfindung.

Moderator: Gibt es auch Probleme bei der KI-gestützten Diagnostik?

Prof. Schäfer: Ja, ein zentrales Problem ist die sogenannte „Black Box". Die meisten KI-Systeme können nicht erklären, wie sie zu ihren Ergebnissen kommen. Das ist für Ärzte und Patienten gleichermaßen problematisch. Wenn ein Arzt sagt: „Die KI meint, das ist Krebs" — dann möchte man natürlich wissen, warum. An der Lösung dieses Problems arbeiten wir intensiv.

Moderator: Was bedeutet der KI-Einsatz für die Patienten?

Prof. Schäfer: Vor allem schnellere Diagnosen. Stellen Sie sich vor, Sie warten nicht mehr wochenlang auf einen Befund, sondern bekommen innerhalb von Minuten ein Ergebnis. Das kann bei zeitkritischen Erkrankungen lebensrettend sein. Und es entlastet das Gesundheitssystem insgesamt.

Moderator: Wie sieht es mit dem Datenschutz aus?

Prof. Schäfer: Das ist tatsächlich eines der heikelsten Themen. KI-Systeme brauchen große Mengen an Patientendaten zum Trainieren. Und hier gibt es einen echten Interessenkonflikt: Einerseits wollen wir den medizinischen Fortschritt vorantreiben, andererseits müssen wir die Privatsphäre der Patienten schützen. Anonymisierung allein reicht nicht — man muss sehr sorgfältig abwägen.

Moderator: Sollte KI Teil der medizinischen Ausbildung werden?

Prof. Schäfer: Unbedingt. Ich plädiere dafür, dass der Umgang mit KI-Systemen ein fester Bestandteil des Medizinstudiums wird. Die Ärzte von morgen werden mit diesen Werkzeugen arbeiten — sie müssen verstehen, was KI kann und was nicht. Leider sind wir davon in Deutschland noch weit entfernt.

Moderator: Welches Potenzial hat KI in Entwicklungsländern?

Prof. Schäfer: Enormes Potenzial. In vielen Regionen gibt es zu wenige Ärzte für zu viele Patienten. KI-gestützte Apps könnten dort die medizinische Grundversorgung erheblich verbessern — etwa bei der Diagnose häufiger Infektionskrankheiten.

Moderator: Was ist die größte Hürde bei der Einführung in Krankenhäusern?

Prof. Schäfer: Ganz klar: die Integration in bestehende IT-Systeme und Arbeitsabläufe. Viele Krankenhäuser arbeiten noch mit veralteter Software. Ein neues KI-System einzuführen bedeutet nicht nur Technik, sondern auch Schulung, Prozessänderung und Überzeugungsarbeit.

Moderator: Wird KI den Arzt irgendwann ersetzen?

Prof. Schäfer: Nein, das glaube ich nicht. KI ist ein Werkzeug — ein sehr mächtiges Werkzeug, aber eben ein Werkzeug. Die Arzt-Patienten-Beziehung, die Empathie, das ganzheitliche Denken — das kann keine Maschine ersetzen. KI wird den Arzt unterstützen und ihm Routinearbeit abnehmen, damit er mehr Zeit für das Wesentliche hat.

Moderator: Was wünschen Sie sich für die Zukunft?

Prof. Schäfer: Ich wünsche mir, dass internationale Standards für medizinische KI entwickelt werden. Und zwar Standards, die von einer unabhängigen Behörde überprüft und durchgesetzt werden. Nur so können wir sicherstellen, dass KI-Systeme sicher und zuverlässig sind — überall auf der Welt.

Moderator: Vielen Dank für das Gespräch, Frau Professor Schäfer.

Prof. Schäfer: Sehr gerne.

═══════════════════════════════════════
TEIL 3 — Informationstransfer
Gastvortrag „Nachhaltige Stadtplanung und urbane Mobilität"
═══════════════════════════════════════

Dozent Berger: Guten Tag, meine Damen und Herren. Mein Name ist Thomas Berger, und ich arbeite am Institut für Verkehrsforschung in Berlin. Heute möchte ich mit Ihnen über ein Thema sprechen, das uns alle betrifft: nachhaltige Stadtplanung und urbane Mobilität. Oder anders gesagt: Wie kommen wir in unseren Städten von A nach B, ohne dabei den Planeten zu ruinieren?

Beginnen wir mit der Ausgangslage. Das Hauptproblem in deutschen Städten ist der Stau. Wir verbringen im Durchschnitt 40 Stunden pro Jahr im Stau — das ist fast eine ganze Arbeitswoche, die wir einfach verlieren. Und der Verkehr ist für ein Fünftel aller CO₂-Emissionen in Deutschland verantwortlich. Ein Fünftel! Das ist gewaltig, und es zeigt, wie dringend wir handeln müssen.

Ich möchte Ihnen nun ein Konzept vorstellen, das in den letzten Jahren viel Aufmerksamkeit bekommen hat: die sogenannte 15-Minuten-Stadt. Die Grundidee ist einfach, aber radikal: Alle wichtigen Einrichtungen des täglichen Lebens — Schulen, Ärzte, Einkaufsmöglichkeiten, Arbeitsplätze, Parks — sollen innerhalb von 15 Minuten erreichbar sein. Und zwar zu Fuß oder mit dem Fahrrad. Nicht mit dem Auto.

Schauen wir uns ein konkretes Beispiel an: Kopenhagen. Die dänische Hauptstadt hat in den letzten 20 Jahren massiv in die Fahrradinfrastruktur investiert. Das Ergebnis ist beeindruckend: Der Radverkehrsanteil liegt mittlerweile bei 62 Prozent aller Pendelwege. Gleichzeitig ist der Autoverkehr deutlich gesunken, und die Stadt hat ihre CO₂-Emissionen im Verkehrssektor um 40 Prozent reduziert. Kopenhagen zeigt: Es geht, wenn der politische Wille da ist.

Kommen wir zum öffentlichen Nahverkehr. Die Kernforderung vieler Verkehrsexperten ist eine deutliche Takterhöhung — also häufigere Verbindungen, damit die Menschen nicht ewig an der Haltestelle stehen müssen. Bisher liegt das Problem vor allem in ländlichen Gebieten und den Randgebieten der Städte. Dort ist die Anbindung oft so schlecht, dass die Menschen gar keine Alternative zum Auto haben. Eine vielversprechende Lösung sind sogenannte On-Demand-Angebote, also Rufbusse oder flexible Shuttles, die man per App bestellen kann und die einen direkt von der Haustür zur nächsten Bahnstation bringen.

Jetzt zur Rolle des Fahrrads in Deutschland. Aktuell liegt der Radverkehrsanteil bei elf Prozent — das klingt wenig, und das ist es auch. Die Bundesregierung hat sich zum Ziel gesetzt, diesen Anteil bis 2030 auf 25 Prozent zu verdoppeln. Dafür ist vor allem eines nötig: sichere Radwege. Solange Radfahrer zwischen Bussen und LKW eingekeilt werden, werden viele Menschen weiterhin aufs Auto zurückgreifen. Geschützte Radwege, baulich getrennt vom Autoverkehr — das ist die wichtigste Maßnahme.

Lassen Sie mich zum Schluss kommen. Nachhaltige Mobilität erfordert politischen Willen und erhebliche Investitionen. Es reicht nicht, ein paar Radwege zu markieren und sich auf die Schulter zu klopfen. Wir brauchen einen grundlegenden Umbau unserer Städte. Und ich bin davon überzeugt: Die Stadt der Zukunft wird nicht für Autos gebaut sein, sondern für Menschen. Eine Stadt, in der man gerne zu Fuß geht, in der Kinder sicher zur Schule radeln können und in der der öffentliche Nahverkehr so gut ist, dass man kein eigenes Auto mehr braucht.

Vielen Dank für Ihre Aufmerksamkeit. Haben Sie Fragen?`,

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
