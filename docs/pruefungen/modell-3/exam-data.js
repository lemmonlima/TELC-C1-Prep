/* Modellprüfung 3 — Exam data (answers, themes, quotes) */
'use strict';

const EXAM_DATA = {
  title: 'Modellprüfung 3',

  correct: {
    lv1: { 1:'g', 2:'f', 3:'a', 4:'h', 5:'b', 6:'d' },
    lv2: { 7:'a', 8:'d', 9:'c', 10:'d', 11:'b', 12:'e' },
    lv3: { 13:'−', 14:'×', 15:'+', 16:'−', 17:'×', 18:'+', 19:'−', 20:'+', 21:'−', 22:'×', 23:'+', 24:'b' },
    sb:  { 25:'c',26:'b',27:'a',28:'c',29:'a',30:'b',31:'b',32:'b',33:'a',34:'a',35:'a',36:'b',37:'a',38:'a',39:'b',40:'a',41:'a',42:'a',43:'c',44:'a',45:'a',46:'b',47:'a' },
    hv1: { 47:'j',48:'c',49:'f',50:'h',51:'d',52:'b',53:'a',54:'i' },
    hv2: { 55:'b',56:'c',57:'a',58:'c',59:'b',60:'a',61:'c',62:'b',63:'a',64:'b' },
    hv3: {
      65:['18 prozent','achtzehn prozent','um 18 prozent','rueckgang um 18 prozent','rückgang um 18 prozent'],
      66:['fehlende orientierung','orientierung','mangelnde orientierung'],
      '67a':['anonyme strukturen','anonymitaet','anonymität'],
      '67b':['unuebersichtliche pruefungsordnungen','unübersichtliche prüfungsordnungen','pruefungsordnungen','prüfungsordnungen'],
      '68a':['peer-sprechstunden','peer sprechstunden','sprechstunden'],
      '68b':['fachlernwerkstaetten','fachlernwerkstätten','lernwerkstaetten','lernwerkstätten'],
      69:['selbstwirksamkeit','selbstwirksamkeitserwartung'],
      '70a':['teilnahmelisten','anwesenheitslisten'],
      '70b':['lernfortschritt','lernentwicklung'],
      '71a':['verbindliche schulung','mentorenschulung','schulung der mentorinnen','schulung'],
      '71b':['feste supervision','supervisionstermine','regelmaessige supervision','regelmäßige supervision'],
      72:['48 stunden','innerhalb von 48 stunden','zwei tagen','2 tagen'],
      73:['kontinuierliche finanzierung','dauerhafte finanzierung','langfristige finanzierung','finanzierung'],
      74:['hochschulweites mentoringzentrum','mentoringzentrum','zentrales mentoringzentrum']
    }
  },

  themaTexte: {
    a1: 'Sollten Studierende im Bachelor verpflichtend ein Service-Learning-Projekt absolvieren? Bitte begründen Sie Ihre Meinung. Gibt es Gegenargumente?',
    a2: 'Ist eine verbindliche Anwesenheit in Lehrveranstaltungen heute noch zeitgemäß? Bitte begründen Sie Ihre Meinung. Gibt es Gegenargumente?',
    b1: 'Wie können Mentoringprogramme im ersten Studienjahr Studienabbrüche reduzieren? Bitte erläutern Sie wirksame Elemente und mögliche Grenzen.',
    b2: 'Sollte KI-gestütztes Feedback bei wissenschaftlichen Texten offiziell in die Lehre integriert werden? Bitte begründen Sie Ihre Meinung. Gibt es Gegenargumente?',
    c1: 'Welche Verantwortung haben Hochschulen für die soziale und akademische Integration internationaler Studierender? Bitte begründen Sie Ihre Meinung.',
    c2: 'Was ist für die Zukunft der Universitäten wichtiger: mehr Interdisziplinarität oder stärkere Spezialisierung? Bitte begründen Sie Ihre Meinung. Gibt es Gegenargumente?'
  },

  saThemen: {
    thema1: {
      title: 'Thema 1: Service Learning im Studium',
      zitate: [
        'Studierende sollten verpflichtend gesellschaftliche Praxisprojekte absolvieren.',
        'Universitäten sind für wissenschaftliche Vertiefung da, nicht für Sozialarbeit.'
      ]
    },
    thema2: {
      title: 'Thema 2: Hybride Lehre an Hochschulen',
      zitate: [
        'Hybride Lehrformate erhöhen Chancengleichheit und Flexibilität.',
        'Ohne Präsenzkultur verliert das Studium an Qualität und Verbindlichkeit.'
      ]
    }
  },

  hvTranskript: `Hörverstehen Teil 1

Sie hören die Meinungen von acht Personen. Sie hören die Meinungen nur einmal. Entscheiden Sie beim Hören, welche Aussage A bis J zu welcher Person passt. Zwei Aussagen passen nicht. Markieren Sie Ihre Lösungen für die Aufgaben 47 bis 54 auf dem Antwortbogen. Lesen Sie jetzt die Aussagen A bis J. Sie haben dazu eine Minute Zeit.

Sprecher 1: Ich habe zu Beginn meines Studiums unbedingt in Campusnähe wohnen wollen, weil ich dachte, dann werde alles einfacher. Nach drei Wochen Wohnungssuche war aber klar, dass ich mir die Mieten dort schlicht nicht leisten kann. Ich habe dann in einer kleineren Stadt im Umland ein Zimmer gefunden, fast 40 Minuten mit der S-Bahn entfernt. Anfangs war ich frustriert, weil ich immer wieder das Gefühl hatte, den Anschluss zu verlieren. Inzwischen weiß ich aber, dass es sehr vielen so geht: In meinem Jahrgang wohnen nur wenige wirklich in Uninähe. Die meisten haben aus Kostengründen ähnliche Lösungen gefunden. Man arrangiert sich irgendwie, aber ideal ist das nicht. Für mich ist das eindeutig ein strukturelles Problem. Und wenn man zusätzlich noch steigende Nebenkosten einrechnet, wird klar, dass viele gar keine echte Wahl haben.

Sprecher 2: Ich komme aus einer Familie, die mich finanziell nur begrenzt unterstützen kann. Deshalb rechne ich jeden Monat sehr genau durch, was überhaupt möglich ist. Am stärksten entlastet mich tatsächlich das Semesterticket. Ohne diese Pauschale wäre mein Weg zur Uni und zu meinem Nebenjob einfach zu teuer. Ich müsste entweder mehr arbeiten oder an anderer Stelle stark sparen, und beides hätte direkte Folgen fürs Studium. Viele unterschätzen, wie viel Mobilität im Alltag kostet, wenn man regelmäßig pendelt. Gerade für Studierende mit knapper Kalkulation ist das Ticket kein Bonus, sondern eine Voraussetzung. Für mich gehört es zu den wichtigsten sozialen Instrumenten an der Hochschule, weil es überhaupt erst Planungssicherheit schafft. Fällt da etwas weg, kippt sofort die ganze Monatsplanung.

Sprecher 3: Ich wohne nicht in der Stadt, sondern in einem Dorf, weil dort die Miete bezahlbar ist. Das funktioniert tagsüber meistens ganz gut, solange ich meinen Plan genau einhalte. Richtig schwierig wird es abends. Wenn Seminare länger dauern oder ich in der Bibliothek bleibe, wird die Rückfahrt schnell zum Problem. Nach 21 Uhr fährt oft nur noch stündlich etwas, teilweise mit langen Umstiegszeiten. Wenn eine Verbindung ausfällt, sitze ich fest. Genau deshalb sage ich immer: Die Strecke an sich ist gar nicht das Hauptproblem, sondern die fehlende Taktung am Abend. Dadurch kann man viele Angebote der Uni faktisch nicht nutzen, obwohl man fachlich gern teilnehmen würde. Gerade in Prüfungsphasen ist das extrem belastend, weil man Lernzeiten nicht frei steuern kann.

Sprecher 4: Ich habe mich bewusst entschieden, nicht in der Innenstadt zu wohnen. Ich brauche Ruhe zum Arbeiten und wollte nicht ständig von Verkehr und Nachtleben umgeben sein. Jetzt wohne ich in einem kleineren Ort mit viel Grün, und das tut mir im Alltag wirklich gut. Natürlich bedeutet das längere Fahrzeiten und mehr Organisation. Ich stehe morgens früher auf und muss spontane Termine oft ablehnen, wenn die Rückfahrt schwierig wird. Trotzdem bereue ich die Entscheidung nicht. Für meine Konzentration und mein Wohlbefinden ist diese Wohnsituation besser als ein kurzer Weg in einer lauten Umgebung. Ich nehme die zusätzlichen Wege also nicht notgedrungen in Kauf, sondern ziemlich bewusst, weil die Wohnqualität für mich Vorrang hat. Diese Entscheidung war am Ende eher eine Frage von Lebensqualität als von Bequemlichkeit.

Sprecher 5: Seit bei uns mehrere Veranstaltungen hybrid angeboten werden, hat sich mein Alltag stark verändert. Früher bin ich an fünf Tagen zur Uni gefahren, oft auch nur für einzelne Termine. Jetzt sind es meistens zwei oder drei Präsenztage, der Rest lässt sich digital sinnvoll abdecken. Das spart nicht nur Fahrzeit, sondern auch Geld und Energie. Ich kann Lernphasen besser bündeln und muss weniger zwischen Wohnort, Bibliothek und Seminarräumen hin und her wechseln. Für mich heißt das nicht, dass Präsenz unwichtig ist. Bei Gruppenarbeiten oder Diskussionen finde ich sie sogar zentral. Aber ich muss eben nicht mehr jeden Tag pendeln, nur um passiv zuzuhören. Diese Mischung ist für meine Situation deutlich effizienter. Gleichzeitig kann ich in frei gewordenen Zeitfenstern gezielter arbeiten statt nur unterwegs zu sein.

Sprecher 6: Ich wohne mitten in der Stadt und habe lange gedacht, Bus und Bahn wären automatisch die beste Lösung. In der Praxis bin ich aber oft mit dem Fahrrad schneller. Besonders morgens, wenn viele gleichzeitig unterwegs sind, verliere ich mit Umsteigen und Warten viel Zeit. Mit dem Rad fahre ich direkter, bin flexibler und komme meistens pünktlicher an. Außerdem kann ich Einkäufe oder kurze Erledigungen gleich auf dem Rückweg mitmachen, ohne auf Fahrpläne achten zu müssen. Natürlich klappt das nicht bei jedem Wetter perfekt, aber insgesamt ist es für mich die verlässlichere Option. Für meinen Studienalltag zählt am Ende nicht die theoretische Verbindung auf dem Papier, sondern was im Tagesrhythmus wirklich funktioniert. Außerdem habe ich das Gefühl, dass ich dadurch den Kopf vor Seminaren besser frei bekomme.

Sprecher 7: Ich pendle jeden Tag fast eine Stunde pro Strecke, und fachlich ist das machbar. Das eigentliche Problem ist etwas anderes: Man verpasst ständig informelle Dinge. Wenn nach dem Seminar noch eine kurze Besprechung stattfindet, wenn sich spontan Lerngruppen bilden oder wenn es am Abend einen Vortrag gibt, bin ich oft schon auf dem Sprung zum Bahnhof. Genau diese Situationen sind aber wichtig, weil dort Kontakte entstehen und Informationen weitergegeben werden, die nicht im Lernmanagementsystem stehen. Ich merke immer wieder, dass lange Wege nicht nur Zeit kosten, sondern auch soziale Teilhabe am Campus einschränken. Auf dem Stundenplan sieht alles gleich aus, im Studienalltag aber haben Pendler deutlich weniger spontane Möglichkeiten. Das wirkt sich langfristig auch auf Netzwerke und Praktikumschancen aus.

Sprecher 8: Ich finde das Semesterticket grundsätzlich sehr hilfreich, aber in meinem Fall reicht es nicht aus. Ich studiere Soziale Arbeit und mache regelmäßig Praktikumstage bei Trägern außerhalb des üblichen Verkehrsverbunds. Dafür brauche ich zusätzliche Tickets oder Regionaltarife, die schnell teuer werden. Ähnlich ist es bei Exkursionen und Projektkooperationen in Nachbarregionen. Genau dort sammeln wir aber wichtige Praxiserfahrung. Deshalb wünsche ich mir flexiblere Modelle, etwa modulare Erweiterungen oder kontingentierte Zusatzzonen für Pflichtveranstaltungen. Im Moment passt das Ticket vor allem zum klassischen Weg zwischen Wohnung und Campus. Für moderne, praxisnahe Studiengänge mit wechselnden Lernorten ist das aus meiner Sicht zu eng gedacht und finanziell auf Dauer belastend. Gerade Pflichtpraktika sollten mobilitätspolitisch viel stärker berücksichtigt werden.


Hörverstehen Teil 2

Sie hören eine Radiosendung. Sie hören die Sendung nur einmal. Entscheiden Sie beim Hören, welche Aussage A, B oder C am besten passt. Markieren Sie Ihre Lösungen für die Aufgaben 55 bis 64 auf dem Antwortbogen. Lesen Sie jetzt die Aufgaben 55 bis 64. Sie haben dazu drei Minuten Zeit.

Moderator: Herzlich willkommen zu Campus Perspektiven. Heute sprechen wir über ein Thema, das fast alle Studierenden betrifft: Wie lässt sich ein Studium finanzieren, ohne dass Lernen und Gesundheit auf der Strecke bleiben? Unser Gast ist Prof. Dr. Claudia Reuter, Bildungsökonomin und Leiterin einer Langzeitstudie zur studentischen Lebenslage. Guten Abend, Frau Professor Reuter.

Prof. Reuter: Guten Abend, danke für die Einladung.

Moderator: In Debatten hört man oft, Studierende müssten einfach sparsamer sein. Sie sagen aber, das Grundproblem liege tiefer. Wo genau?

Prof. Reuter: Wir sehen in den Daten sehr klar, dass das Risiko weniger von einzelnen großen Anschaffungen ausgeht, sondern von der Kombination aus starren monatlichen Fixkosten und schwankenden Einnahmen. Miete, Krankenkasse und Semesterbeiträge bleiben gleich, aber Nebenjobstunden oder familiäre Unterstützung variieren oft. Genau diese Asymmetrie erzeugt dauerhaften Druck.

Moderator: Das heißt, selbst diszipliniertes Verhalten reicht allein nicht aus?

Prof. Reuter: Genau. Viele Studierende wirtschaften sehr verantwortungsvoll und geraten trotzdem an Grenzen, weil die strukturellen Rahmenbedingungen eng sind. Wenn ein Monat unerwartet schwächer ausfällt, kann man das kaum ausgleichen, weil ein großer Teil der Kosten nicht verhandelbar ist.

Moderator: Viele kompensieren das über Nebenjobs. Ab welchem Umfang wird das aus Ihrer Sicht kritisch?

Prof. Reuter: Es gibt natürlich Unterschiede zwischen Fächern und Personen. Problematisch wird es in der Regel, wenn Studierende über längere Zeit mehr als 20 Stunden pro Woche arbeiten. Dann verschiebt sich der Schwerpunkt vom Studium zur Erwerbsarbeit. Kurzfristig kann das funktionieren, langfristig steigen aber das Erschöpfungsrisiko und die Wahrscheinlichkeit von Verzögerungen deutlich.

Moderator: Manche argumentieren, ein hoher Arbeitsumfang trainiere doch Selbstorganisation.

Prof. Reuter: Ein gewisser Umfang kann tatsächlich Kompetenzen fördern. Aber ab einer bestimmten Schwelle kippt der Effekt. Dann geht es nicht mehr um sinnvolle Struktur, sondern um permanentes Reagieren auf Zeitdruck. Genau das senkt häufig die Qualität des Lernens.

Moderator: Spielt die Verteilung der Arbeitszeiten eine Rolle oder nur die Stundenzahl?

Prof. Reuter: Die Verteilung ist entscheidend. Besonders belastend sind wechselnde Schichtsysteme, also heute früh, morgen spät, übermorgen wieder anders. Solche Rhythmen stören Schlaf, Lernplanung und soziale Stabilität. Wer dagegen in gleichmäßigen Zeitfenstern arbeitet, kann die Studienzeiten besser schützen und insgesamt verlässlicher planen.

Moderator: Kann man diesen Effekt auch in Prüfungsergebnissen sehen?

Prof. Reuter: Ja, wir sehen deutliche Zusammenhänge. Studierende mit stark wechselnden Arbeitszeiten haben häufiger kurzfristige Ausfälle, verschieben Leistungen öfter und berichten über höhere mentale Belastung. Das heißt nicht, dass sie weniger motiviert wären, sondern dass die Rahmenbedingungen ihre Lernkontinuität untergraben.

Moderator: Welche Budgetstrategie empfehlen Sie konkret, damit Ausgaben nicht aus dem Ruder laufen?

Prof. Reuter: Ich empfehle ein Drei-Bereiche-Modell. Erstens ein Fixkostenbudget für Miete, Versicherung, Mobilität. Zweitens ein Alltagsbudget für Lebensmittel, Lernmaterial und variable Ausgaben. Drittens eine kleine Rücklage für ungeplante Ereignisse. Diese Trennung schafft Transparenz und verhindert, dass kurzfristige Ausgaben unbemerkt in den Bereich rutschen, der eigentlich die Grundsicherung abdeckt.

Moderator: Viele sagen, Rücklagen seien bei kleinen Einkommen unrealistisch.

Prof. Reuter: Sie müssen nicht groß sein. Schon ein kleiner, kontinuierlich aufgebauter Puffer kann verhindern, dass bei jeder unerwarteten Rechnung sofort Schulden entstehen. Es geht weniger um hohe Beträge als um die Stabilisierung kritischer Monate.

Moderator: Ein großer Posten ist das Wohnen. Wo sehen Sie realistische Einsparpotenziale?

Prof. Reuter: Am wirksamsten ist ein früher, gemeinsamer Suchprozess, vor allem bei WGs. Wer Monate vor Semesterstart sucht, hat mehr Auswahl und bessere Verhandlungsmöglichkeiten. Genauso wichtig sind schriftliche Absprachen zu Nebenkosten, Laufzeiten und gemeinschaftlichen Pflichten. Ohne klare Regeln entstehen Konflikte, die später oft teurer werden als eine etwas höhere Miete am Anfang.

Moderator: Also eher Prävention statt spätere Reparatur?

Prof. Reuter: Genau. In der Praxis sehen wir, dass schlecht geklärte Wohnverhältnisse viel Energie binden und zusätzliche Kosten erzeugen. Gute Verträge und transparente Regeln sind nicht bürokratischer Luxus, sondern finanzielle Vorsorge.

Moderator: Stipendien könnten entlasten, werden aber relativ wenig genutzt. Warum?

Prof. Reuter: Viele bewerben sich gar nicht, weil sie von falschen Annahmen ausgehen. Der häufigste Mythos lautet: Stipendien seien nur für durchgehend perfekte Noten und lineare Lebensläufe. Das stimmt so nicht. Viele Programme berücksichtigen Engagement, biografische Hürden oder fachliche Profile. Wer sich informiert, stellt oft fest, dass die Hürden niedriger sind als gedacht.

Moderator: Wie könnte man diese Informationslücke besser schließen?

Prof. Reuter: Durch niedrigschwellige Erstberatung schon im ersten Semester, idealerweise direkt in Einführungswochen. Wenn Studierende früh wissen, welche Optionen es gibt, können sie Fristen und Unterlagen realistisch einplanen.

Moderator: Wie bewerten Sie das Semesterticket in diesem Zusammenhang?

Prof. Reuter: Es ist für viele Studierende zentral und sozialpolitisch sehr wichtig. Gleichzeitig deckt es die Realität praxisorientierter Studiengänge nicht immer vollständig ab. Sobald Praktika, Kooperationsprojekte oder Laborphasen außerhalb des Verbundgebiets liegen, entstehen zusätzliche Kosten. Genau diese Wege sind aber curricular notwendig, nicht freiwillig.

Moderator: Das heißt, wir brauchen stärker differenzierte Modelle?

Prof. Reuter: Ja, zum Beispiel flexible Ergänzungszonen oder semesterweise Wahlmodule. Mobilitätspolitik muss sich an tatsächlichen Studienverläufen orientieren, nicht nur am klassischen Pendelweg zwischen Wohnung und Hörsaal.

Moderator: Was raten Sie Studierenden, wenn es finanziell bereits eng geworden ist?

Prof. Reuter: Früh handeln. Viele warten zu lange, aus Scham oder weil sie hoffen, dass es sich von allein löst. Sinnvoll ist, Beratungsstellen zu kontaktieren, bevor Mietrückstände oder Mahnkosten entstehen. Dann gibt es noch Handlungsspielräume: Notfonds, Zahlungspläne, Übergangsfinanzierung oder Anpassungen im Arbeitsumfang.

Moderator: Welche Beratungsstellen sind da typisch?

Prof. Reuter: An vielen Hochschulen gibt es Sozialberatungen der Studierendenwerke, psychologische Beratung, AStA-Rechtsberatung und in manchen Fällen Härtefallfonds auf Fakultätsebene. Wichtig ist, den ersten Kontakt früh zu setzen, damit Optionen offen bleiben.

Moderator: Es gibt inzwischen viele Apps fürs persönliche Finanzmanagement. Hilft das?

Prof. Reuter: Ja, aber nur unter bestimmten Bedingungen. Eine App wirkt nur dann, wenn sie regelmäßig genutzt wird und mit realistischen Ausgabenlimits verbunden ist. Wer nur einmal im Monat hineinschaut, reagiert zu spät. Der Nutzen entsteht durch kontinuierliche Selbstbeobachtung und durch konkrete Entscheidungspunkte im Alltag.

Moderator: Also kein technisches Allheilmittel?

Prof. Reuter: Genau. Die App ersetzt keine Entscheidungen. Sie kann nur sichtbar machen, wo Gewohnheiten aus dem Ruder laufen. Entscheidend bleibt, dass man daraus tatsächlich Handlungsfolgen ableitet.

Moderator: Wenn Sie einen strukturellen Wunsch an Hochschulen frei hätten, welcher wäre das?

Prof. Reuter: Ich würde verbindliche Finanzkompetenz-Module im ersten Studienjahr einführen. Nicht als Zusatzbelastung, sondern als Basiskompetenz wie wissenschaftliches Schreiben. Themen wären Vertragsverständnis, Budgetplanung, Förderwege und Krisenprävention. Das würde nicht alle Probleme lösen, aber viele Eskalationen vermeiden.

Moderator: Kritiker sagen, das sei eigentlich Aufgabe der Schulen.

Prof. Reuter: Idealerweise ja, praktisch kommt diese Kompetenzvermittlung dort aber sehr unterschiedlich an. Hochschulen dürfen deshalb nicht davon ausgehen, dass alle denselben Startpunkt haben. Wenn wir Chancengleichheit ernst nehmen, müssen wir auch ökonomische Handlungskompetenz gezielt fördern.

Moderator: Gibt es Unterschiede zwischen Studierendengruppen, etwa zwischen Erstakademikerinnen und Erstakademikern und Studierenden mit familiärer Hochschulerfahrung?

Prof. Reuter: Ja, diese Unterschiede sind deutlich. Wer im direkten Umfeld keine akademische Erfahrung hat, kennt formale Abläufe und Förderlogiken oft weniger gut und stellt Unterstützungsanträge später. Deshalb brauchen wir an Hochschulen transparente Informationswege in einfacher Sprache, wiederholte Hinweise über das Semester hinweg und klare Ansprechpersonen. Nur dann wird aus theoretischer Fördermöglichkeit auch tatsächlich genutzte Unterstützung.

Moderator: Ein letztes kurzes Fazit: Was ist Ihr wichtigster Rat an Studierende?

Prof. Reuter: Nicht isoliert kämpfen. Finanzielle Belastung ist kein individuelles Versagen, sondern oft eine strukturelle Herausforderung. Wer früh plant, transparent rechnet und Unterstützung nutzt, verbessert die eigene Stabilität enorm.

Moderator: Frau Professor Reuter, vielen Dank für das Gespräch.

Prof. Reuter: Ich danke Ihnen.


Hörverstehen Teil 3

Sie hören einen Vortrag. Sie hören den Vortrag nur einmal. Sie haben Handzettel mit den Folien der Präsentation erhalten. Schreiben Sie die fehlenden Informationen stichwortartig in die freien Zeilen 65 bis 74 in der rechten Spalte. Die Lösung 0 ist ein Beispiel. Lesen Sie jetzt die Stichworte. Sie haben dazu eine Minute Zeit.

Dozent: Meine Damen und Herren, herzlich willkommen zum hochschuldidaktischen Forum „Studienerfolg und Übergänge ins Studium“. Heute dürfen wir Prof. Dr. Nora Feldmann begrüßen. Sie leitet an der Universität Bremen mehrere Projekte zur Studienanfangsphase und berät Hochschulen bei Mentoringkonzepten. Frau Professor Feldmann, wir freuen uns auf Ihre Impulse.

Prof. Feldmann: Vielen Dank für die freundliche Einführung. Ich möchte heute darüber sprechen, welche Rolle Mentoringprogramme im ersten Studienjahr spielen können und welche Bedingungen erfüllt sein müssen, damit sie tatsächlich wirken. Der Fokus liegt auf unserer dreijährigen Programmbilanz und auf der Frage, wie wir aus Einzelprojekten eine verlässliche Struktur machen.

Prof. Feldmann: Zunächst zu den Ergebnissen: In den Fakultäten, die unser Mentoring vollständig umgesetzt haben, ist die Abbruchquote im ersten Studienjahr um 18 Prozent gesunken. Das ist kein kleiner Effekt. Besonders wichtig ist dabei, dass dieser Rückgang nicht nur in einzelnen Fächern auftrat, sondern in sehr unterschiedlichen Studiengängen. Wenn wir Studierende zu ihren größten Startproblemen befragen, nennen sie am häufigsten fehlende Orientierung. Vielen ist am Anfang nicht klar, welche Entscheidung wann wichtig ist und wo sie bei Unsicherheiten verlässliche Ansprechpartner finden.

Prof. Feldmann: Methodisch stützen wir uns auf eine Kombination aus Verlaufsdaten, Gruppendiskussionen und kurzen Wochenprotokollen der Mentorinnen und Mentoren. So können wir nicht nur sehen, ob etwas wirkt, sondern auch warum es wirkt. Gerade in der Studieneingangsphase entstehen viele Probleme nicht auf einen Schlag, sondern in kleinen Ketten. Wenn Mentoring früh eingreift, lassen sich diese Ketten häufig unterbrechen, bevor sie in Abbruchsentscheidungen münden.

Prof. Feldmann: Schauen wir genauer auf die Belastungsfaktoren. Zwei Punkte werden in Interviews immer wieder genannt. Erstens erleben viele Erstsemester die Hochschule als System anonymer Strukturen: große Veranstaltungen, wechselnde Lehrende, unklare Zuständigkeiten. Zweitens werden Prüfungsordnungen als unübersichtlich wahrgenommen. Selbst motivierte Studierende verlieren dadurch Zeit und Sicherheit, weil sie formale Anforderungen zu spät verstehen. Diese Kombination ist kritisch: Wer sich organisatorisch unsicher fühlt, interpretiert fachliche Schwierigkeiten schneller als persönliches Scheitern.

Prof. Feldmann: Unser Programm setzt deshalb auf mehrere niedrigschwellige Formate. Ein zentraler Baustein sind Peer-Sprechstunden, also feste Zeiten, in denen fortgeschrittene Studierende konkrete Fragen zu Planung, Prüfungen und Arbeitsstrategien beantworten. Ein zweiter Baustein sind Fachlernwerkstätten. Dort werden typische Einstiegsschwierigkeiten in kleinen Gruppen bearbeitet, zum Beispiel wissenschaftliche Textarbeit, Klausurvorbereitung oder mündliche Beteiligung. Entscheidend ist, dass diese Angebote nicht als Defizitmaßnahmen kommuniziert werden, sondern als regulärer Teil akademischer Lernkultur.

Prof. Feldmann: Zusätzlich arbeiten wir mit Mentor-Tandems aus unterschiedlichen Fachsemestern. Der Vorteil ist, dass organisatorische Fragen und Lernstrategien parallel adressiert werden können. In Rückmeldungen sagen Studierende häufig, dass gerade diese Kombination aus Alltagswissen und fachnaher Erfahrung besonders hilfreich ist, weil sie nicht nur kurzfristige Antworten liefert, sondern auch realistische Perspektiven für die nächsten Semester eröffnet.

Prof. Feldmann: Aus didaktischer Sicht steht eine Kompetenz besonders im Mittelpunkt: Selbstwirksamkeit. Studierende sollen erleben, dass ihr eigenes Handeln einen Unterschied macht. Diese Erfahrung entsteht nicht durch motivierende Slogans, sondern durch strukturierte Lerngelegenheiten, bei denen sie Fortschritte sichtbar nachvollziehen können. In der Vergangenheit haben wir Programme zu stark über Teilnahmequoten gesteuert. Teilnahmelisten sahen gut aus, sagten aber wenig über Lernqualität. Heute betrachten wir gezielt den Lernfortschritt: Welche Strategien wurden aufgebaut? Welche Hürden konnten selbstständig bewältigt werden? Welche Entscheidungen wurden reflektiert getroffen?

Prof. Feldmann: Dabei achten wir besonders auf Übergangssituationen, also die Wochen vor den ersten Prüfungen, den Wechsel zwischen Semestern und die Planung von Praktikumsphasen. Genau in diesen Phasen zeigt sich, ob Mentoring nur kurzfristig entlastet oder tatsächlich langfristige Handlungsfähigkeit stärkt. Unsere Daten deuten klar auf Letzteres hin, wenn die Begleitung über das gesamte erste Studienjahr hinweg stabil bleibt.

Prof. Feldmann: Damit Mentoring nicht vom Zufall einzelner engagierter Personen abhängt, brauchen wir verbindliche Standards. Der erste Standard ist eine verbindliche Schulung aller Mentorinnen und Mentoren, bevor sie mit Gruppen arbeiten. Dort geht es um Gesprächsführung, Rollenklärung, Grenzsetzung und Verweiswege bei psychischer Belastung. Der zweite Standard sind feste Supervisionstermine während des Semesters. Mentoring ist anspruchsvoll; ohne regelmäßige Reflexion steigt das Risiko, dass schwierige Situationen individualisiert und falsch eingeschätzt werden.

Prof. Feldmann: Ein dritter Qualitätsfaktor ist die Geschwindigkeit von Rückmeldungen. Wenn Studierende Anliegen einreichen, etwa zu Prüfungsplanung oder Arbeitsproblemen, erhalten sie bei uns innerhalb von 48 Stunden eine erste qualifizierte Antwort. Das verhindert, dass kleine Unsicherheiten zu größeren Krisen anwachsen. Natürlich kann nicht jedes Problem sofort vollständig gelöst werden. Aber der frühe Kontakt signalisiert Verlässlichkeit und erleichtert die Weitervermittlung an passende Stellen.

Prof. Feldmann: Parallel dazu evaluieren wir die Zusammenarbeit mit Lehrenden. Mentoring wirkt am besten, wenn Lehrveranstaltungen und Unterstützungsstrukturen nicht nebeneinanderlaufen, sondern Informationen austauschen. Wir haben deshalb kurze Abstimmungsformate eingeführt, damit typische Hürden schneller erkannt und curricular aufgegriffen werden können. So entsteht Schritt für Schritt eine lernförderliche Gesamtarchitektur statt vieler isolierter Einzelangebote.

Prof. Feldmann: Ein weiterer Punkt ist die digitale Begleitung. Wir arbeiten mit einem datensparsamen Dashboard, in dem Mentorinnen und Mentoren anonymisiert dokumentieren, welche Themen besonders häufig auftreten. Dadurch sehen wir früh, ob sich Probleme häufen, etwa bei Prüfungsanmeldungen oder Zeitplanung. Wichtig ist dabei, dass dieses Monitoring nicht zur Kontrolle einzelner Studierender dient, sondern zur Verbesserung von Strukturen. Die Daten helfen uns, Angebote nachzuschärfen, ohne zusätzliche bürokratische Hürden aufzubauen.

Prof. Feldmann: Wir haben außerdem gelernt, dass Diversität im Mentoringteam einen großen Unterschied macht. Wenn Mentorinnen und Mentoren unterschiedliche Bildungsbiografien, Spracherfahrungen und Fachperspektiven einbringen, fühlen sich mehr Erstsemester repräsentiert und trauen sich früher, Fragen zu stellen. Deshalb achten wir inzwischen gezielt auf heterogene Teams und reflektieren in Supervisionen auch mögliche implizite Erwartungen. Diese professionelle Haltung erhöht die Qualität der Beziehungen und stabilisiert die Wirksamkeit des Programms langfristig.

Prof. Feldmann: Trotz der positiven Effekte bleibt eine zentrale Herausforderung: die kontinuierliche Finanzierung. Viele Programme laufen über befristete Projektmittel. Dadurch entstehen Lücken, gerade wenn Personal wechselt oder Förderzeiträume enden. Für Studierende wirkt das widersprüchlich: Einerseits empfehlen wir stabile Routinen, andererseits sind die Unterstützungsangebote selbst instabil. Wenn wir Mentoring ernst nehmen, muss die Finanzierung von Beginn an als Daueraufgabe eingeplant werden, nicht als zeitlich begrenztes Innovationsprojekt.

Prof. Feldmann: Unser Ziel bis 2028 ist deshalb der Aufbau eines hochschulweiten Mentoringzentrums. Diese Einrichtung soll Angebote bündeln, Mentorinnen und Mentoren qualifizieren, Daten zur Qualitätssicherung auswerten und fakultätsübergreifende Standards koordinieren. Wichtig ist, dass ein solches Zentrum nicht zentralistisch entscheidet, sondern lokale Fachkulturen einbindet. Mentoring in der Chemie sieht anders aus als Mentoring in den Kulturwissenschaften, aber die Qualitätsprinzipien können gemeinsam entwickelt werden.

Prof. Feldmann: Lassen Sie mich zum Schluss betonen: Mentoring ersetzt weder gute Lehre noch soziale Beratung. Es verbindet jedoch beides auf eine Weise, die gerade im Übergang von Schule zu Hochschule entscheidend sein kann. Wenn Studierende früh Orientierung, Rückmeldung und realistische Handlungsoptionen bekommen, steigen nicht nur Erfolgsquoten, sondern auch die Qualität des Lernens. Vielen Dank für Ihre Aufmerksamkeit.

Dozent: Vielen Dank, Frau Professor Feldmann, für diesen differenzierten und sehr praxisnahen Vortrag. Wir beginnen jetzt mit den Fragen aus dem Plenum.

Ende des Subtests Hörverstehen.
`,

  diskussionZitate: {
    1: { text:'Es hört doch jeder nur, was er versteht.', autor:'Johann Wolfgang von Goethe (1749–1832), Dichter',
         aspekte:['Warum verstehen Menschen dieselbe Information oft unterschiedlich?','Welche Rolle spielen Vorwissen und Perspektive in Diskussionen?','Wie kann man Missverständnisse im Studium vermeiden?','Welche Verantwortung tragen Sender und Empfänger in der Kommunikation?'] },
    2: { text:'Alles Leben ist Problemlösen.', autor:'Karl Popper (1902–1994), Philosoph',
         aspekte:['Ist Problemlösekompetenz wichtiger als reines Fachwissen?','Welche Probleme lassen sich im Studium besonders gut trainieren?','Wie geht man mit Unsicherheit und Fehlern produktiv um?','Wo stößt eine rein lösungsorientierte Haltung an Grenzen?'] },
    3: { text:'Wer aufhört, besser zu werden, hat aufgehört, gut zu sein.', autor:'Marie von Ebner-Eschenbach (1830–1916), Schriftstellerin',
         aspekte:['Ist kontinuierliche Verbesserung in allen Berufen notwendig?','Wie realistisch ist ständiger Leistungsanspruch im Studienalltag?','Welche Rolle spielen Pausen, Grenzen und Selbstfürsorge?','Wie unterscheidet man Weiterentwicklung von Perfektionismus?'] },
    4: { text:'Habe Mut, dich deines eigenen Verstandes zu bedienen.', autor:'Immanuel Kant (1724–1804), Philosoph',
         aspekte:['Was bedeutet eigenständiges Denken im Zeitalter von KI und Social Media?','Wie kann Bildung kritisches Urteilen konkret fördern?','Wo liegt die Grenze zwischen Orientierung an Experten und blindem Folgen?','Welche Verantwortung haben Hochschulen für intellektuelle Selbstständigkeit?'] },
  }
};
