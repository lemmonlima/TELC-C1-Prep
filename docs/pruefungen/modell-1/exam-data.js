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

  hvTranskript: `Hörverstehen Teil 1

Sie hören die Meinungen von acht Personen. Sie hören die Meinungen nur einmal. Entscheiden Sie beim Hören, welche Aussage A bis J zu welcher Person passt. Zwei Aussagen passen nicht. Markieren Sie Ihre Lösungen für die Aufgaben 47 bis 54 auf dem Antwortbogen. Lesen Sie jetzt die Aussagen A bis J. Sie haben dazu eine Minute Zeit.

Sprecher 1: Ich war zu Beginn meines Studiums ziemlich naiv, was die Wohnungs- oder Zimmersuche betrifft. Erst kurz vor Semesterbeginn habe ich nach einer Wohnung gesucht. Ich wollte unbedingt alleine wohnen. Allerdings hatte ich mir völlig falsche Vorstellungen von der Höhe der Mieten in Köln gemacht und musste schnell feststellen, dass ich mir das nicht leisten kann. Als ich dann zur Zimmervermittlung der Uni gegangen bin, hat mir die Mitarbeiterin auch keine Hoffnung gemacht, dass ich bald ein Zimmer bekäme. Also bin ich eher notgedrungen in eine Wohngemeinschaft gezogen. Damals war ich alles andere als überzeugt von WGs, aber heute muss ich sagen, dass ich mir gar nicht mehr vorstellen kann, alleine zu wohnen. Es macht so viel Spaß und es ist natürlich auch viel günstiger als alleine zu wohnen. So gesehen hatte ich damals doch Glück, denn freiwillig hätte ich das wahrscheinlich nicht ausprobiert.

Sprecher 2: Seit drei Semestern bin ich jetzt an der Uni und ehrlich gesagt kenne ich kaum Kommilitonen, die in einer WG wohnen oder ins Wohnheim gezogen sind. Das ist bei mir selbst ja auch nicht anders. Die Zimmer oder ganz normale kleine Wohnungen sind ja einfach so günstig, dass ich das fast jeder leisten kann. Für einige Kommilitonen ist das aber nicht einmal der Hauptgrund. Ich weiß einfach von vielen, dass sie lieber alleine wohnen als zusammen mit anderen. Das hat natürlich auch Nachteile, denn auf Dauer fehlt einem doch die Gesellschaft, wenn man nur für sich ist. Für mich war aber entscheidend, dass ich mir eine Wohnung wirklich selbst aussuchen kann. Die Lage, die Größe... ich kann auch schauen, ob ich mit dem Vermieter klarkomme. Das ist doch nicht unwichtig.

Sprecher 3: Mein Studium ist zwar schon einige Jahre her, aber ich erinnere mich noch sehr gut daran, wie ich mein erstes Zimmer im Wohnheim bezogen habe. Ich wohnte in einem Vierbettzimmer, aber während meines ersten Semesters blieben zunächst zwei Betten frei. Trotzdem habe ich mich auch da schon nicht richtig wohlgefühlt, auch wenn ich mit meiner Zimmergenossin kaum Probleme hatte. Irgendwie hat mir einfach die Privatsphäre gefehlt. Das wurde nicht besser, als es dann ab dem zweiten Semester richtig voll wurde. Es war okay und ich habe auch die eine oder andere gute Erfahrung gemacht und klar, dadurch auch leichter Leute kennengelernt. Aber wenn ich die Möglichkeit gehabt hätte, wäre mir ein Zimmer nur für mich lieber gewesen.

Sprecher 4: Unsere Dienstleistungen der Zimmer- und Wohnungsvermittlung können alle immatrikulierten Studierenden und Mitarbeiter der Universität Zürich gratis nutzen. Wir vermitteln Zimmer, Wohnungen und Häuser in Zürich und Umgebung, möbliert und unmöbliert, befristet und unbefristet. Auf unserer Website gibt es weitere Informationen. Außerdem kann man dort das Angebot an Zimmern und Wohnungen einsehen. Die Details der Inserate sind aber nur für registrierte Benutzer zugänglich, die sich als Mitglied der Hochschule verifiziert haben. In den letzten Jahren haben wir festgestellt, dass die Anzahl der Studierenden, die ein Zimmer für sich alleine suchen, abgenommen hat. Es gibt wieder mehr Studierende, die als studentische Wohngemeinschaft eine Wohnung oder ein Haus anmieten wollen. Also für mich persönlich wäre das alles nichts gewesen.

Sprecher 5: Ich studiere Geschichte und Englisch auf Lehramt. Im letzten Jahr habe ich ein Auslandssemester an einer amerikanischen Universität gemacht und dort habe ich dann auch, wie die anderen Studenten, direkt auf dem Campus gelebt. Das war eine ganz interessante Erfahrung, weil ich hier in Deutschland etwas von der Uni entfernt wohne, und zwar bei meinen Eltern. Eine eigene Wohnung oder ein Zimmer könnte ich mir auf Dauer einfach nicht leisten. Aber seit ich in Amerika war, fehlt es mir doch, dass ich nicht mit anderen Studierenden zusammenwohnen kann. Am besten noch möglichst nah an der Uni. Das ist einfach ein riesen Unterschied. Hier fühle ich mich gar nicht so richtig als Studentin, weil ich ja doch wieder nach Hause gehe und da sind dann keine Studis, sondern meine Eltern. Na ja, mal sehen. Sobald es geht, würde ich aber schon gerne mit Kommilitonen zusammenziehen.

Sprecher 6: Als ich einen Studienplatz hatte, habe ich als Erstes nach einer Wohnung für mich gesucht. Ich wollte auf keinen Fall mit anderen die Bude teilen. Das gibt doch nur Stress. Natürlich sind es nur anderthalb Zimmer und ich muss nebenbei arbeiten gehen, damit ich die Miete zahlen kann, aber das ist es mir ehrlich gesagt wert. Mein älterer Bruder hat auch studiert und ich war ein paar Mal bei ihm in der WG zu Besuch. Das ging gar nicht. Die haben zwar Pläne gemacht fürs Einkaufen und Kochen und Aufräumen, aber daran gehalten hat sich praktisch keiner. Und dann gab's immer Zoff. Sogar meinem Bruder war das irgendwann zu viel und er ist dort abgehauen. Und ich will das gar nicht erst ausprobieren.

Sprecher 7: Ich habe ein kleines Zimmer, das ich untervermiete, und zwar nur an Studierende. Das ist mir sehr wichtig, denn sonst habe ich kaum Möglichkeiten, Kontakte zu der jüngeren Generation zu knüpfen. Wenn man in meinem Alter nicht selbst dafür sorgt, dass man geistig fit bleibt, rostet man doch nur ein. Umgekehrt bin ich überzeugt, dass auch die Jüngeren von mir lernen können. Ohnehin bin ich keine Freundin dieser vielen Single-Wohnungen. Die meisten Menschen vereinsamen doch früher oder später. Mir bereitet es Freude, wenn ich einen kleinen Beitrag dazu leisten kann, dass sich Menschen begegnen und austauschen können.

Sprecher 8: Als ich studiert habe, gab es ständig irgendeine Demo gegen Atomkraft, für mehr Bildung und natürlich gab es auch Studenten, die gegen die teuren Wohnungen oder Zimmer demonstriert haben. Damals habe ich mir mit einem Freund ein winziges Zimmer bei einer älteren Dame geteilt. Das war ziemlich anstrengend. Dauernd hat sie sich beschwert, weil wir uns nicht an die Hausordnung gehalten haben. Trotzdem sind wir dort geblieben. Es war einfach günstig. Es gibt doch immer ein Pro und ein Kontra. Na ja, inzwischen hat meine Tochter ihr Studium abgeschlossen. Aber auszuziehen von zu Hause, das kam für sie erst infrage, als sie ihre erste Stelle angetreten hatte.


Hörverstehen Teil 2

Sie hören eine Radiosendung. Sie hören die Sendung nur einmal. Entscheiden Sie beim Hören, welche Aussage A, B oder C am besten passt. Markieren Sie Ihre Lösungen für die Aufgaben 55 bis 64 auf dem Antwortbogen. Lesen Sie jetzt die Aufgaben 55 bis 64. Sie haben dazu drei Minuten Zeit.

Moderator: Liebe Hörerinnen und Hörer. Die Acht ist furchterregend schön. Mit diesem Motto wird heute feierlich in Berlin das Jahr der Mathematik eröffnet. Vielen bereitet Mathematik Alpträume. Albrecht Beutelspacher aber, Professor der Mathematik in Gießen, sagt: Mathe macht glücklich. Wir haben ihn eingeladen. Willkommen, Herr Beutelspacher.

Beutelspacher: Ja, guten Tag.

Moderator: Herr Beutelspacher, „Mathe macht glücklich" ist ein Satz, der von Ihnen stammt und den Sie sogar auf T-Shirts drucken lassen. Welchen Glücksmoment hat Ihnen die Mathematik zuletzt beschert?

Beutelspacher: Solche Glücksmomente habe ich täglich und ich beobachte sie auch bei vielen anderen Menschen. Wenn man in der Mathematik etwas herauskriegen möchte – von der Knobelaufgabe über ein Puzzle bis zu richtigen Forschungsthemen –, dann weiß man zunächst gar nicht, was man zu tun hat. Oft dauert es lange, bis sich Erfolg zeigt. Und dann plötzlich, ganz unerwartet, kommt der Moment, in dem man sieht, dass es letztlich ganz einfach ist. Und diese Momente, wenn es Klick macht, das sind Glücksmomente. Und wenn die sich wiederholen, dann stellt sich auch insgesamt ein Glücksgefühl ein. Glück deshalb, weil wir Menschen so gemacht sind, dass wir zufrieden oder glücklich sind, wenn wir ein bisschen was von dem verstehen, wie die Welt funktioniert.

Moderator: Mathe ist schön. Auch dieser Satz stammt von Ihnen. Was genau ist schön, beispielsweise an einem Fünfeck?

Beutelspacher: Gerade Fünfecke sind Objekte, die gar nicht so einfach sind. Jeder Mensch kann wohl ein Dreieck oder ein Quadrat freihändig ganz anständig zeichnen. Aber bei einem Fünfeck werden die allermeisten scheitern. Ich habe bestimmt schon Tausende Fünfecke in meinem Leben probiert, aber meistens muss ich nochmals korrigieren, wenn ich sie an die Tafel oder auf ein Blatt Papier zeichne. Das ist also gar nicht so einfach. Übrigens ist die Fünf die Zahl der Natur. Viele Blüten haben Fünfersymmetrie.

Moderator: Ihre Lieblingszahl, so ist es in Interviews zu lesen, ist die Acht. Was hat die Acht, was die Drei nicht hat?

Beutelspacher: Alle Zahlen, vor allem die kleinen, haben einen speziellen Charakter. Und so hat natürlich auch die Drei was. Die Drei und die Acht sind aber grundverschieden. Die Acht ist 2 mal 2 mal 2. Die Zwei ist die Zahl der Symmetrie. Vier ist die doppelte Symmetrie. Und Acht ist dann nochmals eins drauf: die Symmetrie der Symmetrie der Symmetrie. Das ist eine Zahl, die mit ihrer Schönheit fast ein bisschen angibt, ein wenig protzt. So wie die Königin der Nacht in der Zauberflöte von Mozart. Das ist unwiderstehliche Schönheit, die schon fast ein wenig furchterregend ist.

Moderator: Mathe ist bis zu einem gewissen Punkt, über den die Meisten nicht hinauskommen, absolut, unumstößlich. Eins und eins ist zwei, nie drei. Ist das nicht manchmal frustrierend?

Beutelspacher: Ja, Mathematik ist manchmal unbarmherzig. Das merkt jeder schon in der Schule. Wenn auch nur der kleinste Fehler in der Rechnung ist, ist das Ergebnis falsch. Genauso in der Forschung. Wenn der Beweis nicht lückenlos ist, ist alles nichts. Manchmal allerdings versuchen Menschen mit ihrem Wissensvorsprung Macht auszuüben. In der Schule zum Beispiel, wo traditionell eine Aufgabe nur dann richtig ist, wenn der Lehrer sagt, sie ist richtig. Gerade in der Mathematik kann ich aber als Schülerin oder Schüler selber erkennen, ob ich richtig gerechnet habe, im Gegensatz zu anderen Fächern. In Deutsch beispielsweise hat ein guter Lehrer einen großen Vorsprung. In Mathe können Schüler von Anfang an mitreden.

Moderator: Stimmt es, dass viele Mathematiker gläubig werden, wenn sie an die Grenzen ihrer Wissenschaft stoßen?

Beutelspacher: Das glaube ich nicht. Aber ein anderes Phänomen tritt auf. Wenn man diese unendlichen Welten sieht, dann ist das, als ob der Entdecker eines neuen Landes zum ersten Mal ans Ufer tritt und eine Ahnung von dem bekommt, was gerade geschieht. Wir kommen in der mathematischen Forschung in Unendlichkeiten an die Grenzen des menschlichen Denkvermögens und wir sehen dort unglaublich viel. Das ist eine Seite. Die andere ist ein Gefühl der Demut. Zumindest nehme ich das so wahr. Wir Menschen werden nie alles erforschen können. Mathematik zeigt dann: Es gibt Grenzen der Erkenntnis. Weiter kann man mit Methoden der Vernunft nicht kommen. Und dann gibt es dieses Gefühl, dass da noch etwas ganz anderes ist, etwas, was wir nie erreichen werden. Ich würde das aber noch nicht mit Gläubigkeit im kirchlichen Sinne gleichsetzen.

Moderator: Warum fehlt so vielen Menschen der Mathematikbezug im Alltag?

Beutelspacher: Weil sie ihn nie gelernt haben. Dass unsere Wahrnehmung der Umwelt ganz stark von mathematischen Mustern und damit auch durch Zahlen bestimmt ist, das ist etwas, was wir im Mathematikunterricht nur ganz selten mitkriegen. Der traditionelle Unterricht ist ausgerichtet auf das Beherrschen von innermathematischen Fragestellungen. Wir gehen in der Mathematik nie raus in die Natur oder in den Alltag und entdecken an Gebäuden mathematische Formen. Wir versuchen auch nicht, ein Problem real zu lösen. Ich frage Studierende manchmal, ob sie sich an irgendetwas Positives aus dem Mathematikunterricht erinnern. Wenn dann überhaupt was kommt, dann sowas wie: „Wir sind in der Mittelstufe mal rausgegangen und haben die Höhe der Turnhalle berechnet." Das ist das Einzige, was aus dem Mathematikunterricht übrig ist. Und das zeigt mir ganz deutlich, dass wir diese realen Erfahrungen, diese Verbindungen zum Leben stärken müssen.

Moderator: Woran liegt das denn? Fehlt den Lehrern die Leidenschaft?

Beutelspacher: Nein, das ist eigentlich nicht das Problem.

Moderator: Doch, meiner Meinung nach schon.

Beutelspacher: Lassen Sie mich das mal ausführen. Der Mangel an Leidenschaft im Mathematikunterricht liegt an unserer Tradition des Lehrens und Präsentierens von Mathematik. Und die geht auf Gauß zurück. Da ist kein Buchstabe zu viel, nichts ist überflüssig. Es stimmt alles hundertprozentig, ausgeklügelt bis ins Letzte. Das ist Akrobatik auf höchstem Niveau. Da darf kein Fehler passieren. Formal betrachtet handelt es sich dabei um ein bewundernswertes Kunstwerk. Es hat aber den Nachteil, dass ich bestenfalls darüber staune. Der Zugang dazu fehlt mir. Das müssen wir aufbrechen. Wer lernt, muss Mathematik selber entdecken. Das kann auch mit Knobelaufgaben anfangen. Man kann mal basteln oder überlegen, was hinter den Strichcodes der Lebensmittel steckt. Es gibt viele Wege in der Unterrichtsgestaltung. Und ich glaube, die Aufgabe der Didaktik ist es, Angebote zu machen, wie sich die Lernenden mit Themen identifizieren können.

Moderator: Nun haben wir gerade das Jahr der Mathematik ausgerufen. Was erhoffen Sie sich davon?

Beutelspacher: Mathematik ist erstens toll und zweitens nützlich. Das Tolle an ihr ist, dass ihre Themen an sich spannend sind, nicht nur, weil man damit Handys und CDs machen kann oder weil Dreiecke und Fünfecke, Quader und Pyramiden faszinierend sind. Ich hoffe, dass es uns gelingt, die Mathematik bei einer breiten Öffentlichkeit, insbesondere bei Kindern und Jugendlichen, so zu präsentieren, dass das klar wird. Und nützlich ist sie deshalb, weil sie aus unserem Leben nicht mehr wegzudenken ist. Jedes technische Produkt hat Mathematik in sich und würde ohne sie gar nicht funktionieren. Unser technischer Fortschritt hängt entscheidend von der Mathematik ab und deshalb müssen wir in dieses Fach auch investieren.

Moderator: Das war ein gutes Schlusswort. Dem habe ich nichts mehr hinzuzufügen. Vielen Dank, Herr Beutelspacher.


Hörverstehen Teil 3

Sie hören einen Vortrag. Sie hören den Vortrag nur einmal. Sie haben Handzettel mit den Folien der Präsentation erhalten. Schreiben Sie die fehlenden Informationen stichwortartig in die freien Zeilen 65 bis 74 in der rechten Spalte. Die Lösung 0 ist ein Beispiel. Lesen Sie jetzt die Stichworte. Sie haben dazu eine Minute Zeit.

Dozent: Meine Damen und Herren, ich darf Sie herzlich begrüßen zu unserem Fachdidaktik-Seminar „Literatur lehren". Für heute habe ich eine externe Referentin eingeladen: Frau Dr. Vera Türmer. Das Thema der heutigen Sitzung ist Literatur im Unterricht Deutsch als Fremdsprache. Frau Dr. Türmer ist die ideale Referentin zu diesem Thema, denn sie hat dazu ihre Dissertation geschrieben und schon so manchen Forschungsbeitrag verfasst. Bitte sehr, Frau Dr. Türmer, wir sind sehr gespannt auf das, was Sie uns zu sagen haben.

Dr. Vera Türmer: Vielen Dank, Herr Kollege, für die freundlichen Worte. Meine Damen und Herren, es ist erschreckend, was die Stiftung Lesen in ihrer Studie „Lesen in Deutschland" gemeldet hat. Die zentrale Aussage ist: Jeder Vierte liest keine Bücher. Damit wurde eine erneute Diskussion um die abnehmende Lesefreude und Lesekompetenz von Kindern und Jugendlichen angestoßen. Und auch die Klage vieler Lehrer über die zunehmende Leseunlust von Schülern war in den vergangenen Jahren kaum zu überhören. Literatur komme nicht mehr an im Unterricht. Lesen gelte bei Schülern als uncool und als nicht mehr zeitgemäß. Und nicht nur die Stiftung Lesen prognostiziert, dass Bücher angesichts der heutigen Medienvielfalt zurückgedrängt werden.

Es gibt aber auch eine beruhigende Nachricht. Nach der Studie „Kinder und Medien" des Medienpädagogischen Forschungsverbunds werden Bücher weiterhin gelesen. Während Fernsehen, Internet und Computerspiele bei den 6- bis 13-Jährigen hoch im Kurs stehen, rangiert das Lesen gerade einmal im Mittelfeld der liebsten Freizeitbeschäftigungen der Kinder und Jugendlichen. Lesen ist die gesellschaftliche Schlüsselqualifikation Nummer eins, gerade in einer medial vermittelten Welt. Lesen schult nicht nur die Fähigkeit, Texte aller Art zu verstehen, Informationen zu nutzen und zu reflektieren. Lesekompetenz ist vielmehr ein wichtiges Hilfsmittel zum Erreichen persönlicher und beruflicher Ziele.

Die internationale Grundschul-Leseuntersuchung, kurz IGLU, zeigte, dass im Leseunterricht an deutschen Grundschulen herkömmliche Methoden noch immer dominieren. Anregende Formen des Unterrichts, wie etwa das Verfassen eigener Texte oder eine kreative Verarbeitung des Gelesenen, sind hingegen selten zu finden. Man muss heute aber gerade kreative Methoden einsetzen, um Schüler für das Lesen zu begeistern. Schüler müssen dort abgeholt werden, wo sie sind. Sie müssen mit ihrer Lebenserfahrung in den Unterricht eingebunden werden.

Im Oktober vergangenen Jahres wurde in Südafrika das Projekt „LitAfrika – eine Lesesafari" initiiert. 25 deutschsprachige und muttersprachige Schüler der deutschen Auslandsschulen kamen im Rahmen des Leseprojekts in einem dreitägigen Literaturcamp in KwaZulu-Natal zusammen. In Kleingruppen erarbeiteten die Zehntklässler kreative Präsentationen zu deutschsprachigen Kurzgeschichten und Gedichten in Form von Liedern und Theaterstücken. Auch andere Ideen kamen vor, wie zum Beispiel Interviews oder Hörspiele. Kreative Lektürearbeit im Fremdsprachenunterricht machte den Schülern großen Spaß, da sie sich hierbei ganz anders einbringen und wiederfinden können als bei der Arbeit mit Sachtexten oder im Grammatikunterricht. Von einer allgemeinen Leseunlust bei Kindern und Jugendlichen kann deshalb keine Rede sein.

Gerade im Unterricht für Deutsch als Fremdsprache kommt der schüleraktivierenden Arbeit eine wesentliche Schlüsselrolle zu. Im Fremdsprachenlernen gilt es, Teilkompetenzen wie die Lese-, Sprech-, Hör- und Schreibfähigkeit der Fremdsprachenschüler zu schulen und die verschiedenen Bereiche im Zusammenspiel zu fördern. In literarischen Texten stehen oft existenzielle Konflikte im Mittelpunkt, die Anlass zur Stellungnahme und kritischen Auseinandersetzung geben. Insofern regt Literatur nicht nur zum Lesen an, sondern auch dazu, sich zu positionieren. Dabei erfahren Schüler und Schülerinnen, dass die Sprache nicht nur für rein pragmatische Zwecke, sondern auch zur Artikulation von Gedanken, Gefühlen und Bedürfnissen eingesetzt und damit Teil ihrer Person werden kann.

Seit Jahren setzen sich unter anderem Wissenschaftler dafür ein, dass dieser didaktische Ansatz einen festen Platz im kommunikativen Fremdsprachenunterricht einnimmt. So findet im neuen Rahmenplan Deutsch als Fremdsprache kreatives Schreiben als Ergänzung zu textanalytischen Methoden durchaus Berücksichtigung. Bis in die 80er Jahre hinein dominierten im Unterricht Deutsch als Fremdsprache Lehrbücher, die sich ausschließlich an der Alltagskommunikation orientierten. Wurden dort literarische Texte bearbeitet, dann allenfalls in Form einer Interpretation. Die lebendige Lektürearbeit war damit im kommunikativen Sprachenunterricht lange Zeit die Ausnahme.

In den letzten drei Jahrzehnten hat sich in der Literaturdidaktik jedoch ein wichtiger Paradigmenwechsel vollzogen, der den Weg frei macht für eine neue Lust am Lesen. Das literarische Kunstwerk an sich steht heute keineswegs mehr im Mittelpunkt der Literaturarbeit. Vielmehr bemüht sich der Unterricht in Deutsch als Fremdsprache, die Schüler zum kreativen Schreiben anzuleiten. Lehrer müssen dieses Potenzial kennen und den Schülern bei der Umsetzung helfen.

Allen negativen Umfrageergebnissen zum Trotz: Der Kinder- und Jugendbuchmarkt kann sich über eine mangelnde Nachfrage nicht beklagen. Rund 6.000 deutschsprachige Kinder- und Jugendbücher erscheinen jährlich. Jugendbuchautorinnen wie Cornelia Funke sind die stillen Helden im Kinderzimmer. Ihre Titel „Die Wilden Hühner" oder „Tintenherz" werden millionenfach gekauft. Die Wissenschaft zeigt: Kinder- und Jugendbücher sind authentische Texte, die den jungen Leser auf einer emotionalen Ebene ansprechen und zur Identifikation oder Auseinandersetzung mit den Hauptfiguren einladen. Besonders in der Phase der sogenannten Lesepubertät, die parallel zur biologischen Pubertät verläuft und zu einer wissenschaftlich erwiesenen Abnahme der Lesehäufigkeit führt, können Kinder- und Jugendliteratur die Leser mit Identifikationsthemen wie erste Liebe, Freundschaft und Familie erreichen.

In einem Internetportal gibt das Institut für Jugendbuchforschung didaktische Vorschläge für den Einsatz von Kinder- und Jugendliteratur im Unterricht für Deutsch als Fremdsprache. Über 100 moderne Literaturtitel sind nach Lerngegenstand und Zielgruppe sortiert. Unterrichtsideen wie das Verfassen eines neuen Endes einer Geschichte oder das Schreiben eines Briefes an die Hauptfigur wurden zusammengetragen.

Dabei ist die richtige Textauswahl für den Einsatz im Unterricht wesentlich. Die Lektüre muss am Alter, Sprachniveau und den Fähigkeiten der Schüler ausgerichtet sein und darf die Schüler nicht überfordern. Aus der Praxis gibt es gute Erfahrungen mit Texten, die sprachlich zwar gut verständlich, dabei aber doppelsinnig oder lustig sind. Vorhandene Leerstellen in einem Text kann der Leser mit eigenen Ideen und Deutungen füllen, ganz nach seinen Vorstellungen. Bei solchen Aufgaben gilt: Der Leser hat immer recht. Es kann ihm niemand die Freiheit nehmen, Schlüsse aus dem Text zu ziehen, sich über den Text zu ärgern, sich über ihn zu freuen, ihn zu vergessen oder das Buch, in dem er steht, zu einem beliebigen Zeitpunkt in die Ecke zu werfen. So sprach bereits der Schriftsteller Hans Magnus Enzensberger in seinem Aufsatz „Bescheidener Vorschlag zum Schutze der Jugend vor den Erzeugnissen der Poesie" davon, dass die Lektüre ein anarchischer Akt sei. Meiner Meinung nach spricht man besser von der Autonomie des Lesers, da der Leser selbst über seinen Umgang mit Literatur entscheiden kann. Das muss ja nicht anarchisch sein. Heute befindet sich die Literaturdidaktik im Deutsch- und Sprachenunterricht auf dem Weg dahin, selbstbestimmtes Lesen zu lehren. Diesen handlungsorientierten Ansatz möchte ich Ihnen mit auf den Weg geben. Vielen Dank für Ihre Aufmerksamkeit.

Dozent: Vielen Dank, liebe Frau Türmer, für diesen faktenreichen Vortrag, der uns einen guten Einstieg in die Diskussion ermöglicht. Vielleicht beginnen wir mit Verständnisfragen. Ja, bitte?

Ende des Subtests Hörverstehen.`,

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
