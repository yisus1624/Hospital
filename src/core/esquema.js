// Generado desde el Instructivo SMH V5 + calibracion contra el validador real del sistema.
// 248 campos, en el orden exacto de columnas del archivo.
export const CAMPOS = [
 {
  "num": 1,
  "key": "fecha_cargue",
  "col": "fecha_de_cargue",
  "nombre": "Fecha de cargue",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "no_futura": true
  }
 },
 {
  "num": 2,
  "key": "fecha_ini_periodo",
  "col": "fecha_inicial_del_periodo_de_la_informacion_reportada",
  "nombre": "Fecha inicial del periodo reportado",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "no_futura": true
  }
 },
 {
  "num": 3,
  "key": "fecha_fin_periodo",
  "col": "fecha_final_del_periodo_de_la_informacion_reportada",
  "nombre": "Fecha final del periodo reportado",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "no_futura": true,
   "mayor_que": [
    "fecha_ini_periodo"
   ]
  }
 },
 {
  "num": 4,
  "key": "tipo_id",
  "col": "tipo",
  "nombre": "Tipo de identificacion",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "AS",
   "DE",
   "MS",
   "PT",
   "CC",
   "CE",
   "CD",
   "PA",
   "SC",
   "PE",
   "RC",
   "TI",
   "CN"
  ]
 },
 {
  "num": 5,
  "key": "documento",
  "col": "documento",
  "nombre": "Documento",
  "tipo": "A",
  "len": 17,
  "req": "SI",
  "x": {
   "solo_digitos": true
  }
 },
 {
  "num": 6,
  "key": "nombre1",
  "col": "nombre_1",
  "nombre": "Nombre 1",
  "tipo": "A",
  "len": 60,
  "req": "SI"
 },
 {
  "num": 7,
  "key": "nombre2",
  "col": "nombre_2",
  "nombre": "Nombre 2",
  "tipo": "A",
  "len": 60,
  "req": "SI",
  "x": {
   "vacio_como": "NONE"
  }
 },
 {
  "num": 8,
  "key": "apellido1",
  "col": "apellido_1",
  "nombre": "Apellido 1",
  "tipo": "A",
  "len": 60,
  "req": "SI"
 },
 {
  "num": 9,
  "key": "apellido2",
  "col": "apellido_2",
  "nombre": "Apellido 2",
  "tipo": "A",
  "len": 60,
  "req": "SI",
  "x": {
   "vacio_como": "NONE"
  }
 },
 {
  "num": 10,
  "key": "telefono",
  "col": "telefono",
  "nombre": "Telefono",
  "tipo": "N",
  "len": 10,
  "req": "SI"
 },
 {
  "num": 11,
  "key": "talla",
  "col": "talla",
  "nombre": "Talla (cm)",
  "tipo": "N",
  "len": 3,
  "req": "SI",
  "x": {
   "min": 90,
   "max": 200
  }
 },
 {
  "num": 12,
  "key": "peso_inicio",
  "col": "peso_al_inicio_de_la_gestacion",
  "nombre": "Peso al inicio de la gestacion",
  "tipo": "A",
  "len": 5,
  "req": "SI",
  "x": {
   "dec": true,
   "sep_dec": ".",
   "ndec": 1,
   "min": 30,
   "max": 120
  }
 },
 {
  "num": 13,
  "key": "gravida",
  "col": "gravida",
  "nombre": "Gravida",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 14,
  "key": "partos",
  "col": "partos",
  "nombre": "Partos",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 15,
  "key": "cesareas",
  "col": "cesarea",
  "nombre": "Cesareas",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 16,
  "key": "abortos",
  "col": "aborto",
  "nombre": "Abortos",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 17,
  "key": "ectopicos",
  "col": "ectopicos",
  "nombre": "Ectopicos",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 18,
  "key": "vivos",
  "col": "vivos",
  "nombre": "Vivos",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 19,
  "key": "muertos",
  "col": "muertos",
  "nombre": "Muertos",
  "tipo": "N",
  "len": 2,
  "req": "SI"
 },
 {
  "num": 20,
  "key": "fum",
  "col": "fum",
  "nombre": "FUM",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "no_futura": true
  }
 },
 {
  "num": 21,
  "key": "fpp",
  "col": "fpp",
  "nombre": "FPP",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "max_dias_desde": [
    "fum",
    294
   ]
  }
 },
 {
  "num": 22,
  "key": "fecha_ingreso_programa",
  "col": "fecha_de_ingreso_al_programa_de_atencion_integral",
  "nombre": "Fecha de ingreso al programa de atencion integral",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "no_futura": true,
   "mayor_que": [
    "fum",
    "fecha_ingreso_riamp"
   ]
  }
 },
 {
  "num": 23,
  "key": "nit",
  "col": "nit",
  "nombre": "NIT",
  "tipo": "N",
  "len": 9,
  "req": "SI",
  "x": {
   "zfill": true
  }
 },
 {
  "num": 24,
  "key": "nombre_ips",
  "col": "nombre_ips",
  "nombre": "Nombre IPS",
  "tipo": "T",
  "len": 60,
  "req": "SI",
  "x": {
   "sin_espacios": true
  }
 },
 {
  "num": 25,
  "key": "doc_profesional",
  "col": "numero_de_documento_de_profesional_que_realiza_la_primera_atencion",
  "nombre": "Documento del profesional que realiza la primera atencion",
  "tipo": "N",
  "len": 18,
  "req": "SI"
 },
 {
  "num": 26,
  "key": "semana_gestacional",
  "col": "semana_gestacional",
  "nombre": "Semana gestacional",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "x": {
   "dec": true,
   "sep_dec": ".",
   "max": 42
  }
 },
 {
  "num": 27,
  "key": "riesgo",
  "col": "riesgo",
  "nombre": "Riesgo",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "ALTO",
   "BAJO"
  ]
 },
 {
  "num": 28,
  "key": "fecha_ingreso_riamp",
  "col": "fecha_ingreso_riamp_nivel_primario",
  "nombre": "Fecha ingreso RIAMP nivel primario",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "menor_que": [
    "fpp",
    "fecha_ingreso_programa"
   ]
  }
 },
 {
  "num": 29,
  "key": "grupo_sanguineo",
  "col": "grupo_sanguineo",
  "nombre": "Grupo sanguineo",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "A",
   "B",
   "O",
   "AB"
  ]
 },
 {
  "num": 30,
  "key": "rh",
  "col": "rh",
  "nombre": "RH",
  "tipo": "T",
  "len": 8,
  "req": "COND",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ],
  "x": {
   "cond": [
    "lleno",
    "grupo_sanguineo"
   ]
  }
 },
 {
  "num": 31,
  "key": "fecha_grupo_sanguineo",
  "col": "fecha_grupo_sanguineo",
  "nombre": "Fecha grupo sanguineo",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "grupo_sanguineo"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 32,
  "key": "coombs",
  "col": "coombs_indirecto",
  "nombre": "Coombs indirecto",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 33,
  "key": "fecha_coombs",
  "col": "fecha_coombs_indirecto",
  "nombre": "Fecha Coombs indirecto",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "coombs"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 34,
  "key": "glicemia",
  "col": "glicemia_en_ayunas",
  "nombre": "Glicemia en ayunas",
  "tipo": "N",
  "len": 3,
  "req": "NO"
 },
 {
  "num": 35,
  "key": "fecha_glicemia",
  "col": "fecha_glicemia_en_ayunas",
  "nombre": "Fecha glicemia en ayunas",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "glicemia"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 36,
  "key": "hepatitis_b",
  "col": "hepatitis_b",
  "nombre": "Hepatitis b",
  "tipo": "T",
  "len": 11,
  "req": "NO",
  "vals": [
   "REACTIVO",
   "NO REACTIVO"
  ]
 },
 {
  "num": 37,
  "key": "fecha_hepatitis_b",
  "col": "fecha_hepatitis_b",
  "nombre": "Fecha Hepatitis b",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "hepatitis_b"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 38,
  "key": "toxo_igg",
  "col": "toxoplasma_igg",
  "nombre": "Toxoplasma IGG",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 39,
  "key": "fecha_toxo_igg",
  "col": "fecha_toxoplasma_igg",
  "nombre": "Fecha Toxoplasma IGG",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_igg"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 40,
  "key": "toxo_igm",
  "col": "toxoplasma_igm",
  "nombre": "Toxoplasma IGM",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 41,
  "key": "fecha_toxo_igm",
  "col": "fecha_toxoplasma_igm",
  "nombre": "Fecha toxoplasma IGM",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_igm"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 42,
  "key": "toxo_eia_neg1",
  "col": "toxoplasma_igm_por_eia_para_negativos1",
  "nombre": "Toxoplasma IGM por EIA para negativos1",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 43,
  "key": "fecha_toxo_eia_neg1",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos1",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg1"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 44,
  "key": "toxo_eia_neg2",
  "col": "toxoplasma_igm_por_eia_para_negativos2",
  "nombre": "Toxoplasma IGM por EIA para negativos2",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 45,
  "key": "fecha_toxo_eia_neg2",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos2",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos2",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg2"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 46,
  "key": "toxo_eia_neg3",
  "col": "toxoplasma_igm_por_eia_para_negativos3",
  "nombre": "Toxoplasma IGM por EIA para negativos3",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 47,
  "key": "fecha_toxo_eia_neg3",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos3",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos3",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg3"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 48,
  "key": "toxo_eia_neg4",
  "col": "toxoplasma_igm_por_eia_para_negativos4",
  "nombre": "Toxoplasma IGM por EIA para negativos4",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 49,
  "key": "fecha_toxo_eia_neg4",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos4",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos4",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg4"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 50,
  "key": "toxo_eia_neg5",
  "col": "toxoplasma_igm_por_eia_para_negativos5",
  "nombre": "Toxoplasma IGM por EIA para negativos5",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 51,
  "key": "fecha_toxo_eia_neg5",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos5",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos5",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg5"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 52,
  "key": "toxo_eia_neg6",
  "col": "toxoplasma_igm_por_eia_para_negativos6",
  "nombre": "Toxoplasma IGM por EIA para negativos6",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 53,
  "key": "fecha_toxo_eia_neg6",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos6",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos6",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg6"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 54,
  "key": "toxo_eia_neg7",
  "col": "toxoplasma_igm_por_eia_para_negativos7",
  "nombre": "Toxoplasma IGM por EIA para negativos7",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 55,
  "key": "fecha_toxo_eia_neg7",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos7",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos7",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg7"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 56,
  "key": "toxo_eia_neg8",
  "col": "toxoplasma_igm_por_eia_para_negativos8",
  "nombre": "Toxoplasma IGM por EIA para negativos8",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 57,
  "key": "fecha_toxo_eia_neg8",
  "col": "fecha_toxoplasma_igm_por_eia_para_negativos8",
  "nombre": "Fecha toxoplasma IGM por EIA para negativos8",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "toxo_eia_neg8"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 58,
  "key": "carga_viral",
  "col": "carga_viral",
  "nombre": "Carga viral",
  "tipo": "N",
  "len": 6,
  "req": "NO",
  "x": {
   "indetectable_cero": true
  }
 },
 {
  "num": 59,
  "key": "fecha_carga_viral",
  "col": "fecha_carga_viral",
  "nombre": "Fecha carga viral",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "carga_viral"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 60,
  "key": "rubeola",
  "col": "rubeola",
  "nombre": "Rubeola",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 61,
  "key": "fecha_rubeola",
  "col": "fecha_rubeola",
  "nombre": "Fecha rubeola",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "rubeola"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 62,
  "key": "estreptococo_rectal",
  "col": "estreptococo_rectal",
  "nombre": "Estreptococo rectal",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 63,
  "key": "fecha_estreptococo_rectal",
  "col": "fecha_estreptococorectal",
  "nombre": "Fecha estreptococo rectal",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "estreptococo_rectal"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 64,
  "key": "estreptococo_vaginal",
  "col": "estreptococo_vaginal",
  "nombre": "Estreptococo vaginal",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 65,
  "key": "fecha_estreptococo_vaginal",
  "col": "fecha_esreptococovaginal",
  "nombre": "Fecha estreptococo vaginal",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "estreptococo_vaginal"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 66,
  "key": "influenza",
  "col": "influenzaestacional",
  "nombre": "Influenza estacional",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 67,
  "key": "fecha_influenza",
  "col": "fecha_influenza_estacional",
  "nombre": "Fecha influenza estacional",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "influenza",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 68,
  "key": "tdap",
  "col": "tdap",
  "nombre": "Tdap",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 69,
  "key": "fecha_tdap",
  "col": "fecha_tdap",
  "nombre": "Fecha Tdap",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "tdap",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 70,
  "key": "antitetanica",
  "col": "antitetanica",
  "nombre": "Antitetanica",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 71,
  "key": "fecha_antitetanica",
  "col": "fecha_antitetanica",
  "nombre": "Fecha antitetanica",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "antitetanica",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 72,
  "key": "fecha_curso_paternidad1",
  "col": "fecha_1_cursopaternidad",
  "nombre": "Fecha 1 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true
  }
 },
 {
  "num": 73,
  "key": "fecha_curso_paternidad2",
  "col": "fecha_2_cursopaternidad",
  "nombre": "Fecha 2 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_curso_paternidad1"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 74,
  "key": "fecha_curso_paternidad3",
  "col": "fecha_3_cursopaternidad",
  "nombre": "Fecha 3 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_curso_paternidad1",
    "fecha_curso_paternidad2"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 75,
  "key": "fecha_curso_paternidad4",
  "col": "fecha_4_cursopaternidad",
  "nombre": "Fecha 4 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_curso_paternidad1",
    "fecha_curso_paternidad2",
    "fecha_curso_paternidad3"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 76,
  "key": "fecha_curso_paternidad5",
  "col": "fecha_5_cursopaternidad",
  "nombre": "Fecha 5 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_curso_paternidad1",
    "fecha_curso_paternidad2",
    "fecha_curso_paternidad3",
    "fecha_curso_paternidad4"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 77,
  "key": "fecha_curso_paternidad6",
  "col": "fecha_6_cursopaternidad",
  "nombre": "Fecha 6 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_curso_paternidad1",
    "fecha_curso_paternidad2",
    "fecha_curso_paternidad3",
    "fecha_curso_paternidad4",
    "fecha_curso_paternidad5"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 78,
  "key": "fecha_curso_paternidad7",
  "col": "fecha_7_cursopaternidad",
  "nombre": "Fecha 7 curso paternidad",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_curso_paternidad1",
    "fecha_curso_paternidad2",
    "fecha_curso_paternidad3",
    "fecha_curso_paternidad4",
    "fecha_curso_paternidad5",
    "fecha_curso_paternidad6"
   ],
   "menor_que": [
    "fpp"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 79,
  "key": "ctog_pre",
  "col": "ctog_pre",
  "nombre": "Ctog pre",
  "tipo": "N",
  "len": 3,
  "req": "NO"
 },
 {
  "num": 80,
  "key": "ctog_1hora",
  "col": "ctog_1hora",
  "nombre": "Ctog 1hora",
  "tipo": "N",
  "len": 3,
  "req": "NO"
 },
 {
  "num": 81,
  "key": "ctog_2hora",
  "col": "ctog_2_h",
  "nombre": "Ctog 2hora",
  "tipo": "N",
  "len": 3,
  "req": "NO"
 },
 {
  "num": 82,
  "key": "ctog_fecha",
  "col": "ctog_fecha",
  "nombre": "Ctog fecha",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "ctog_pre"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 83,
  "key": "hb",
  "col": "hb",
  "nombre": "Hb",
  "tipo": "N",
  "len": 2,
  "req": "NO",
  "x": {
   "dec": true,
   "sep_dec": ".",
   "min": 6,
   "max": 20
  }
 },
 {
  "num": 84,
  "key": "fecha_hb",
  "col": "fecha_hb",
  "nombre": "Fecha hb",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "hb"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 85,
  "key": "htco",
  "col": "htco",
  "nombre": "Htco",
  "tipo": "N",
  "len": 2,
  "req": "NO",
  "x": {
   "max": 50
  }
 },
 {
  "num": 86,
  "key": "fecha_htco",
  "col": "fecha_htco",
  "nombre": "Fecha htco",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "htco"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 87,
  "key": "frotis",
  "col": "frotis",
  "nombre": "Frotis",
  "tipo": "T",
  "len": 7,
  "req": "NO",
  "vals": [
   "NORMAL",
   "ANORMAL"
  ]
 },
 {
  "num": 88,
  "key": "fecha_frotis",
  "col": "fecha_frotis",
  "nombre": "Fecha frotis",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "frotis"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 89,
  "key": "gram_orina",
  "col": "gram_de_orina",
  "nombre": "Gram de orina",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 90,
  "key": "fecha_gram_orina",
  "col": "fecha_gram_de_orina",
  "nombre": "Fecha gram de orina",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "gram_orina",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 91,
  "key": "parcial_orina",
  "col": "parcial_orina",
  "nombre": "Parcial orina",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 92,
  "key": "fecha_parcial_orina",
  "col": "fecha_parcial_orina",
  "nombre": "Fecha parcial orina",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "parcial_orina",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 93,
  "key": "carga_viral1",
  "col": "carga_viral1",
  "nombre": "Carga viral1",
  "tipo": "N",
  "len": 6,
  "req": "NO",
  "x": {
   "indetectable_cero": true
  }
 },
 {
  "num": 94,
  "key": "fecha_carga_viral1",
  "col": "fecha_carga_viral1",
  "nombre": "Fecha carga viral1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "carga_viral1"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 95,
  "key": "tipo_estudio_sifilis1",
  "col": "tipo_de_estudio_prueba_rapida_o_vdrl",
  "nombre": "Tipo de estudio prueba rapida1 o vdrl1",
  "tipo": "T",
  "len": 13,
  "req": "NO",
  "vals": [
   "PRUEBA RAPIDA",
   "VDRL"
  ]
 },
 {
  "num": 96,
  "key": "vdrl1",
  "col": "vdrl_o_prueba_rapida_sifilis",
  "nombre": "Vdrl1 o prueba rapida1 sifilis",
  "tipo": "T",
  "len": 11,
  "req": "COND",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "REACTIVO",
   "NO REACTIVO"
  ],
  "x": {
   "cond": [
    "lleno",
    "tipo_estudio_sifilis1"
   ],
   "pareja_estudio": "tipo_estudio_sifilis1"
  }
 },
 {
  "num": 97,
  "key": "fecha_vdrl1",
  "col": "fecha_vdrl1_o_prueba_rapida1",
  "nombre": "Fecha vdrl1 o prueba rapida1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "tipo_estudio_sifilis1"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 98,
  "key": "urocultivo1",
  "col": "urocultivo1",
  "nombre": "Urocultivo1",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "INDETECTABLE"
  ]
 },
 {
  "num": 99,
  "key": "fecha_urocultivo1",
  "col": "fecha_urocultivo1",
  "nombre": "Fecha Urocultivo1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "urocultivo1"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 100,
  "key": "ecografia1",
  "col": "ecografia1_translucencia_nucal",
  "nombre": "Ecografia1 (translucencia nucal)",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 101,
  "key": "fecha_ecografia1",
  "col": "fecha_ecografia1",
  "nombre": "Fecha ecografia1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "ecografia1",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 102,
  "key": "anormalidades_eco1",
  "col": "anormalidades_ecografia1",
  "nombre": "Anormalidades ecografia1",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "igual",
    "ecografia1",
    [
     "SI"
    ]
   ]
  }
 },
 {
  "num": 103,
  "key": "semana_gest_eco1",
  "col": "semana_gestacion_por_ecografia",
  "nombre": "Semana gestacion por ecografia",
  "tipo": "N",
  "len": 2,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "ecografia1",
    [
     "SI"
    ]
   ],
   "dec": true,
   "sep_dec": ".",
   "max": 42
  }
 },
 {
  "num": 104,
  "key": "urocultivo_post1",
  "col": "urocultivo_post1",
  "nombre": "Urocultivo_post1",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "INDETECTABLE"
  ]
 },
 {
  "num": 105,
  "key": "fecha_urocultivo_post1",
  "col": "fecha_urocultivo_post1",
  "nombre": "Fecha Urocultivo_post1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "urocultivo_post1"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 106,
  "key": "fecha_asesoria_pre_vih1",
  "col": "fecha_asesoria_pre_test_vih_1",
  "nombre": "Fecha asesoria pre test vih 1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 107,
  "key": "acepta_prueba_vih1",
  "col": "acepta_prueba_1_vih",
  "nombre": "Acepta prueba 1 vih",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 108,
  "key": "fecha_asesoria_post_vih1",
  "col": "fecha_asesoria_post_test_vih_1",
  "nombre": "Fecha asesoria post test vih 1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "fecha_asesoria_pre_vih1"
   ]
  }
 },
 {
  "num": 109,
  "key": "resultado_vih1",
  "col": "resultado_prueba_rapida_trimestre_1",
  "nombre": "Resultado prueba rapida trimestre 1",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 110,
  "key": "fecha_prueba_vih1",
  "col": "fecha_de_realizacion_de_la_prueba_vih_1",
  "nombre": "Fecha de realizacion de la prueba vih 1",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "resultado_vih1"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 111,
  "key": "tipo_estudio_sifilis2",
  "col": "tipo_de_estudio_prueba_rapida2_o_vdrl2",
  "nombre": "Tipo de estudio prueba rapida2 o vdrl2",
  "tipo": "T",
  "len": 13,
  "req": "NO",
  "vals": [
   "PRUEBA RAPIDA",
   "VDRL"
  ]
 },
 {
  "num": 112,
  "key": "vdrl2",
  "col": "vdrl2_o_prueba_rapida_sifilis2",
  "nombre": "Vdrl2 o prueba rapida sifilis2",
  "tipo": "T",
  "len": 11,
  "req": "COND",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "REACTIVO",
   "NO REACTIVO"
  ],
  "x": {
   "cond": [
    "lleno",
    "tipo_estudio_sifilis2"
   ],
   "pareja_estudio": "tipo_estudio_sifilis2"
  }
 },
 {
  "num": 113,
  "key": "fecha_vdrl2",
  "col": "fecha_vdrl2_o_prueba_rapida2",
  "nombre": "Fecha vdrl2 o prueba rapida2",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "tipo_estudio_sifilis2"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 114,
  "key": "urocultivo2",
  "col": "urocultivo2",
  "nombre": "Urocultivo2",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "INDETECTABLE"
  ]
 },
 {
  "num": 115,
  "key": "fecha_urocultivo2",
  "col": "fecha_urocultivo2",
  "nombre": "Fecha Urocultivo2",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "urocultivo2"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 116,
  "key": "ecografia2",
  "col": "ecografia2_detalle_anatomico",
  "nombre": "Ecografia2 (detalle anatomico)",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 117,
  "key": "fecha_ecografia2",
  "col": "fecha_ecografia2",
  "nombre": "Fecha ecografia2",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "ecografia2",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 118,
  "key": "anormalidades_eco2",
  "col": "anormalidades_ecografia2",
  "nombre": "Anormalidades ecografia2",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "igual",
    "ecografia2",
    [
     "SI"
    ]
   ]
  }
 },
 {
  "num": 119,
  "key": "semana_gest_eco2",
  "col": "semana_gestacion_por_ecografia2",
  "nombre": "Semana gestacion por ecografia2",
  "tipo": "N",
  "len": 2,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "ecografia2",
    [
     "SI"
    ]
   ],
   "dec": true,
   "sep_dec": ".",
   "max": 42
  }
 },
 {
  "num": 120,
  "key": "urocultivo_post2",
  "col": "urocultivo_post2",
  "nombre": "Urocultivo_post2",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "INDETECTABLE"
  ],
  "x": {
   "cond": [
    "igual",
    "urocultivo2",
    [
     "POSITIVO",
     "INDETECTABLE"
    ]
   ]
  }
 },
 {
  "num": 121,
  "key": "fecha_urocultivo_post2",
  "col": "fecha_urocultivo_post2",
  "nombre": "Fecha Urocultivo_post2",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "urocultivo_post2"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 122,
  "key": "fecha_asesoria_pre_vih2",
  "col": "fecha_asesoria_pre_test_vih2",
  "nombre": "Fecha asesoria pre test vih2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 123,
  "key": "acepta_prueba_vih2",
  "col": "acepta_prueba_vih2",
  "nombre": "Acepta prueba vih2",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 124,
  "key": "fecha_asesoria_post_vih2",
  "col": "fecha_asesoria_post_test_vih2",
  "nombre": "Fecha asesoria post test vih2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 125,
  "key": "resultado_vih2",
  "col": "resultado_prueba_rapida_trimestre2",
  "nombre": "Resultado prueba rapida trimestre2",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 126,
  "key": "fecha_prueba_vih2",
  "col": "fecha_de_realizacion_de_la_prueba_vih2",
  "nombre": "Fecha de realizacion de la prueba vih2",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "resultado_vih2"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 127,
  "key": "tipo_estudio_sifilis3",
  "col": "tipo_de_estudio_prueba_rapida3_o_vdrl3",
  "nombre": "Tipo de estudio prueba rapida3 o vdrl3",
  "tipo": "T",
  "len": 13,
  "req": "NO",
  "vals": [
   "PRUEBA RAPIDA",
   "VDRL"
  ]
 },
 {
  "num": 128,
  "key": "vdrl3",
  "col": "vdrl3_o_prueba_rapida_sifilis3",
  "nombre": "Vdrl3 o prueba rapida sifilis3",
  "tipo": "T",
  "len": 11,
  "req": "COND",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "REACTIVO",
   "NO REACTIVO"
  ],
  "x": {
   "cond": [
    "lleno",
    "tipo_estudio_sifilis3"
   ],
   "pareja_estudio": "tipo_estudio_sifilis3"
  }
 },
 {
  "num": 129,
  "key": "fecha_vdrl3",
  "col": "fecha_vdrl3_o_prueba_rapida3",
  "nombre": "Fecha vdrl3 o prueba rapida3",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "tipo_estudio_sifilis3"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 130,
  "key": "urocultivo3",
  "col": "urocultivo3",
  "nombre": "Urocultivo3",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "INDETECTABLE"
  ]
 },
 {
  "num": 131,
  "key": "fecha_urocultivo3",
  "col": "fecha_urocultivo3",
  "nombre": "Fecha Urocultivo3",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "urocultivo3"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 132,
  "key": "ecografia3",
  "col": "ecografia3_obstetrica",
  "nombre": "Ecografia3 (OBSTETRICA)",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 133,
  "key": "fecha_ecografia3",
  "col": "fecha_ecografia3",
  "nombre": "Fecha ecografia3",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "ecografia3",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 134,
  "key": "anormalidades_eco3",
  "col": "anormalidades_ecografia3",
  "nombre": "Anormalidades ecografia3",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "igual",
    "ecografia3",
    [
     "SI"
    ]
   ]
  }
 },
 {
  "num": 135,
  "key": "semana_gest_eco3",
  "col": "semana_gestacion_por_ecografia3",
  "nombre": "Semana gestacion por ecografia3",
  "tipo": "N",
  "len": 2,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "ecografia3",
    [
     "SI"
    ]
   ],
   "dec": true,
   "sep_dec": ".",
   "max": 42
  }
 },
 {
  "num": 136,
  "key": "urocultivo_post3",
  "col": "urocultivo_post3",
  "nombre": "Urocultivo_post3",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 137,
  "key": "fecha_urocultivo_post3",
  "col": "fecha_urocultivo_post3",
  "nombre": "Fecha Urocultivo_post3",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "urocultivo_post3"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 138,
  "key": "fecha_asesoria_pre_vih3",
  "col": "fecha_asesoria_pre_test_vih3",
  "nombre": "Fecha asesoria pre test vih3",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 139,
  "key": "acepta_prueba_vih3",
  "col": "acepta_prueba_vih3",
  "nombre": "Acepta prueba vih3",
  "tipo": "T",
  "len": 2,
  "req": "NO",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 140,
  "key": "fecha_asesoria_post_vih3",
  "col": "fecha_asesoria_post_test_vih3",
  "nombre": "Fecha asesoria post test vih3",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 141,
  "key": "resultado_vih3",
  "col": "resultado_prueba_rapida_trimestre3",
  "nombre": "Resultado prueba rapida trimestre3",
  "tipo": "T",
  "len": 8,
  "req": "NO",
  "vals": [
   "POSITIVO",
   "NEGATIVO"
  ]
 },
 {
  "num": 142,
  "key": "fecha_prueba_vih3",
  "col": "fecha_de_realizacion_de_la_prueba_vih3",
  "nombre": "Fecha de realizacion de la prueba vih3",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "resultado_vih3"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 143,
  "key": "diag1",
  "col": "diag1",
  "nombre": "Diag1",
  "tipo": "A",
  "len": 4,
  "req": "SI",
  "x": {
   "cie10": true
  }
 },
 {
  "num": 144,
  "key": "diag2",
  "col": "diag2",
  "nombre": "Diag2",
  "tipo": "A",
  "len": 4,
  "req": "SI",
  "x": {
   "cie10": true
  }
 },
 {
  "num": 145,
  "key": "diag3",
  "col": "diag3",
  "nombre": "Diag3",
  "tipo": "A",
  "len": 4,
  "req": "COND",
  "x": {
   "cie10": true,
   "cond": [
    "igual",
    "riesgo",
    [
     "ALTO"
    ]
   ]
  }
 },
 {
  "num": 146,
  "key": "diag4",
  "col": "diag4",
  "nombre": "Diag4",
  "tipo": "A",
  "len": 4,
  "req": "NO",
  "x": {
   "cie10": true
  }
 },
 {
  "num": 147,
  "key": "diag5",
  "col": "diag5",
  "nombre": "Diag5",
  "tipo": "A",
  "len": 4,
  "req": "NO",
  "x": {
   "cie10": true
  }
 },
 {
  "num": 148,
  "key": "diag6",
  "col": "diag6",
  "nombre": "Diag6",
  "tipo": "A",
  "len": 4,
  "req": "NO",
  "x": {
   "cie10": true
  }
 },
 {
  "num": 149,
  "key": "diag7",
  "col": "diag7",
  "nombre": "Diag7",
  "tipo": "A",
  "len": 4,
  "req": "NO",
  "x": {
   "cie10": true
  }
 },
 {
  "num": 150,
  "key": "fecha_terminacion_embarazo",
  "col": "fecha_de_terminacion_del_embarazo",
  "nombre": "Fecha de terminacion del embarazo",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 151,
  "key": "via_terminacion",
  "col": "via_de_terminacion_del_embarazo",
  "nombre": "Via de terminacion del embarazo",
  "tipo": "T",
  "len": 7,
  "req": "COND",
  "vals": [
   "PARTO",
   "CESAREA",
   "ABORTO"
  ],
  "x": {
   "cond": [
    "lleno",
    "fecha_terminacion_embarazo"
   ]
  }
 },
 {
  "num": 152,
  "key": "fcf",
  "col": "frecuencia_cardiaca_fetal_en_numeros",
  "nombre": "Frecuencia cardiaca fetal",
  "tipo": "N",
  "len": 3,
  "req": "NO"
 },
 {
  "num": 153,
  "key": "fecha_fcf",
  "col": "fecha_frecuencia_cardiaca_fetal",
  "nombre": "Fecha frecuencia cardiaca fetal",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "fcf"
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 154,
  "key": "fecha_asesoria_ive",
  "col": "fecha_asesoria_ive",
  "nombre": "Fecha asesoria IVE",
  "tipo": "F",
  "len": 10,
  "req": "NO"
 },
 {
  "num": 155,
  "key": "se_realizo_ive",
  "col": "se_realizo_ive",
  "nombre": "Se realizo IVE",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 156,
  "key": "consentimiento_ive",
  "col": "la_usuario_firmo_consentimiento_informado_para_ive",
  "nombre": "La usuaria firmo consentimiento informado para IVE",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "igual",
    "se_realizo_ive",
    [
     "SI"
    ]
   ]
  }
 },
 {
  "num": 157,
  "key": "asesoria_lactancia",
  "col": "asesoria_lactancia_materna",
  "nombre": "Asesoria lactancia materna",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 158,
  "key": "fecha_asesoria_planificacion",
  "col": "fecha_asesoria_en_planificacion_familiar_durante_la_gestacion",
  "nombre": "Fecha asesoria en planificacion familiar durante la gestacion",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 159,
  "key": "malformaciones",
  "col": "malformaciones_congenitas_en_la_gestacion",
  "nombre": "Malformaciones congenitas en la gestacion",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 160,
  "key": "fecha_malformacion",
  "col": "fecha_de_identificacion_de_malformacion",
  "nombre": "Fecha de identificacion de malformacion",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "malformaciones",
    [
     "SI"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 161,
  "key": "chagas",
  "col": "diagnostico_de_chagas_en_la_gestacion",
  "nombre": "Diagnostico de Chagas en la gestacion",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "POSITIVO",
   "NEGATIVO",
   "NO SE REALIZA TAMIZAJE"
  ]
 },
 {
  "num": 162,
  "key": "fecha_chagas",
  "col": "fecha_de_identificacion_gestante_con_chagas",
  "nombre": "Fecha de identificacion gestante con Chagas",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01",
   "na_si": [
    "igual",
    "chagas",
    [
     "NO SE REALIZA TAMIZAJE"
    ]
   ]
  }
 },
 {
  "num": 163,
  "key": "fecha_seguimiento_chagas",
  "col": "fecha_seguimiento_gestante_con_chagas",
  "nombre": "Fecha seguimiento gestante con Chagas",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "chagas",
    [
     "POSITIVO"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 164,
  "key": "tratamiento_chagas",
  "col": "gestante_recibio_tratamiento_para_chagas",
  "nombre": "Gestante recibio tratamiento para Chagas",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "igual",
    "chagas",
    [
     "POSITIVO"
    ]
   ]
  }
 },
 {
  "num": 165,
  "key": "sifilis_confirmada",
  "col": "sifilis_gestacional_confirmada",
  "nombre": "Sifilis gestacional confirmada",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 166,
  "key": "tratamiento_sifilis",
  "col": "tratamiento_de_sifilis",
  "nombre": "Tratamiento de sifilis",
  "tipo": "N",
  "len": 1,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3",
   "4"
  ],
  "x": {
   "na_valor": "4",
   "na_si": [
    "igual",
    "sifilis_confirmada",
    [
     "NO"
    ]
   ]
  }
 },
 {
  "num": 167,
  "key": "tratamiento_sifilis_pareja",
  "col": "tratamiento_de_sifilis_a_la_pareja",
  "nombre": "Tratamiento de sifilis a la pareja",
  "tipo": "N",
  "len": 1,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3"
  ],
  "x": {
   "na_valor": "3",
   "na_si": [
    "igual",
    "sifilis_confirmada",
    [
     "NO"
    ]
   ]
  }
 },
 {
  "num": 168,
  "key": "vih_materno",
  "col": "vih_materno_confirmado",
  "nombre": "Vih materno confirmado",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 169,
  "key": "fecha_anticonceptivo",
  "col": "fecha_suministro_metodo_planificacion_familiar_post_evento_obstetrico",
  "nombre": "Fecha suministro de anticonceptivo post evento obstetrico",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01"
  }
 },
 {
  "num": 170,
  "key": "metodo_anticonceptivo",
  "col": "metodo_de_planificacion_familiar_post_evento_obstetrico",
  "nombre": "Suministro de metodo anticonceptivo post evento obstetrico",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "0",
   "1",
   "2",
   "3",
   "4",
   "5",
   "6",
   "7",
   "8",
   "9",
   "10",
   "13",
   "14"
  ]
 },
 {
  "num": 171,
  "key": "vitalidad_madre",
  "col": "vitalidad_de_la_madre_al_final_del_embarazo",
  "nombre": "Vitalidad de la madre al final del embarazo",
  "tipo": "N",
  "len": 1,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3"
  ]
 },
 {
  "num": 172,
  "key": "vitalidad_rn",
  "col": "vitalidad_del_recien_nacido",
  "nombre": "Vitalidad del recien nacido",
  "tipo": "N",
  "len": 1,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3"
  ]
 },
 {
  "num": 173,
  "key": "tuberculosis",
  "col": "persona_con_tuberculosis_activa",
  "nombre": "Persona con tuberculosis activa",
  "tipo": "N",
  "len": 1,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3"
  ]
 },
 {
  "num": 174,
  "key": "fecha_tamizaje_vih_parto",
  "col": "fecha_de_realizacion_de_tamizaje_para_vih_en_el_momento_del_parto",
  "nombre": "Fecha de realizacion de tamizaje para vih en el momento del parto",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "na": "1845-01-01"
  }
 },
 {
  "num": 175,
  "key": "fecha_dx_tuberculosis",
  "col": "fecha_del_diagnostico_de_la_tuberculosis_activa_reportada",
  "nombre": "Fecha del diagnostico de la tuberculosis activa reportada",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "tuberculosis",
    [
     "1",
     "2"
    ]
   ]
  }
 },
 {
  "num": 176,
  "key": "fecha_tamizaje_vih_tb",
  "col": "fecha_de_realizacion_de_tamizaje_para_vih_a_la_persona_con_tuberculosis_activa_reportada",
  "nombre": "Fecha de realizacion de tamizaje para vih a la persona con tuberculosis activa",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "tuberculosis",
    [
     "1",
     "2"
    ]
   ]
  }
 },
 {
  "num": 177,
  "key": "fecha_muerte",
  "col": "fecha_de_muerte",
  "nombre": "Fecha de muerte",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "vitalidad_madre",
    [
     "2"
    ]
   ],
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 178,
  "key": "causa_muerte",
  "col": "causa_de_muerte",
  "nombre": "Causa de Muerte",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3",
   "4",
   "55"
  ]
 },
 {
  "num": 179,
  "key": "consulta_1v_ginecologo",
  "col": "consulta_primera_vez_por_ginecologo",
  "nombre": "Consulta primera vez por ginecologo",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 180,
  "key": "control_gineco1",
  "col": "control_por_ginecologia_1",
  "nombre": "Control por ginecologia 1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 181,
  "key": "tipo_gineco1",
  "col": "tipo_consulta_control_por_ginecologia_1",
  "nombre": "Tipo Consulta Control por ginecologia 1",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco1"
   ]
  }
 },
 {
  "num": 182,
  "key": "control_gineco2",
  "col": "control_por_ginecologia_2",
  "nombre": "Control por ginecologia 2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_gineco1"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 183,
  "key": "tipo_gineco2",
  "col": "tipo_consulta_control_por_ginecologia_2",
  "nombre": "Tipo Consulta Control por ginecologia 2",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco2"
   ]
  }
 },
 {
  "num": 184,
  "key": "control_gineco3",
  "col": "control_por_ginecologia_3",
  "nombre": "Control por ginecologia 3",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_gineco1",
    "control_gineco2"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 185,
  "key": "tipo_gineco3",
  "col": "tipo_consulta_control_por_ginecologia_3",
  "nombre": "Tipo Consulta Control por ginecologia 3",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco3"
   ]
  }
 },
 {
  "num": 186,
  "key": "control_gineco4",
  "col": "control_por_ginecologia_4",
  "nombre": "Control por ginecologia 4",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_gineco1",
    "control_gineco2",
    "control_gineco3"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 187,
  "key": "tipo_gineco4",
  "col": "tipo_consulta_control_por_ginecologia_4",
  "nombre": "Tipo Consulta Control por ginecologia 4",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco4"
   ]
  }
 },
 {
  "num": 188,
  "key": "control_gineco5",
  "col": "control_por_ginecologia_5",
  "nombre": "Control por ginecologia 5",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_gineco1",
    "control_gineco2",
    "control_gineco3",
    "control_gineco4"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 189,
  "key": "tipo_gineco5",
  "col": "tipo_consulta_control_por_ginecologia_5",
  "nombre": "Tipo Consulta Control por ginecologia 5",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco5"
   ]
  }
 },
 {
  "num": 190,
  "key": "control_gineco6",
  "col": "control_por_ginecologia_6",
  "nombre": "Control por ginecologia 6",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_gineco1",
    "control_gineco2",
    "control_gineco3",
    "control_gineco4",
    "control_gineco5"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 191,
  "key": "tipo_gineco6",
  "col": "tipo_consulta_control_por_ginecologia_6",
  "nombre": "Tipo Consulta Control por ginecologia 6",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco6"
   ]
  }
 },
 {
  "num": 192,
  "key": "control_gineco7",
  "col": "control_por_ginecologia_7",
  "nombre": "Control por ginecologia 7",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_gineco1",
    "control_gineco2",
    "control_gineco3",
    "control_gineco4",
    "control_gineco5",
    "control_gineco6"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 193,
  "key": "tipo_gineco7",
  "col": "tipo_consulta_control_por_ginecologia_7",
  "nombre": "Tipo Consulta Control por ginecologia 7",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_gineco7"
   ]
  }
 },
 {
  "num": 194,
  "key": "primera_vez_med_general",
  "col": "primera_vez_medicina_general",
  "nombre": "Primera vez Medicina General",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 195,
  "key": "tipo_med_general1",
  "col": "tipo_de_consulta_primera_vez_medicina_general",
  "nombre": "Tipo de consulta Primera vez Medicina General",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "primera_vez_med_general"
   ]
  }
 },
 {
  "num": 196,
  "key": "control2_med_general",
  "col": "control_2_medicina_general",
  "nombre": "Control 2 Medicina General",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "primera_vez_med_general"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 197,
  "key": "tipo_med_general2",
  "col": "tipo_de_consulta_medicina_general_2",
  "nombre": "Tipo de consulta Medicina General 2",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control2_med_general"
   ]
  }
 },
 {
  "num": 198,
  "key": "control_nutricion1",
  "col": "control_nutricion1",
  "nombre": "Control Nutricion1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 199,
  "key": "tipo_nutricion1",
  "col": "tipo_de_consulta_nutricion_1",
  "nombre": "Tipo de consulta nutricion 1",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_nutricion1"
   ]
  }
 },
 {
  "num": 200,
  "key": "alteracion_nutricional1",
  "col": "alteracion_nutricional_consulta1",
  "nombre": "Alteracion nutricional consulta1",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_nutricion1"
   ]
  }
 },
 {
  "num": 201,
  "key": "control_nutricion2",
  "col": "control_nutricion2",
  "nombre": "Control Nutricion2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_nutricion1"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 202,
  "key": "tipo_nutricion2",
  "col": "tipo_de_consulta_nutricion_2",
  "nombre": "Tipo de consulta nutricion 2",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_nutricion2"
   ]
  }
 },
 {
  "num": 203,
  "key": "alteracion_nutricional2",
  "col": "alteracion_nutricional_consulta2",
  "nombre": "Alteracion nutricional consulta2",
  "tipo": "T",
  "len": 2,
  "req": "COND",
  "vals": [
   "SI",
   "NO"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_nutricion2"
   ]
  }
 },
 {
  "num": 204,
  "key": "control_psicologia1",
  "col": "control_psicologia1",
  "nombre": "Control Psicologia1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 205,
  "key": "tipo_psicologia1",
  "col": "tipo_de_consulta_psicologia1",
  "nombre": "Tipo de consulta Psicologia1",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_psicologia1"
   ]
  }
 },
 {
  "num": 206,
  "key": "control_psicologia2",
  "col": "control_psicologia2",
  "nombre": "Control Psicologia2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_psicologia1"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 207,
  "key": "tipo_psicologia2",
  "col": "tipo_de_consulta_psicologia2",
  "nombre": "Tipo de consulta Psicologia2",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_psicologia2"
   ]
  }
 },
 {
  "num": 208,
  "key": "control_perinatologo1",
  "col": "control_perinatologo1",
  "nombre": "Control Perinatologo1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 209,
  "key": "tipo_perinatologo1",
  "col": "tipo_de_consulta_perinatologo1",
  "nombre": "Tipo de consulta Perinatologo1",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_perinatologo1"
   ]
  }
 },
 {
  "num": 210,
  "key": "control_perinatologo2",
  "col": "control_perinatologo2",
  "nombre": "Control Perinatologo2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_perinatologo1"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 211,
  "key": "tipo_perinatologo2",
  "col": "tipo_de_consulta_perinatologo2",
  "nombre": "Tipo de consulta Perinatologo2",
  "tipo": "T",
  "len": 12,
  "req": "COND",
  "vals": [
   "TELECONSULTA",
   "PRESENCIAL",
   "DOMICILIARIA"
  ],
  "x": {
   "cond": [
    "lleno",
    "control_perinatologo2"
   ]
  }
 },
 {
  "num": 212,
  "key": "control_enfermeria1",
  "col": "control_enfermeria_1",
  "nombre": "Control Enfermeria 1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 213,
  "key": "control_enfermeria2",
  "col": "control_enfermeria_2",
  "nombre": "Control Enfermeria 2",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_enfermeria1"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 214,
  "key": "control_enfermeria3",
  "col": "control_enfermeria_3",
  "nombre": "Control Enfermeria 3",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum",
    "control_enfermeria1",
    "control_enfermeria2"
   ],
   "no_futura": true,
   "sec": true
  }
 },
 {
  "num": 215,
  "key": "control_odontologia1",
  "col": "control_odontologia_1",
  "nombre": "Control Odontologia 1",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "no_futura": true
  }
 },
 {
  "num": 216,
  "key": "semana_epidemiologica",
  "col": "semana_epidemiologica",
  "nombre": "Semana epidemiologica",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "x": {
   "min": 1,
   "max": 52
  }
 },
 {
  "num": 217,
  "key": "antecedentes_preclampsia",
  "col": "gestante_antecedentes_preeclampsia",
  "nombre": "Gestante antecedentes preclampsia",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 218,
  "key": "riesgo_preeclampsia",
  "col": "riesgo_preeclampsia",
  "nombre": "Riesgo preeclampsia",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "4",
   "5"
  ]
 },
 {
  "num": 219,
  "key": "consulta_urgencias_30d",
  "col": "consulta_urgencia_ultimos_30_dias",
  "nombre": "Consulta urgencia ultimos 30 dias",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 220,
  "key": "egreso_hospitalizacion_30d",
  "col": "gestante_egreso_hospitalizacion_ultimos_30_dias",
  "nombre": "Gestante egreso hospitalizacion ultimos 30 dias",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 221,
  "key": "criterio_mme",
  "col": "gestante_cumple_al_menos_1_criterio_mme",
  "nombre": "Gestante cumple al menos 1 criterio MME",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO"
  ]
 },
 {
  "num": 222,
  "key": "riesgo_tromboembolismo",
  "col": "gestante_riesgo_tromboembolismo",
  "nombre": "Gestante riesgo tromboembolismo",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "4",
   "5",
   "21"
  ]
 },
 {
  "num": 223,
  "key": "fecha_control_puerperio",
  "col": "fecha_control_puerperio",
  "nombre": "Fecha control puerperio",
  "tipo": "F",
  "len": 10,
  "req": "NO",
  "x": {
   "mayor_que": [
    "fum"
   ]
  }
 },
 {
  "num": 224,
  "key": "laboratorios_alterados",
  "col": "laboratorios_alterados",
  "nombre": "Laboratorios alterados",
  "tipo": "T",
  "len": 2,
  "req": "SI",
  "vals": [
   "SI",
   "NO",
   "RIESGO NO EVALUADO"
  ]
 },
 {
  "num": 225,
  "key": "seguimiento_posevento1",
  "col": "seguimiento_posevento_obstetrico1_medico_especialista_casos_morbilidad_materna_extrema",
  "nombre": "Seguimiento posevento obstetrico o 1 medico especialista casos MME",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01"
  }
 },
 {
  "num": 226,
  "key": "seguimiento_posevento2",
  "col": "seguimiento_posevento_obstetrico2_medico_especialista_casos_morbilidad_materna_extrema",
  "nombre": "Seguimiento posevento obstetrico o 2 medico especialista casos MME",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01"
  }
 },
 {
  "num": 227,
  "key": "seguimiento_posevento3",
  "col": "seguimiento_posevento_obstetrico3_medico_especialista_casos_morbilidad_materna_extrema",
  "nombre": "Seguimiento posevento obstetrico o 3 medico especialista casos MME",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01"
  }
 },
 {
  "num": 228,
  "key": "seguimiento_posevento4",
  "col": "seguimiento_posevento_obstetrico4_medico_especialista_casos_morbilidad_materna_extrema",
  "nombre": "Seguimiento posevento obstetrico o 4 medico especialista casos MME",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01"
  }
 },
 {
  "num": 229,
  "key": "nacionalidad",
  "col": "nacionalidad_procedencia",
  "nombre": "Nacionalidad procedencia",
  "tipo": "A",
  "len": 3,
  "req": "SI",
  "x": {
   "solo_digitos": true
  }
 },
 {
  "num": 230,
  "key": "codigo_ocupacion",
  "col": "codigo_ocupacion",
  "nombre": "Codigo ocupacion",
  "tipo": "N",
  "len": 4,
  "req": "SI"
 },
 {
  "num": 231,
  "key": "nivel_educativo",
  "col": "nivel_educativo",
  "nombre": "Nivel educativo",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "x": {
   "min": 1,
   "max": 13
  }
 },
 {
  "num": 232,
  "key": "pertenencia_etnica",
  "col": "codigo_pertenencia_etnica",
  "nombre": "Codigo pertenencia etnica",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "01",
   "02",
   "03",
   "04",
   "05",
   "06",
   "99"
  ],
  "x": {
   "zfill": true
  }
 },
 {
  "num": 233,
  "key": "fecha_asa",
  "col": "fecha_de_inicio_de_acido_acetilsalicilico_asa",
  "nombre": "Fecha de inicio de acido acetilsalicilico - ASA",
  "tipo": "F",
  "len": 10,
  "req": "SI",
  "x": {
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01"
  }
 },
 {
  "num": 234,
  "key": "acido_folico",
  "col": "suministro_de_acido_folico_en_el_control_prenatal",
  "nombre": "Suministro de acido folico en el control prenatal",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "0",
   "1",
   "21"
  ]
 },
 {
  "num": 235,
  "key": "sulfato_ferroso",
  "col": "suministro_de_sulfato_ferroso_en_el_control_prenatal",
  "nombre": "Suministro de sulfato ferroso en el control prenatal",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "0",
   "1",
   "21"
  ]
 },
 {
  "num": 236,
  "key": "carbonato_calcio",
  "col": "suministro_de_carbonato_de_calcio_en_el_control_prenatal",
  "nombre": "Suministro de carbonato de calcio en el control prenatal",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "0",
   "1",
   "21"
  ]
 },
 {
  "num": 237,
  "key": "fecha_salida_parto",
  "col": "fecha_de_salida_de_atencion_parto_o_cesarea",
  "nombre": "Fecha de salida de atencion parto o cesarea",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "lleno",
    "via_terminacion"
   ],
   "mayor_que": [
    "fum"
   ],
   "na": "1845-01-01",
   "na_si": [
    "igual",
    "via_terminacion",
    [
     "ABORTO"
    ]
   ]
  }
 },
 {
  "num": 238,
  "key": "municipio",
  "col": "municipio_de_atencion_del_control_prenatal",
  "nombre": "Municipio de Atencion del control prenatal",
  "tipo": "N",
  "len": 5,
  "req": "SI",
  "x": {
   "zfill": true
  }
 },
 {
  "num": 239,
  "key": "tipo_caso",
  "col": "tipo_de_caso",
  "nombre": "Tipo de caso",
  "tipo": "N",
  "len": 2,
  "req": "SI",
  "vals": [
   "1",
   "2",
   "3",
   "4",
   "5",
   "6",
   "7",
   "8",
   "9",
   "10",
   "11",
   "12",
   "21"
  ]
 },
 {
  "num": 240,
  "key": "fecha_seguimiento",
  "col": "fecha_de_seguimiento",
  "nombre": "Fecha de seguimiento",
  "tipo": "F",
  "len": 10,
  "req": "COND",
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 241,
  "key": "tipo_seguimiento",
  "col": "tipo_de_seguimiento",
  "nombre": "Tipo de seguimiento",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2",
   "3",
   "4"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 242,
  "key": "seg_cita_medicina",
  "col": "seguimiento_asignacion_de_cita_por_profesional_de_medicina",
  "nombre": "Seguimiento - Asignacion de cita por profesional de medicina",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 243,
  "key": "seg_cita_especializada",
  "col": "seguimiento_asignacion_de_cita_por_medicina_especializada",
  "nombre": "Seguimiento - Asignacion de cita por medicina especializada",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 244,
  "key": "seg_referencia",
  "col": "seguimiento_referencia_a_institucion_de_mayor_complejidad",
  "nombre": "Seguimiento - Referencia a institucion de mayor complejidad",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 245,
  "key": "seg_cita_procedimientos",
  "col": "seguimiento_asignacion_de_cita_para_procedimientos",
  "nombre": "Seguimiento - Asignacion de cita para procedimientos",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 246,
  "key": "seg_canalizacion_lab",
  "col": "seguimiento_canalizacion_a_entrega_de_resultados_de_laboratorio",
  "nombre": "Seguimiento - Canalizacion a entrega de resultados de laboratorio",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 247,
  "key": "seg_entrega_medicamentos",
  "col": "seguimiento_entrega_de_medicamentos",
  "nombre": "Seguimiento - Entrega de medicamentos",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 },
 {
  "num": 248,
  "key": "seg_informacion_cuidado",
  "col": "seguimiento_informacion_para_el_cuidado_de_la_salud",
  "nombre": "Seguimiento - Informacion para el cuidado de la salud",
  "tipo": "N",
  "len": 1,
  "req": "COND",
  "vals": [
   "1",
   "2"
  ],
  "x": {
   "cond": [
    "igual",
    "tipo_caso",
    [
     "1",
     "2",
     "3",
     "4",
     "5",
     "6",
     "7",
     "8",
     "9",
     "10",
     "11",
     "12"
    ]
   ]
  }
 }
];

export const COLUMNAS = CAMPOS.map(c => c.col);
export const POR_KEY = Object.fromEntries(CAMPOS.map(c => [c.key, c]));
