/* Modellprüfung N — Exam data (answers, themes, quotes) */
'use strict';

const EXAM_DATA = {
  title: 'Modellprüfung N',

  /*
   * ⚠ CONSISTENCIA: Las respuestas aquí DEBEN coincidir con los Pruefung.initXXX() de cada archivo standalone.
   *
   * LV3: Usar símbolos: '+' = richtig, '−' = falsch, '×' = nicht im Text
   *       (Los standalone usan 'richtig'/'falsch'/'nicht', el engine traduce automáticamente)
   */
  correct: {
    lv1: { 1:'_', 2:'_', 3:'_', 4:'_', 5:'_', 6:'_' },
    lv2: { 7:'_', 8:'_', 9:'_', 10:'_', 11:'_', 12:'_' },
    lv3: { 13:'_', 14:'_', 15:'_', 16:'_', 17:'_', 18:'_', 19:'_', 20:'_', 21:'_', 22:'_', 23:'_', 24:'_' },
    sb:  { 25:'_',26:'_',27:'_',28:'_',29:'_',30:'_',31:'_',32:'_',33:'_',34:'_',35:'_',36:'_',37:'_',38:'_',39:'_',40:'_',41:'_',42:'_',43:'_',44:'_',45:'_',46:'_',47:'_' },
    hv1: { 47:'_',48:'_',49:'_',50:'_',51:'_',52:'_',53:'_',54:'_' },
    hv2: { 55:'_',56:'_',57:'_',58:'_',59:'_',60:'_',61:'_',62:'_',63:'_',64:'_' },
    hv3: {
      65:['keyword1','keyword2'],
      66:['keyword1','keyword2'],
      '67a':['keyword1'],
      '67b':['keyword1'],
      '68a':['keyword1'],
      '68b':['keyword1'],
      69:['keyword1'],
      '70a':['keyword1'],
      '70b':['keyword1'],
      '71a':['keyword1'],
      '71b':['keyword1'],
      72:['keyword1'],
      73:['keyword1'],
      74:['keyword1']
    }
  },

  /* ⚠ CONSISTENCIA: Debe coincidir con 5-muendlich-praesentation.html y exam.html (tab-vorbereitung) */
  themaTexte: {
    a1: 'Texto completo tema A1.',
    a2: 'Texto completo tema A2.',
    b1: 'Texto completo tema B1.',
    b2: 'Texto completo tema B2.',
    c1: 'Texto completo tema C1.',
    c2: 'Texto completo tema C2.'
  },

  /* ⚠ CONSISTENCIA: Debe coincidir con 4-schriftlicher-ausdruck.html y exam.html (tab-sa) */
  saThemen: {
    tema1key: {
      title: 'Thema 1: Nombre',
      zitate: [
        'Primera cita.',
        'Segunda cita.'
      ]
    },
    tema2key: {
      title: 'Thema 2: Nombre',
      zitate: [
        'Primera cita.',
        'Segunda cita.'
      ]
    }
  },

  /* TODO: Transkript completo del audio HV (~2250 palabras: HV1 ~858 + HV2 ~678 + HV3 ~712) */
  hvTranskript: '/* TODO: Hörverstehen-Transkript hier einfügen */',

  /* ⚠ CONSISTENCIA: Debe coincidir con 5-muendlich-diskussion.html y exam.html (screen-diskussion-ready) */
  diskussionZitate: {
    1: { text:'Cita 1.', autor:'Apellido',
         aspekte:['Aspecto 1?','Aspecto 2?','Aspecto 3?','Aspecto 4?'] },
    2: { text:'Cita 2.', autor:'Apellido',
         aspekte:['Aspecto 1?','Aspecto 2?','Aspecto 3?','Aspecto 4?'] },
    3: { text:'Cita 3.', autor:'Apellido',
         aspekte:['Aspecto 1?','Aspecto 2?','Aspecto 3?','Aspecto 4?'] },
    4: { text:'Cita 4.', autor:'Apellido',
         aspekte:['Aspecto 1?','Aspecto 2?','Aspecto 3?','Aspecto 4?'] },
  }
};
