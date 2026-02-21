/* Modellprüfung 2 — Exam data (answers, themes, quotes) */
'use strict';

// TODO: Fill in correct answers and content for Modellprüfung 2
const EXAM_DATA = {
  title: 'Modellprüfung 2',

  correct: {
    lv1: { 1:'d', 2:'a', 3:'f', 4:'b', 5:'h', 6:'e' },
    lv2: { 7:'a', 8:'b', 9:'c', 10:'e', 11:'d', 12:'e' },
    lv3: { 13:'+', 14:'−', 15:'+', 16:'×', 17:'−', 18:'+', 19:'−', 20:'+', 21:'×', 22:'×', 23:'−', 24:'b' },
    sb:  { 25:'b',26:'a',27:'c',28:'b',29:'a',30:'b',31:'a',32:'c',33:'b',34:'d',35:'c',36:'d',37:'c',38:'b',39:'c',40:'c',41:'b',42:'c',43:'c',44:'b',45:'d',46:'a',47:'d' },
    hv1: { 47:'i',48:'b',49:'g',50:'a',51:'c',52:'d',53:'e',54:'h' },
    hv2: { 55:'b',56:'a',57:'c',58:'a',59:'b',60:'a',61:'b',62:'b',63:'b',64:'c' },
    hv3: {
      65:['40 prozent','um 40 prozent','vierzig prozent','anstieg um 40'],
      66:['konkreter beitrag zum umweltschutz','beitrag zum umweltschutz','umweltschutz'],
      '67a':['komplizierte registrierung','aufwendige registrierung','registrierung'],
      '67b':['unverständliche fachsprache','fachsprache','wissenschaftssprache'],
      '68a':['feinstaub messen','feinstaubmessungen','feinstaub'],
      '68b':['lärmprotokolle','laermprotokolle','lärm dokumentieren','laerm dokumentieren','lärm'],
      69:['forschendes lernen mit realen datensätzen','forschendes lernen','reale datensätze','reale datensaetze'],
      '70a':['datenkonsumenten','nur datenkonsumenten','konsumenten'],
      '70b':['co-forschende','mitforschende','coforschende'],
      '71a':['doppelmessungen','doppelte messungen','doppelmessung'],
      '71b':['kurze online-schulungen','online-schulungen','schulungen'],
      72:['48 stunden','innerhalb von 48 stunden','zwei tagen','2 tagen'],
      73:['langfristige finanzierung','finanzierung','dauerhafte finanzierung'],
      74:['offene datenplattform der hochschule','offene datenplattform','datenplattform']
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
    digitalisierung: {
      title: 'Thema 1: Digitalisierung in der Hochschulbildung',
      zitate: [
        'Digitale Medien eröffnen völlig neue Bildungschancen.',
        'Digitale Medien machen oberflächlich und abhängig.'
      ]
    },
    ethikpflicht: {
      title: 'Thema 2: Ethik als Pflichtfach',
      zitate: [
        'Alle Studierenden sollten Pflichtkurse in Ethik belegen.',
        'Jeder sollte selbst entscheiden, was er lernt.'
      ]
    }
  },

  hvTranskript: `Hörverstehen Teil 1

Sie hören die Meinungen von acht Personen. Sie hören die Meinungen nur einmal. Entscheiden Sie beim Hören, welche Aussage A bis J zu welcher Person passt. Zwei Aussagen passen nicht. Markieren Sie Ihre Lösungen für die Aufgaben 47 bis 54 auf dem Antwortbogen. Lesen Sie jetzt die Aussagen A bis J. Sie haben dazu eine Minute Zeit.

Sprecher 1: Am Anfang war ich beim Thema KI ziemlich skeptisch, vor allem beim wissenschaftlichen Schreiben. Ich hatte die Sorge, dass solche Tools den eigenen Stil verwässern. Inzwischen nutze ich sie aber gezielt, allerdings nicht, um ganze Absätze erzeugen zu lassen. Für mich sind sie eher eine Art Gegenleser. Ich gebe einen Entwurf ein und lasse mir sagen, ob Argumentationssprünge drin sind oder ob Begriffe unklar bleiben. Danach überarbeite ich alles selbst. Besonders hilfreich ist das bei Hausarbeiten, wenn man nach mehreren Stunden betriebsblind wird. Wichtig ist für mich nur, dass ich die fachlichen Quellen weiterhin eigenständig recherchiere und nicht blind übernehme, was ein System vorschlägt. Wenn man KI so einsetzt, kann sie den Schreibprozess wirklich verbessern, ohne dass man die Verantwortung für den Inhalt abgibt.

Sprecher 2: Ich nutze KI-Tools kaum, und das hat weniger mit Technikangst zu tun als mit Datenschutz. In vielen Anwendungen ist nämlich unklar, wo die eingegebenen Daten landen und wer später darauf zugreifen kann. In meinem Studium arbeiten wir oft mit sensiblen Fallbeispielen aus Projekten mit externen Partnern. Da kann ich nicht einfach Textausschnitte in irgendein System kopieren. Viele Kommilitoninnen und Kommilitonen klicken die Nutzungsbedingungen weg, ohne sie zu lesen. Ich finde das riskant. Natürlich wäre es praktisch, wenn man schneller Zusammenfassungen oder Formulierungshilfen bekommt. Aber solange Hochschulen keine transparenten und datenschutzkonformen Lösungen bereitstellen, bleibe ich lieber bei klassischen Methoden. Für mich ist das kein Rückschritt, sondern eine Frage professioneller Sorgfalt.

Sprecher 3: In meinem Informatikstudium setze ich KI ziemlich intensiv ein, aber auf eine klare Art: als Sparringspartner beim Programmieren. Wenn ich bei einem Bug feststecke, frage ich erst die KI nach möglichen Ursachen und vergleiche dann die Vorschläge mit der Dokumentation. Das spart oft viel Zeit, weil man schneller verschiedene Lösungswege sieht. Früher musste ich stundenlang in Foren suchen, bis ich etwas Passendes gefunden habe. Jetzt bekomme ich innerhalb von Sekunden mehrere Ansätze und kann prüfen, welcher für meinen Code passt. Mir ist aber wichtig zu sagen: Man darf die Antworten nie direkt übernehmen. Manche Vorschläge sehen plausibel aus, enthalten aber subtile Fehler. Deshalb teste ich alles selbst und versuche zu verstehen, warum ein Fix funktioniert. Dann ist das Tool wirklich nützlich.

Sprecher 4: Ich unterrichte an einer Fachhochschule und wir diskutieren seit zwei Semestern intensiv, wie wir mit KI in Prüfungsleistungen umgehen. Ein vollständiges Verbot halte ich für unrealistisch, weil die Werkzeuge längst Teil des Studienalltags sind. Entscheidend ist aus meiner Sicht Transparenz. Studierende sollen kenntlich machen, welche Arbeitsschritte sie mithilfe von KI erledigt haben und wie sie die Ergebnisse überprüft haben. Wenn jemand nur Text erzeugen lässt und unverändert einreicht, ist das natürlich problematisch. Wenn KI aber zur Strukturierung von Ideen genutzt wird und anschließend eine eigenständige fachliche Leistung entsteht, kann das didaktisch sinnvoll sein. Wir haben deshalb Leitlinien entwickelt, statt nur Sanktionen anzudrohen. Das schafft mehr Fairness und macht die Anforderungen für alle klarer.

Sprecher 5: Für mich als internationale Studentin war die größte Hürde im ersten Jahr nicht das Lesen, sondern das Sprechen in Seminaren. Ich hatte ständig Angst, spontan Fehler zu machen. Dann habe ich angefangen, mit einer KI kurze Rollenspiele zu üben: mündliche Zusammenfassungen, Nachfragen, kleine Debatten. Das hat mir geholfen, typische Redemittel zu trainieren, ohne dass gleich eine ganze Gruppe zuhört. Besonders gut war, dass ich sofort Rückmeldung zu unklaren Formulierungen bekam. Nach ein paar Monaten habe ich gemerkt, dass ich im Seminar viel entspannter reagiere und öfter das Wort ergreife. Natürlich ersetzt das keine echten Gespräche mit Menschen, aber als zusätzliche Übungsumgebung war es für mich enorm hilfreich. Ich hätte mir gewünscht, dass ich das schon früher ausprobiert hätte.

Sprecher 6: Bei mir hat KI paradoxerweise dazu geführt, dass ich noch mehr aufschiebe. Klingt komisch, ist aber so. Ich wollte eigentlich schneller arbeiten und verliere mich dann in endlosen Prompt-Varianten: erst eine Zusammenfassung, dann eine kürzere, dann eine mit anderem Ton, dann wieder umformulieren. Am Ende habe ich das Gefühl, produktiv gewesen zu sein, aber die eigentliche Aufgabe ist nicht fertig. Diese ständige Optimierung frisst Zeit. Früher war mein Problem, dass ich zu spät angefangen habe. Heute beginne ich zwar früher, aber verzettle mich in Nebenschritten. Ich musste erst lernen, mir klare Grenzen zu setzen, zum Beispiel maximal zehn Minuten KI-Unterstützung pro Abschnitt. Sonst wird das Tool bei mir eher zur Ausweichstrategie als zur echten Hilfe.

Sprecher 7: Ich beobachte bei Erstsemestern oft, dass sie KI-Antworten für objektiv richtig halten, nur weil sie sprachlich überzeugend klingen. Genau da liegt das Problem: Ohne solides Grundlagenwissen kann man Fehler kaum erkennen. In meinem Fach, der Statistik, produziert KI manchmal korrekte Formeln, erklärt aber die Voraussetzungen falsch. Wer das nicht merkt, baut den Fehler in die ganze Analyse ein. Deshalb sage ich meinen Tutoriumsgruppen immer: Erst das Konzept verstehen, dann digitale Werkzeuge nutzen. KI kann Lernprozesse unterstützen, aber sie ersetzt keine fachliche Urteilskraft. Wenn man die Grundlagen beherrscht, kann man sehr präzise prüfen, was brauchbar ist und was nicht. Ohne dieses Fundament wird man schnell abhängig von Antworten, die vielleicht elegant formuliert, aber inhaltlich unzuverlässig sind.

Sprecher 8: Ich habe eine Lese-Rechtschreib-Störung und nutze KI vor allem aus Gründen der Barrierefreiheit. Für mich sind Funktionen wie Vorlesemodus, vereinfachte Zusammenfassungen und strukturierte Gliederungsvorschläge extrem hilfreich. Früher brauchte ich sehr lange, um komplexe Texte zu erfassen. Jetzt kann ich Inhalte schneller vorstrukturieren und mich besser auf den fachlichen Kern konzentrieren. Das nimmt nicht die Arbeit ab, aber es macht sie zugänglicher. Ich finde, in der Debatte wird oft vergessen, dass solche Werkzeuge nicht nur Bequemlichkeit bedeuten, sondern für manche Studierende überhaupt erst gleichwertige Teilhabe ermöglichen. Wichtig ist natürlich, dass diese Unterstützung transparent genutzt wird. Aber pauschale Verbote würden gerade diejenigen benachteiligen, die ohnehin höhere Hürden im Studium haben.


Hörverstehen Teil 2

Sie hören eine Radiosendung. Sie hören die Sendung nur einmal. Entscheiden Sie beim Hören, welche Aussage A, B oder C am besten passt. Markieren Sie Ihre Lösungen für die Aufgaben 55 bis 64 auf dem Antwortbogen. Lesen Sie jetzt die Aufgaben 55 bis 64. Sie haben dazu drei Minuten Zeit.

Moderator: Guten Abend und willkommen bei Campus aktuell. Viele Studierende kennen das Problem: Man schiebt wichtige Aufgaben immer weiter auf und arbeitet dann unter extremem Druck. Über Ursachen und konkrete Gegenstrategien sprechen wir heute mit Prof. Dr. Laura Stein. Sie leitet an der Universität Mainz die Arbeitsstelle Lernpsychologie. Guten Abend, Frau Stein.

Prof. Stein: Guten Abend, ich freue mich auf das Gespräch.

Moderator: Frau Stein, wenn über Prokrastination gesprochen wird, heißt es oft: Den Betroffenen fehlt einfach die Disziplin. Ist das aus wissenschaftlicher Sicht haltbar?

Prof. Stein: Diese Erklärung greift viel zu kurz. Prokrastination ist in den meisten Fällen kein reines Willensproblem, sondern ein Problem der Emotionsregulation. Menschen vermeiden Aufgaben, die Unsicherheit, Überforderung oder Angst auslösen. Kurzfristig fühlt sich diese Vermeidung entlastend an, langfristig steigt aber der Stress.

Moderator: Gibt es Gruppen, die besonders anfällig sind?

Prof. Stein: Ja, zum Beispiel Studierende mit stark perfektionistischen Ansprüchen. Sie wollen Ergebnisse liefern, die von Anfang an nahezu fehlerfrei sind. Dadurch wird der Einstieg so groß und bedrohlich, dass sie gar nicht erst beginnen.

Moderator: Ein zweiter Faktor sind digitale Ablenkungen. Manche sagen: Dann legt man eben das Handy weg und gut ist. Ist es wirklich so einfach?

Prof. Stein: Leider nein. Das Problem ist nicht nur die einzelne Unterbrechung, sondern der permanente Aufmerksamkeitswechsel. Jede Benachrichtigung zwingt das Gehirn zu einem Kontextwechsel. Bis man wieder in die Aufgabe hineingefunden hat, vergeht Zeit und kognitive Energie.

Moderator: Welche Methode empfehlen Sie konkret für den Alltag?

Prof. Stein: Gute Erfahrungen machen wir mit Zeitblocken. Für viele Studierende sind 45 Minuten fokussierte Arbeit und 10 Minuten Pause praktikabler als sehr kurze Intervalle. Wichtig ist, das Schema flexibel an die Art der Aufgabe anzupassen.

Moderator: Viele schreiben To-do-Listen, fühlen sich danach aber noch überforderter. Woran liegt das?

Prof. Stein: Häufig sind die Einträge zu unscharf, etwa „Hausarbeit weiterschreiben". Hilfreicher sind konkrete Wenn-dann-Pläne, zum Beispiel: „Wenn es 9 Uhr ist, lese ich zwei Studien und notiere jeweils drei Kernaussagen." Diese Präzision senkt die Einstiegshürde deutlich.

Moderator: Und was ist mit selbst gesetzten Fristen? Die kann man doch jederzeit verschieben.

Prof. Stein: Genau deshalb wirken sie besser, wenn sie sozial verbindlich gemacht werden, etwa durch eine Lerngruppe oder durch öffentliche Kommunikation. Wer eine Zwischenabgabe ankündigt, hält sie mit höherer Wahrscheinlichkeit ein.

Moderator: In Prüfungsphasen setzen viele auf Nachtschichten. Kann das funktionieren?

Prof. Stein: Kurzfristig ja, vor allem bei einfachem Auswendiglernen. Für komplexe Aufgaben, bei denen man transferieren und argumentieren muss, ist Schlaf aber zentral. Ohne ausreichende Erholung sinken Konzentration und Fehlerkontrolle.

Moderator: Lernen in Gruppen gilt als Gegenmittel gegen Aufschieben. Stimmen Sie zu?

Prof. Stein: Ja, aber nur unter Bedingungen. Lerngruppen sind dann wirksam, wenn Ziele, Rollen und Zeitrahmen vorher klar vereinbart werden. Sonst entstehen leicht soziale Treffen, die produktiv wirken, aber wenig Lernertrag bringen.

Moderator: Wann sollte man professionelle Beratung suchen?

Prof. Stein: Wenn das Aufschieben über mehrere Wochen anhält und zu deutlicher Belastung führt, etwa Schlafproblemen, ständiger Schuld oder körperlichen Stresssymptomen. Dann sollte man nicht warten, sondern früh Unterstützung nutzen.

Moderator: Was wünschen Sie sich von Hochschulen?

Prof. Stein: Vor allem präventive Angebote: kurze, verpflichtende Trainings zu Lernstrategien, Zeitplanung und Stressregulation im ersten Semester und vor Prüfungsphasen. Wenn Studierende solche Werkzeuge früh lernen, sinkt das Risiko chronischer Prokrastination erheblich.

Moderator: Frau Prof. Stein, vielen Dank für das Gespräch.

Prof. Stein: Sehr gern.


Hörverstehen Teil 3

Sie hören einen Vortrag. Sie hören den Vortrag nur einmal. Sie haben Handzettel mit den Folien der Präsentation erhalten. Schreiben Sie die fehlenden Informationen stichwortartig in die freien Zeilen 65 bis 74 in der rechten Spalte. Die Lösung 0 ist ein Beispiel. Lesen Sie jetzt die Stichworte. Sie haben dazu eine Minute Zeit.

Dozent: Meine Damen und Herren, ich begrüße Sie zur heutigen Sitzung unseres hochschuldidaktischen Kolloquiums. Wir beschäftigen uns mit der Frage, wie Studierende stärker in reale Forschungsprozesse eingebunden werden können. Dazu begrüße ich Dr. Miriam Keller von der Universität Freiburg. Sie leitet dort das Projekt CampusCitizenLab. Frau Dr. Keller, wir freuen uns auf Ihren Vortrag.

Dr. Keller: Vielen Dank für die Einladung. Ich spreche heute über Citizen Science als Lernformat an Hochschulen. Gemeint sind Forschungsprojekte, an denen Bürgerinnen und Bürger sowie Studierende gemeinsam mit Wissenschaftlerinnen und Wissenschaftlern arbeiten.

Dr. Keller: Zunächst ein kurzer Blick auf die Entwicklung: In unseren Verbundprojekten ist die Beteiligung seit 2018 um rund 40 Prozent gestiegen. Das ist bemerkenswert, weil sich damit zeigt, dass die Bereitschaft zur Mitarbeit keineswegs auf ein kleines Spezialpublikum beschränkt ist. Wir haben parallel Interviews mit Teilnehmenden geführt. Das häufigste Motiv war nicht, wie oft vermutet, ein Zertifikat oder ein Karrierevorteil, sondern der Wunsch, einen konkreten Beitrag zum Umweltschutz zu leisten.

Dr. Keller: Trotz dieser positiven Dynamik verlieren viele Projekte Interessierte bereits in der Einstiegsphase. Zwei Hürden begegnen uns besonders häufig: erstens eine komplizierte Registrierung mit mehreren Formularschritten und zweitens eine Fachsprache, die für Neulinge schwer verständlich ist. Wer schon beim ersten Kontakt das Gefühl hat, etwas Grundsätzliches nicht zu verstehen, steigt oft wieder aus.

Dr. Keller: Ich möchte das am Stadtluft-Projekt illustrieren, das wir mit drei Hochschulen durchgeführt haben. Dort haben Studierende und Bürgerinnen gemeinsam Daten zur lokalen Umweltbelastung erhoben. Zwei Aufgaben waren zentral: feine Partikel in verschiedenen Stadtvierteln messen und parallel standardisierte Lärmprotokolle dokumentieren. Durch diese Kombination konnten wir nicht nur punktuelle, sondern vergleichbare Datensätze erstellen.

Dr. Keller: Didaktisch ist der größte Gewinn aus meiner Sicht das forschende Lernen mit realen Datensätzen. Studierende arbeiten nicht mehr nur mit künstlichen Übungsbeispielen, sondern mit Material, das sie selbst mit erzeugt haben. Damit verändert sich auch ihre Rolle. In klassischen Lehrformaten waren sie oft vor allem Datenkonsumenten: Sie haben vorhandene Ergebnisse analysiert. In Citizen-Science-Projekten werden sie dagegen zu Co-Forschenden, die Fragestellungen mitentwickeln und Datenerhebung kritisch reflektieren.

Dr. Keller: Ein häufiges Gegenargument lautet, dass Bürgerdaten zu ungenau seien. Qualitätssicherung ist tatsächlich zentral. Wir nutzen dafür zwei einfache, aber wirksame Verfahren: Doppelmessungen an ausgewählten Standorten und kurze Online-Schulungen vor dem Projekteinstieg. Zusätzlich geben wir den Teilnehmenden möglichst schnell Rückmeldung, in der Regel innerhalb von 48 Stunden. Diese zeitnahe Resonanz erhöht nachweislich die Verlässlichkeit der weiteren Eingaben.

Dr. Keller: Zum Schluss ein Blick nach vorn. Die größte strukturelle Herausforderung bleibt die langfristige Finanzierung. Viele Initiativen laufen nur projektbezogen und enden nach zwei oder drei Jahren, obwohl sie didaktisch erfolgreich sind. Unser Ziel bis 2028 ist daher der Aufbau einer offenen Datenplattform der Hochschule, auf der Lehrveranstaltungen, Forschungsgruppen und externe Partner dauerhaft zusammenarbeiten können.

Dr. Keller: Wenn uns dieser Schritt gelingt, wird Citizen Science nicht nur ein Zusatzangebot sein, sondern ein fester Bestandteil universitärer Lehre. Ich danke Ihnen für Ihre Aufmerksamkeit.

Dozent: Vielen Dank, Frau Dr. Keller, für den praxisnahen Vortrag. Wir öffnen jetzt die Diskussion für Fragen aus dem Plenum.

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
