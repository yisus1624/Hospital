// Generado desde docs/instructivo-v5.json. No editar a mano.
//
// Para cada campo: la columna que ocupa en el archivo (numero y letra de
// Excel) y una frase en español que dice como se llena, sacada de lo que
// el propio instructivo permite en ese campo.
export const AYUDA = {
"fecha_de_cargue": {
"col": 1,
"excel": "A",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. No puede ser una fecha futura.",
"nombre": "Fecha de cargue",
"es": "la fecha de cargue del archivo",
"ej": "2026-08-15"
},
"fecha_inicial_del_periodo_de_la_informacion_reportada": {
"col": 2,
"excel": "B",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. No puede ser una fecha futura.",
"nombre": "Fecha inicial del periodo reportado",
"es": "la fecha de inicio del período de información reportada",
"ej": "2026-08-15"
},
"fecha_final_del_periodo_de_la_informacion_reportada": {
"col": 3,
"excel": "C",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a Fecha inicial del periodo reportado. No puede ser una fecha futura.",
"nombre": "Fecha final del periodo reportado",
"es": "la fecha final del periodo de información reportada y debe corresponder a la fecha de corte del nombre del archivo",
"ej": "2026-08-15"
},
"tipo": {
"col": 4,
"excel": "D",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): AS, DE, MS, PT, CC, CE, CD, PA, SC, PE, RC, TI, CN.",
"nombre": "Tipo de identificacion",
"es": "el tipo de identificación de la gestante",
"ej": "AS"
},
"documento": {
"col": 5,
"excel": "E",
"como": "Escribe solo números, sin puntos ni guiones. Máximo 17 dígitos.",
"nombre": "Documento",
"es": "el número de documento de identificación de la gestante teniendo en cuenta el tipo de identificación registrado del camp",
"ej": "1234567890"
},
"nombre_1": {
"col": 6,
"excel": "F",
"como": "Escribe el texto en MAYÚSCULAS, sin tildes ni símbolos. Máximo 60 caracteres.",
"nombre": "Nombre 1",
"es": "el primer nombre de la gestante"
},
"nombre_2": {
"col": 7,
"excel": "G",
"como": "Escribe el texto en MAYÚSCULAS, sin tildes ni símbolos. Máximo 60 caracteres.",
"nombre": "Nombre 2",
"es": "el segundo nombre de la gestante"
},
"apellido_1": {
"col": 8,
"excel": "H",
"como": "Escribe el texto en MAYÚSCULAS, sin tildes ni símbolos. Máximo 60 caracteres.",
"nombre": "Apellido 1",
"es": "el primer apellido de la gestante"
},
"apellido_2": {
"col": 9,
"excel": "I",
"como": "Escribe el texto en MAYÚSCULAS, sin tildes ni símbolos. Máximo 60 caracteres.",
"nombre": "Apellido 2",
"es": "el segundo apellido de la gestante"
},
"telefono": {
"col": 10,
"excel": "J",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Telefono",
"es": "el número de teléfono de la gestante",
"ej": "2"
},
"talla": {
"col": 11,
"excel": "K",
"como": "Escribe un número entero, sin puntos ni comas. Entre 90 y 200.",
"nombre": "Talla (cm)",
"es": "la talla de la gestante (en centímetros)",
"ej": "2"
},
"peso_al_inicio_de_la_gestacion": {
"col": 12,
"excel": "L",
"como": "Escribe un número con hasta 1 decimal, usando punto decimal. Entre 30 y 120.",
"nombre": "Peso al inicio de la gestacion",
"es": "el peso al inicio de la gestación de la gestante",
"ej": "58.5"
},
"gravida": {
"col": 13,
"excel": "M",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Gravida",
"es": "la grávida de la gestante",
"ej": "2"
},
"partos": {
"col": 14,
"excel": "N",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Partos",
"es": "el número de partos vaginales que haya tenido la gestante",
"ej": "2"
},
"cesarea": {
"col": 15,
"excel": "O",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Cesareas",
"es": "el número de cesáreas que haya tenido la gestante",
"ej": "2"
},
"aborto": {
"col": 16,
"excel": "P",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Abortos",
"es": "el número de abortos o IVE que haya tenido la gestante",
"ej": "2"
},
"ectopicos": {
"col": 17,
"excel": "Q",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Ectopicos",
"es": "el número de embarazos ectópicos que haya tenido la gestante",
"ej": "2"
},
"vivos": {
"col": 18,
"excel": "R",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Vivos",
"es": "el número de hijos nacidos vivos que tenga la gestante",
"ej": "2"
},
"muertos": {
"col": 19,
"excel": "S",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Muertos",
"es": "el número de hijos muertos que haya tenido la gestante",
"ej": "2"
},
"fum": {
"col": 20,
"excel": "T",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. No puede ser una fecha futura.",
"nombre": "FUM",
"es": "la fecha última de menstruación",
"ej": "2026-08-15"
},
"fpp": {
"col": 21,
"excel": "U",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "FPP",
"es": "la fecha probable de parto",
"ej": "2026-08-15"
},
"fecha_de_ingreso_al_programa_de_atencion_integral": {
"col": 22,
"excel": "V",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha ingreso RIAMP nivel primario. No puede ser una fecha futura.",
"nombre": "Fecha de ingreso al programa de atencion integral",
"es": "la fecha de ingreso al programa de atención integral",
"ej": "2026-08-15"
},
"nit": {
"col": 23,
"excel": "W",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "NIT",
"es": "el NIT del prestador",
"ej": "2"
},
"nombre_ips": {
"col": 24,
"excel": "X",
"como": "Escribe el texto en MAYÚSCULAS, sin tildes ni símbolos. Máximo 60 caracteres.",
"nombre": "Nombre IPS",
"es": "el nombre de la IPS"
},
"numero_de_documento_de_profesional_que_realiza_la_primera_atencion": {
"col": 25,
"excel": "Y",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Documento del profesional que realiza la primera atencion",
"es": "el número de documento del profesional que realiza la atención",
"ej": "2"
},
"semana_gestacional": {
"col": 26,
"excel": "Z",
"como": "Escribe un número con hasta 1 decimal, usando punto decimal. Máximo 42.",
"nombre": "Semana gestacional",
"es": "la edad gestacional al ingresar a la IPS de atención primaria",
"ej": "58.5"
},
"riesgo": {
"col": 27,
"excel": "AA",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): ALTO, BAJO.",
"nombre": "Riesgo",
"es": "el riesgo gestacional evaluado en el último control prenatal",
"ej": "ALTO"
},
"fecha_ingreso_riamp_nivel_primario": {
"col": 28,
"excel": "AB",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha ingreso RIAMP nivel primario",
"es": "la fecha de ingreso RIAMP nivel primario",
"ej": "2026-08-15"
},
"grupo_sanguineo": {
"col": 29,
"excel": "AC",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): A, B, O, AB.",
"nombre": "Grupo sanguineo",
"es": "el grupo sanguíneo de la gestante",
"ej": "A"
},
"rh": {
"col": 30,
"excel": "AD",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "RH",
"es": "el RH del grupo sanguíneo de la gestante",
"ej": "POSITIVO",
"padre": {
"nombre": "Grupo sanguineo",
"excel": "AC",
"col": 29
}
},
"fecha_grupo_sanguineo": {
"col": 31,
"excel": "AE",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha grupo sanguineo",
"es": "l a f e c h a d e l g r u po sanguíneo",
"ej": "2026-08-15",
"padre": {
"nombre": "Grupo sanguineo",
"excel": "AC",
"col": 29
}
},
"coombs_indirecto": {
"col": 32,
"excel": "AF",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Coombs indirecto",
"es": "el resultado del Coombs indirecto",
"ej": "POSITIVO"
},
"fecha_coombs_indirecto": {
"col": 33,
"excel": "AG",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Coombs indirecto",
"es": "la fecha de realización del Coombs indirecto",
"ej": "2026-08-15",
"padre": {
"nombre": "Coombs indirecto",
"excel": "AF",
"col": 32
}
},
"glicemia_en_ayunas": {
"col": 34,
"excel": "AH",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Glicemia en ayunas",
"es": "el resultado de la glicemia en ayunas",
"ej": "2"
},
"fecha_glicemia_en_ayunas": {
"col": 35,
"excel": "AI",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha glicemia en ayunas",
"es": "la fecha de la glicemia en ayuna",
"ej": "2026-08-15",
"padre": {
"nombre": "Glicemia en ayunas",
"excel": "AH",
"col": 34
}
},
"hepatitis_b": {
"col": 36,
"excel": "AJ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): REACTIVO, NO REACTIVO.",
"nombre": "Hepatitis b",
"es": "el resultado de hepatitis b",
"ej": "REACTIVO"
},
"fecha_hepatitis_b": {
"col": 37,
"excel": "AK",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Hepatitis b",
"es": "la fecha de realización de hepatitis b",
"ej": "2026-08-15",
"padre": {
"nombre": "Hepatitis b",
"excel": "AJ",
"col": 36
}
},
"toxoplasma_igg": {
"col": 38,
"excel": "AL",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGG",
"es": "el resultado de toxoplasma IGG",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igg": {
"col": 39,
"excel": "AM",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Toxoplasma IGG",
"es": "la fecha de toxoplasma IGG",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGG",
"excel": "AL",
"col": 38
}
},
"toxoplasma_igm": {
"col": 40,
"excel": "AN",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM",
"es": "el resultado de toxoplasma IGM",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm": {
"col": 41,
"excel": "AO",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM",
"es": "la fecha de toxoplasma IGM",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM",
"excel": "AN",
"col": 40
}
},
"toxoplasma_igm_por_eia_para_negativos1": {
"col": 42,
"excel": "AP",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos1",
"es": "el resultado de toxoplasma IGM por EIA para negativos1",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos1": {
"col": 43,
"excel": "AQ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos1",
"es": "la fecha de toxoplasma IGM por EIA para negativos1",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos1",
"excel": "AP",
"col": 42
}
},
"toxoplasma_igm_por_eia_para_negativos2": {
"col": 44,
"excel": "AR",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos2",
"es": "el resultado de toxoplasma IGM por EIA para negativos2",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos2": {
"col": 45,
"excel": "AS",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos2",
"es": "la fecha de toxoplasma IGM por EIA para negativos2",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos2",
"excel": "AR",
"col": 44
}
},
"toxoplasma_igm_por_eia_para_negativos3": {
"col": 46,
"excel": "AT",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos3",
"es": "el resultado de toxoplasma IGM por EIA para negativos3",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos3": {
"col": 47,
"excel": "AU",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos3",
"es": "la fecha de toxoplasma IGM por EIA para negativos3",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos3",
"excel": "AT",
"col": 46
}
},
"toxoplasma_igm_por_eia_para_negativos4": {
"col": 48,
"excel": "AV",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos4",
"es": "el resultado de toxoplasma IGM por EIA para negativos4",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos4": {
"col": 49,
"excel": "AW",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos4",
"es": "la fecha de toxoplasma IGM por EIA para negativos4",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos4",
"excel": "AV",
"col": 48
}
},
"toxoplasma_igm_por_eia_para_negativos5": {
"col": 50,
"excel": "AX",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos5",
"es": "el resultado de toxoplasma IGM por EIA para negativos5",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos5": {
"col": 51,
"excel": "AY",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos5",
"es": "la fecha de toxoplasma IGM por EIA para negativos5",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos5",
"excel": "AX",
"col": 50
}
},
"toxoplasma_igm_por_eia_para_negativos6": {
"col": 52,
"excel": "AZ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos6",
"es": "el resultado de toxoplasma IGM por EIA para negativos6",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos6": {
"col": 53,
"excel": "BA",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos6",
"es": "la fecha de toxoplasma IGM por EIA para negativos6",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos6",
"excel": "AZ",
"col": 52
}
},
"toxoplasma_igm_por_eia_para_negativos7": {
"col": 54,
"excel": "BB",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos7",
"es": "el resultado de toxoplasma IGM por EIA para negativos7",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos7": {
"col": 55,
"excel": "BC",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos7",
"es": "la fecha de toxoplasma IGM por EIA para negativos7",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos7",
"excel": "BB",
"col": 54
}
},
"toxoplasma_igm_por_eia_para_negativos8": {
"col": 56,
"excel": "BD",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Toxoplasma IGM por EIA para negativos8",
"es": "el resultado de toxoplasma IGM por EIA para negativos8",
"ej": "POSITIVO"
},
"fecha_toxoplasma_igm_por_eia_para_negativos8": {
"col": 57,
"excel": "BE",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha toxoplasma IGM por EIA para negativos8",
"es": "la fecha de toxoplasma IGM por EIA para negativos8",
"ej": "2026-08-15",
"padre": {
"nombre": "Toxoplasma IGM por EIA para negativos8",
"excel": "BD",
"col": 56
}
},
"carga_viral": {
"col": 58,
"excel": "BF",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Carga viral",
"es": "el resultado de carga viral",
"ej": "2"
},
"fecha_carga_viral": {
"col": 59,
"excel": "BG",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha carga viral",
"es": "la fecha de carga viral",
"ej": "2026-08-15",
"padre": {
"nombre": "Carga viral",
"excel": "BF",
"col": 58
}
},
"rubeola": {
"col": 60,
"excel": "BH",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Rubeola",
"es": "el resultado de rubeola",
"ej": "POSITIVO"
},
"fecha_rubeola": {
"col": 61,
"excel": "BI",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha rubeola",
"es": "la fecha de rubeola",
"ej": "2026-08-15",
"padre": {
"nombre": "Rubeola",
"excel": "BH",
"col": 60
}
},
"estreptococo_rectal": {
"col": 62,
"excel": "BJ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Estreptococo rectal",
"es": "el resultado de estreptococo rectal",
"ej": "POSITIVO"
},
"fecha_estreptococorectal": {
"col": 63,
"excel": "BK",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha estreptococo rectal",
"es": "fecha estreptococo rectal",
"ej": "2026-08-15",
"padre": {
"nombre": "Estreptococo rectal",
"excel": "BJ",
"col": 62
}
},
"estreptococo_vaginal": {
"col": 64,
"excel": "BL",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Estreptococo vaginal",
"es": "el resultado de estreptococo vaginal",
"ej": "POSITIVO"
},
"fecha_esreptococovaginal": {
"col": 65,
"excel": "BM",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha estreptococo vaginal",
"es": "fecha estreptococo vaginal",
"ej": "2026-08-15",
"padre": {
"nombre": "Estreptococo vaginal",
"excel": "BL",
"col": 64
}
},
"influenzaestacional": {
"col": 66,
"excel": "BN",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Influenza estacional",
"es": "la confirmación o negación de influenza estacional",
"ej": "SI"
},
"fecha_influenza_estacional": {
"col": 67,
"excel": "BO",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha influenza estacional",
"es": "la fecha de influenza estacional",
"ej": "2026-08-15",
"padre": {
"nombre": "Influenza estacional",
"excel": "BN",
"col": 66
}
},
"tdap": {
"col": 68,
"excel": "BP",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Tdap",
"es": "la confirmación o negación de Tdap",
"ej": "SI"
},
"fecha_tdap": {
"col": 69,
"excel": "BQ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Tdap",
"es": "la fecha de Tdap",
"ej": "2026-08-15",
"padre": {
"nombre": "Tdap",
"excel": "BP",
"col": 68
}
},
"antitetanica": {
"col": 70,
"excel": "BR",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Antitetanica",
"es": "la confirmación o negación de antitetánica",
"ej": "SI"
},
"fecha_antitetanica": {
"col": 71,
"excel": "BS",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha antitetanica",
"es": "la fecha de antitetánica",
"ej": "2026-08-15",
"padre": {
"nombre": "Antitetanica",
"excel": "BR",
"col": 70
}
},
"fecha_1_cursopaternidad": {
"col": 72,
"excel": "BT",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Fecha 1 curso paternidad",
"es": "la fecha 1 del curso de paternidad",
"ej": "2026-08-15"
},
"fecha_2_cursopaternidad": {
"col": 73,
"excel": "BU",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha 1 curso paternidad. No puede ser una fecha futura.",
"nombre": "Fecha 2 curso paternidad",
"es": "la fecha 2 del curso de paternidad",
"ej": "2026-08-15"
},
"fecha_3_cursopaternidad": {
"col": 74,
"excel": "BV",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha 1 curso paternidad, Fecha 2 curso paternidad. No puede ser una fecha futura.",
"nombre": "Fecha 3 curso paternidad",
"es": "la fecha 3 del curso de paternidad",
"ej": "2026-08-15"
},
"fecha_4_cursopaternidad": {
"col": 75,
"excel": "BW",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha 1 curso paternidad, Fecha 2 curso paternidad, Fecha 3 curso paternidad. No puede ser una fecha futura.",
"nombre": "Fecha 4 curso paternidad",
"es": "la fecha 4 del curso de paternidad",
"ej": "2026-08-15"
},
"fecha_5_cursopaternidad": {
"col": 76,
"excel": "BX",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha 1 curso paternidad, Fecha 2 curso paternidad, Fecha 3 curso paternidad, Fecha 4 curso paternidad. No puede ser una fecha futura.",
"nombre": "Fecha 5 curso paternidad",
"es": "la fecha 5 del curso de paternidad",
"ej": "2026-08-15"
},
"fecha_6_cursopaternidad": {
"col": 77,
"excel": "BY",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha 1 curso paternidad, Fecha 2 curso paternidad, Fecha 3 curso paternidad, Fecha 4 curso paternidad, Fecha 5 curso paternidad. No puede ser una fecha futura.",
"nombre": "Fecha 6 curso paternidad",
"es": "la fecha 6 del curso de paternidad",
"ej": "2026-08-15"
},
"fecha_7_cursopaternidad": {
"col": 78,
"excel": "BZ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha 1 curso paternidad, Fecha 2 curso paternidad, Fecha 3 curso paternidad, Fecha 4 curso paternidad, Fecha 5 curso paternidad, Fecha 6 curso paternidad. No puede ser una fecha futura.",
"nombre": "Fecha 7 curso paternidad",
"es": "la fecha 7 del curso de paternidad",
"ej": "2026-08-15"
},
"ctog_pre": {
"col": 79,
"excel": "CA",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Ctog pre",
"es": "el resultado Ctog pre",
"ej": "2"
},
"ctog_1hora": {
"col": 80,
"excel": "CB",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Ctog 1hora",
"es": "el resultado Ctog 1hora",
"ej": "2"
},
"ctog_2_h": {
"col": 81,
"excel": "CC",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Ctog 2hora",
"es": "el resultado Ctog 2hora",
"ej": "2"
},
"ctog_fecha": {
"col": 82,
"excel": "CD",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Ctog fecha",
"es": "la fecha ctog",
"ej": "2026-08-15",
"padre": {
"nombre": "Ctog pre",
"excel": "CA",
"col": 79
}
},
"hb": {
"col": 83,
"excel": "CE",
"como": "Escribe un número con hasta 1 decimal, usando punto decimal. Entre 6 y 20.",
"nombre": "Hb",
"es": "el resultado de Hb",
"ej": "58.5"
},
"fecha_hb": {
"col": 84,
"excel": "CF",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha hb",
"es": "la fecha hb",
"ej": "2026-08-15",
"padre": {
"nombre": "Hb",
"excel": "CE",
"col": 83
}
},
"htco": {
"col": 85,
"excel": "CG",
"como": "Escribe un número entero, sin puntos ni comas. Máximo 50.",
"nombre": "Htco",
"es": "el resultado de Htco",
"ej": "2"
},
"fecha_htco": {
"col": 86,
"excel": "CH",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha htco",
"es": "la fecha htco",
"ej": "2026-08-15",
"padre": {
"nombre": "Htco",
"excel": "CG",
"col": 85
}
},
"frotis": {
"col": 87,
"excel": "CI",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): NORMAL, ANORMAL.",
"nombre": "Frotis",
"es": "el resultado de Frotis",
"ej": "NORMAL"
},
"fecha_frotis": {
"col": 88,
"excel": "CJ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha frotis",
"es": "la fecha frotis",
"ej": "2026-08-15",
"padre": {
"nombre": "Frotis",
"excel": "CI",
"col": 87
}
},
"gram_de_orina": {
"col": 89,
"excel": "CK",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Gram de orina",
"es": "la confirmación o negación de Gram de orina",
"ej": "SI"
},
"fecha_gram_de_orina": {
"col": 90,
"excel": "CL",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha gram de orina",
"es": "la fecha gram de orina",
"ej": "2026-08-15",
"padre": {
"nombre": "Gram de orina",
"excel": "CK",
"col": 89
}
},
"parcial_orina": {
"col": 91,
"excel": "CM",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Parcial orina",
"es": "la confirmación o negación de Parcial de orina",
"ej": "SI"
},
"fecha_parcial_orina": {
"col": 92,
"excel": "CN",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha parcial orina",
"es": "la fecha parcial orina",
"ej": "2026-08-15",
"padre": {
"nombre": "Parcial orina",
"excel": "CM",
"col": 91
}
},
"carga_viral1": {
"col": 93,
"excel": "CO",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Carga viral1",
"es": "el resultado de carga viral1",
"ej": "2"
},
"fecha_carga_viral1": {
"col": 94,
"excel": "CP",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha carga viral1",
"es": "la fecha de carga viral1",
"ej": "2026-08-15",
"padre": {
"nombre": "Carga viral1",
"excel": "CO",
"col": 93
}
},
"tipo_de_estudio_prueba_rapida_o_vdrl": {
"col": 95,
"excel": "CQ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): PRUEBA RAPIDA, VDRL.",
"nombre": "Tipo de estudio prueba rapida1 o vdrl1",
"es": "Tipo de estudio prueba rapida1 o vdrl1",
"ej": "PRUEBA RAPIDA"
},
"vdrl_o_prueba_rapida_sifilis": {
"col": 96,
"excel": "CR",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, REACTIVO, NO REACTIVO.",
"nombre": "Vdrl1 o prueba rapida1 sifilis",
"es": "el resultado de Vdrl1 o prueba rapida1 sífilis dependiendo de Tipo de estudio prueba rapida1 o vdrl1",
"ej": "POSITIVO",
"padre": {
"nombre": "Tipo de estudio prueba rapida1 o vdrl1",
"excel": "CQ",
"col": 95
}
},
"fecha_vdrl1_o_prueba_rapida1": {
"col": 97,
"excel": "CS",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha vdrl1 o prueba rapida1",
"es": "la fecha de vdrl1 o prueba rapida1",
"ej": "2026-08-15",
"padre": {
"nombre": "Tipo de estudio prueba rapida1 o vdrl1",
"excel": "CQ",
"col": 95
}
},
"urocultivo1": {
"col": 98,
"excel": "CT",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, INDETECTABLE.",
"nombre": "Urocultivo1",
"es": "la confirmación o negación de Urocultivo1",
"ej": "POSITIVO"
},
"fecha_urocultivo1": {
"col": 99,
"excel": "CU",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Urocultivo1",
"es": "la fecha de urocultivo1",
"ej": "2026-08-15",
"padre": {
"nombre": "Urocultivo1",
"excel": "CT",
"col": 98
}
},
"ecografia1_translucencia_nucal": {
"col": 100,
"excel": "CV",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Ecografia1 (translucencia nucal)",
"es": "la confirmación o negación de Ecografia1",
"ej": "SI"
},
"fecha_ecografia1": {
"col": 101,
"excel": "CW",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha ecografia1",
"es": "la fecha ecografía1",
"ej": "2026-08-15",
"padre": {
"nombre": "Ecografia1 (translucencia nucal)",
"excel": "CV",
"col": 100
}
},
"anormalidades_ecografia1": {
"col": 102,
"excel": "CX",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Anormalidades ecografia1",
"es": "la confirmación o negación de anormalidades ecografia1",
"ej": "SI",
"padre": {
"nombre": "Ecografia1 (translucencia nucal)",
"excel": "CV",
"col": 100
}
},
"semana_gestacion_por_ecografia": {
"col": 103,
"excel": "CY",
"como": "Escribe un número con hasta 1 decimal, usando punto decimal. Máximo 42.",
"nombre": "Semana gestacion por ecografia",
"es": "la semana gestación por ecografía",
"ej": "58.5",
"padre": {
"nombre": "Ecografia1 (translucencia nucal)",
"excel": "CV",
"col": 100
}
},
"urocultivo_post1": {
"col": 104,
"excel": "CZ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, INDETECTABLE.",
"nombre": "Urocultivo_post1",
"es": "la confirmación o negación de urocultivo post1",
"ej": "POSITIVO"
},
"fecha_urocultivo_post1": {
"col": 105,
"excel": "DA",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Urocultivo_post1",
"es": "la fecha urocultivo post1",
"ej": "2026-08-15",
"padre": {
"nombre": "Urocultivo_post1",
"excel": "CZ",
"col": 104
}
},
"fecha_asesoria_pre_test_vih_1": {
"col": 106,
"excel": "DB",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha asesoria pre test vih 1",
"es": "la fecha asesoría pre test vih1",
"ej": "2026-08-15"
},
"acepta_prueba_1_vih": {
"col": 107,
"excel": "DC",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Acepta prueba 1 vih",
"es": "la confirmación o negación de acepta prueba vih1",
"ej": "SI"
},
"fecha_asesoria_post_test_vih_1": {
"col": 108,
"excel": "DD",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Fecha asesoria pre test vih 1.",
"nombre": "Fecha asesoria post test vih 1",
"es": "la fecha asesoría post test vih1",
"ej": "2026-08-15"
},
"resultado_prueba_rapida_trimestre_1": {
"col": 109,
"excel": "DE",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Resultado prueba rapida trimestre 1",
"es": "el resultado prueba rápida trimestre 1",
"ej": "POSITIVO"
},
"fecha_de_realizacion_de_la_prueba_vih_1": {
"col": 110,
"excel": "DF",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de realizacion de la prueba vih 1",
"es": "la fecha de realización de la prueba vih1",
"ej": "2026-08-15",
"padre": {
"nombre": "Resultado prueba rapida trimestre 1",
"excel": "DE",
"col": 109
}
},
"tipo_de_estudio_prueba_rapida2_o_vdrl2": {
"col": 111,
"excel": "DG",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): PRUEBA RAPIDA, VDRL.",
"nombre": "Tipo de estudio prueba rapida2 o vdrl2",
"es": "Tipo de estudio prueba rapida2 o vdrl2",
"ej": "PRUEBA RAPIDA"
},
"vdrl2_o_prueba_rapida_sifilis2": {
"col": 112,
"excel": "DH",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, REACTIVO, NO REACTIVO.",
"nombre": "Vdrl2 o prueba rapida sifilis2",
"es": "el resultado de Vdrl2 o prueba rapida2 sífilis dependiendo de Tipo de estudio prueba rapida2 o vdrl2",
"ej": "POSITIVO",
"padre": {
"nombre": "Tipo de estudio prueba rapida2 o vdrl2",
"excel": "DG",
"col": 111
}
},
"fecha_vdrl2_o_prueba_rapida2": {
"col": 113,
"excel": "DI",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha vdrl2 o prueba rapida2",
"es": "la fecha de vdrl2 o prueba rapida2",
"ej": "2026-08-15",
"padre": {
"nombre": "Tipo de estudio prueba rapida2 o vdrl2",
"excel": "DG",
"col": 111
}
},
"urocultivo2": {
"col": 114,
"excel": "DJ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, INDETECTABLE.",
"nombre": "Urocultivo2",
"es": "la confirmación o negación de Urocultivo2",
"ej": "POSITIVO"
},
"fecha_urocultivo2": {
"col": 115,
"excel": "DK",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Urocultivo2",
"es": "la fecha de urocultivo2",
"ej": "2026-08-15",
"padre": {
"nombre": "Urocultivo2",
"excel": "DJ",
"col": 114
}
},
"ecografia2_detalle_anatomico": {
"col": 116,
"excel": "DL",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Ecografia2 (detalle anatomico)",
"es": "la confirmación o negación de Ecografia2",
"ej": "SI"
},
"fecha_ecografia2": {
"col": 117,
"excel": "DM",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha ecografia2",
"es": "la fecha ecografía2",
"ej": "2026-08-15",
"padre": {
"nombre": "Ecografia2 (detalle anatomico)",
"excel": "DL",
"col": 116
}
},
"anormalidades_ecografia2": {
"col": 118,
"excel": "DN",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Anormalidades ecografia2",
"es": "la confirmación o negación de anormalidades ecografia2",
"ej": "SI",
"padre": {
"nombre": "Ecografia2 (detalle anatomico)",
"excel": "DL",
"col": 116
}
},
"semana_gestacion_por_ecografia2": {
"col": 119,
"excel": "DO",
"como": "Escribe un número con hasta 1 decimal, usando punto decimal. Máximo 42.",
"nombre": "Semana gestacion por ecografia2",
"es": "la semana gestación por ecografía2",
"ej": "58.5",
"padre": {
"nombre": "Ecografia2 (detalle anatomico)",
"excel": "DL",
"col": 116
}
},
"urocultivo_post2": {
"col": 120,
"excel": "DP",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, INDETECTABLE.",
"nombre": "Urocultivo_post2",
"es": "la confirmación o negación de urocultivo post2",
"ej": "POSITIVO",
"padre": {
"nombre": "Urocultivo2",
"excel": "DJ",
"col": 114
}
},
"fecha_urocultivo_post2": {
"col": 121,
"excel": "DQ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Urocultivo_post2",
"es": "la fecha urocultivo post2",
"ej": "2026-08-15",
"padre": {
"nombre": "Urocultivo_post2",
"excel": "DP",
"col": 120
}
},
"fecha_asesoria_pre_test_vih2": {
"col": 122,
"excel": "DR",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha asesoria pre test vih2",
"es": "la fecha asesoría pre test vih2",
"ej": "2026-08-15"
},
"acepta_prueba_vih2": {
"col": 123,
"excel": "DS",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Acepta prueba vih2",
"es": "la confirmación o negación de acepta prueba vih2",
"ej": "SI"
},
"fecha_asesoria_post_test_vih2": {
"col": 124,
"excel": "DT",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha asesoria post test vih2",
"es": "la fecha asesoría post test vih2",
"ej": "2026-08-15"
},
"resultado_prueba_rapida_trimestre2": {
"col": 125,
"excel": "DU",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Resultado prueba rapida trimestre2",
"es": "el resultado prueba rápida trimestre 2",
"ej": "POSITIVO"
},
"fecha_de_realizacion_de_la_prueba_vih2": {
"col": 126,
"excel": "DV",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de realizacion de la prueba vih2",
"es": "la fecha de realización de la prueba vih2",
"ej": "2026-08-15",
"padre": {
"nombre": "Resultado prueba rapida trimestre2",
"excel": "DU",
"col": 125
}
},
"tipo_de_estudio_prueba_rapida3_o_vdrl3": {
"col": 127,
"excel": "DW",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): PRUEBA RAPIDA, VDRL.",
"nombre": "Tipo de estudio prueba rapida3 o vdrl3",
"es": "Tipo de estudio prueba rapida3 o vdrl3",
"ej": "PRUEBA RAPIDA"
},
"vdrl3_o_prueba_rapida_sifilis3": {
"col": 128,
"excel": "DX",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, REACTIVO, NO REACTIVO.",
"nombre": "Vdrl3 o prueba rapida sifilis3",
"es": "el resultado de Vdrl3 o prueba rapida3 sífilis dependiendo de Tipo de estudio prueba rapida3 o vdrl3",
"ej": "POSITIVO",
"padre": {
"nombre": "Tipo de estudio prueba rapida3 o vdrl3",
"excel": "DW",
"col": 127
}
},
"fecha_vdrl3_o_prueba_rapida3": {
"col": 129,
"excel": "DY",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha vdrl3 o prueba rapida3",
"es": "la fecha de vdrl3 o prueba rapida3",
"ej": "2026-08-15",
"padre": {
"nombre": "Tipo de estudio prueba rapida3 o vdrl3",
"excel": "DW",
"col": 127
}
},
"urocultivo3": {
"col": 130,
"excel": "DZ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, INDETECTABLE.",
"nombre": "Urocultivo3",
"es": "la confirmación o negación de Urocultivo3",
"ej": "POSITIVO"
},
"fecha_urocultivo3": {
"col": 131,
"excel": "EA",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Urocultivo3",
"es": "la fecha de urocultivo3",
"ej": "2026-08-15",
"padre": {
"nombre": "Urocultivo3",
"excel": "DZ",
"col": 130
}
},
"ecografia3_obstetrica": {
"col": 132,
"excel": "EB",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Ecografia3 (OBSTETRICA)",
"es": "la confirmación o negación de Ecografia3",
"ej": "SI"
},
"fecha_ecografia3": {
"col": 133,
"excel": "EC",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha ecografia3",
"es": "la fecha ecografía3",
"ej": "2026-08-15",
"padre": {
"nombre": "Ecografia3 (OBSTETRICA)",
"excel": "EB",
"col": 132
}
},
"anormalidades_ecografia3": {
"col": 134,
"excel": "ED",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Anormalidades ecografia3",
"es": "la confirmación o negación de anormalidades ecografia3",
"ej": "SI",
"padre": {
"nombre": "Ecografia3 (OBSTETRICA)",
"excel": "EB",
"col": 132
}
},
"semana_gestacion_por_ecografia3": {
"col": 135,
"excel": "EE",
"como": "Escribe un número con hasta 1 decimal, usando punto decimal. Máximo 42.",
"nombre": "Semana gestacion por ecografia3",
"es": "la semana gestación por ecografía3",
"ej": "58.5",
"padre": {
"nombre": "Ecografia3 (OBSTETRICA)",
"excel": "EB",
"col": 132
}
},
"urocultivo_post3": {
"col": 136,
"excel": "EF",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Urocultivo_post3",
"es": "la confirmación o negación de urocultivo post3",
"ej": "SI"
},
"fecha_urocultivo_post3": {
"col": 137,
"excel": "EG",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha Urocultivo_post3",
"es": "la fecha urocultivo post3",
"ej": "2026-08-15",
"padre": {
"nombre": "Urocultivo_post3",
"excel": "EF",
"col": 136
}
},
"fecha_asesoria_pre_test_vih3": {
"col": 138,
"excel": "EH",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha asesoria pre test vih3",
"es": "la fecha asesoría pre test vih3",
"ej": "2026-08-15"
},
"acepta_prueba_vih3": {
"col": 139,
"excel": "EI",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Acepta prueba vih3",
"es": "la confirmación o negación de acepta prueba vih3",
"ej": "SI"
},
"fecha_asesoria_post_test_vih3": {
"col": 140,
"excel": "EJ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha asesoria post test vih3",
"es": "la fecha asesoría post test vih3",
"ej": "2026-08-15"
},
"resultado_prueba_rapida_trimestre3": {
"col": 141,
"excel": "EK",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO.",
"nombre": "Resultado prueba rapida trimestre3",
"es": "el resultado prueba rápida trimestre 3",
"ej": "POSITIVO"
},
"fecha_de_realizacion_de_la_prueba_vih3": {
"col": 142,
"excel": "EL",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de realizacion de la prueba vih3",
"es": "la fecha de realización de la prueba vih3",
"ej": "2026-08-15",
"padre": {
"nombre": "Resultado prueba rapida trimestre3",
"excel": "EK",
"col": 141
}
},
"diag1": {
"col": 143,
"excel": "EM",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag1",
"es": "el código del diagnóstico1",
"ej": "O240"
},
"diag2": {
"col": 144,
"excel": "EN",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag2",
"es": "el código del diagnóstico2",
"ej": "O240"
},
"diag3": {
"col": 145,
"excel": "EO",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag3",
"es": "el código del diagnóstico3",
"ej": "O240",
"padre": {
"nombre": "Riesgo",
"excel": "AA",
"col": 27
}
},
"diag4": {
"col": 146,
"excel": "EP",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag4",
"es": "el código del diagnóstico4",
"ej": "O240"
},
"diag5": {
"col": 147,
"excel": "EQ",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag5",
"es": "el código del diagnóstico5",
"ej": "O240"
},
"diag6": {
"col": 148,
"excel": "ER",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag6",
"es": "el código del diagnóstico6",
"ej": "O240"
},
"diag7": {
"col": 149,
"excel": "ES",
"como": "Escribe el código CIE-10, en mayúsculas y sin espacios. Máximo 4 caracteres.",
"nombre": "Diag7",
"es": "el código del diagnóstico7",
"ej": "O240"
},
"fecha_de_terminacion_del_embarazo": {
"col": 150,
"excel": "ET",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de terminacion del embarazo",
"es": "la fecha de terminación del embarazo",
"ej": "2026-08-15"
},
"via_de_terminacion_del_embarazo": {
"col": 151,
"excel": "EU",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): PARTO, CESAREA, ABORTO.",
"nombre": "Via de terminacion del embarazo",
"es": "la vía de terminación del embarazo",
"ej": "PARTO",
"padre": {
"nombre": "Fecha de terminacion del embarazo",
"excel": "ET",
"col": 150
}
},
"frecuencia_cardiaca_fetal_en_numeros": {
"col": 152,
"excel": "EV",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Frecuencia cardiaca fetal",
"es": "la frecuencia cardiaca fetal en números",
"ej": "2"
},
"fecha_frecuencia_cardiaca_fetal": {
"col": 153,
"excel": "EW",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha frecuencia cardiaca fetal",
"es": "la fecha frecuencia cardiaca fetal",
"ej": "2026-08-15",
"padre": {
"nombre": "Frecuencia cardiaca fetal",
"excel": "EV",
"col": 152
}
},
"fecha_asesoria_ive": {
"col": 154,
"excel": "EX",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15.",
"nombre": "Fecha asesoria IVE",
"es": "la fecha de asesoría IVE",
"ej": "2026-08-15"
},
"se_realizo_ive": {
"col": 155,
"excel": "EY",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Se realizo IVE",
"es": "la confirmación o negación de la realización de IVE",
"ej": "SI"
},
"la_usuario_firmo_consentimiento_informado_para_ive": {
"col": 156,
"excel": "EZ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "La usuaria firmo consentimiento informado para IVE",
"es": "la confirmación o negación de la firma de consentimiento informado para IVE",
"ej": "SI",
"padre": {
"nombre": "Se realizo IVE",
"excel": "EY",
"col": 155
}
},
"asesoria_lactancia_materna": {
"col": 157,
"excel": "FA",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Asesoria lactancia materna",
"es": "la confirmación o negación de la asesoría de lactancia materna",
"ej": "SI"
},
"fecha_asesoria_en_planificacion_familiar_durante_la_gestacion": {
"col": 158,
"excel": "FB",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha asesoria en planificacion familiar durante la gestacion",
"es": "la fecha asesoría en planificación familiar durante la gestación",
"ej": "2026-08-15"
},
"malformaciones_congenitas_en_la_gestacion": {
"col": 159,
"excel": "FC",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Malformaciones congenitas en la gestacion",
"es": "la confirmación o negación de malformaciones congénitas en la gestación",
"ej": "SI"
},
"fecha_de_identificacion_de_malformacion": {
"col": 160,
"excel": "FD",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de identificacion de malformacion",
"es": "la fecha de identificación de malformaciones congénitas",
"ej": "2026-08-15",
"padre": {
"nombre": "Malformaciones congenitas en la gestacion",
"excel": "FC",
"col": 159
}
},
"diagnostico_de_chagas_en_la_gestacion": {
"col": 161,
"excel": "FE",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): POSITIVO, NEGATIVO, NO SE REALIZA TAMIZAJE.",
"nombre": "Diagnostico de Chagas en la gestacion",
"es": "el resultado de la tamización",
"ej": "POSITIVO"
},
"fecha_de_identificacion_gestante_con_chagas": {
"col": 162,
"excel": "FF",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de identificacion gestante con Chagas",
"es": "la fecha del tamizaje",
"ej": "2026-08-15"
},
"fecha_seguimiento_gestante_con_chagas": {
"col": 163,
"excel": "FG",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha seguimiento gestante con Chagas",
"es": "la fecha de seguimiento de gestante con Chagas",
"ej": "2026-08-15",
"padre": {
"nombre": "Diagnostico de Chagas en la gestacion",
"excel": "FE",
"col": 161
}
},
"gestante_recibio_tratamiento_para_chagas": {
"col": 164,
"excel": "FH",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Gestante recibio tratamiento para Chagas",
"es": "la confirmación o negación si la gestante recibió tratamiento para Chagas",
"ej": "SI",
"padre": {
"nombre": "Diagnostico de Chagas en la gestacion",
"excel": "FE",
"col": 161
}
},
"sifilis_gestacional_confirmada": {
"col": 165,
"excel": "FI",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Sifilis gestacional confirmada",
"es": "la confirmación o negación de sífilis gestacional confirmada",
"ej": "SI"
},
"tratamiento_de_sifilis": {
"col": 166,
"excel": "FJ",
"como": "Escribe uno de estos códigos: 1 = Sí, la gestante inició tratamiento, 2 = Si la gestante no ha iniciado tratamiento para la sífilis, 3 = Si la gestante terminó el tratamiento para sífilis. Sífilis gestacional confirmada es NO:, 4 = NA.",
"nombre": "Tratamiento de sifilis",
"es": "el tratamiento de sífilis",
"ej": "1"
},
"tratamiento_de_sifilis_a_la_pareja": {
"col": 167,
"excel": "FK",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No Si sífilis gestacional confirmada es NO:, 3 = NA.",
"nombre": "Tratamiento de sifilis a la pareja",
"es": "el tratamiento de sífilis de la pareja",
"ej": "1"
},
"vih_materno_confirmado": {
"col": 168,
"excel": "FL",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Vih materno confirmado",
"es": "la confirmación o negación de vih materno confirmado",
"ej": "SI"
},
"fecha_suministro_metodo_planificacion_familiar_post_evento_obstetrico": {
"col": 169,
"excel": "FM",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha suministro de anticonceptivo post evento obstetrico",
"es": "fecha de suministro de anticonceptivo post evento obstétrico",
"ej": "2026-08-15"
},
"metodo_de_planificacion_familiar_post_evento_obstetrico": {
"col": 170,
"excel": "FN",
"como": "Escribe uno de estos códigos: 0 = No aplica, 1 = Dispositivo intrauterino, 2 = Dispositivo intrauterino y preservativo, 3 = Implante subdérmico, 4 = Implante subdérmico y preservativo, 5 = Oral, 6 = Oral y preservativo, 7 = Inyectable mensual, 8 = Inyectable mensual y preservativo, 9 = Inyectable trimestral, 10 = Inyectable trimestral y preservativo, 13 = Esterilización, 14 = Esterilización y preservativo.",
"nombre": "Suministro de metodo anticonceptivo post evento obstetrico",
"es": "el suministro de método anticonceptivo post evento obstétrico",
"ej": "0"
},
"vitalidad_de_la_madre_al_final_del_embarazo": {
"col": 171,
"excel": "FO",
"como": "Escribe uno de estos códigos: 1 = Viva, 2 = Muerta Si aún no ha llegado el momento del parto:, 3 = NA.",
"nombre": "Vitalidad de la madre al final del embarazo",
"es": "la vitalidad de la madre al final del embarazo",
"ej": "1"
},
"vitalidad_del_recien_nacido": {
"col": 172,
"excel": "FP",
"como": "Escribe uno de estos códigos: 1 = Vivo, 2 = Muerto Si aún no ha llegado el momento del parto:, 3 = NA.",
"nombre": "Vitalidad del recien nacido",
"es": "la vitalidad del recién nacido",
"ej": "1"
},
"persona_con_tuberculosis_activa": {
"col": 173,
"excel": "FQ",
"como": "Escribe uno de estos códigos: 1 = Tiene tuberculosis activa al corte del periodo de observación, 2 = Tuvo tuberculosis activa en el periodo de observación, 3 = No tuvo tuberculosis activa en el período de observación.",
"nombre": "Persona con tuberculosis activa",
"es": "persona con tuberculosis activa",
"ej": "1"
},
"fecha_de_realizacion_de_tamizaje_para_vih_en_el_momento_del_parto": {
"col": 174,
"excel": "FR",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15.",
"nombre": "Fecha de realizacion de tamizaje para vih en el momento del parto",
"es": "la fecha de realización de tamizaje para vih en el momento del parto",
"ej": "2026-08-15"
},
"fecha_del_diagnostico_de_la_tuberculosis_activa_reportada": {
"col": 175,
"excel": "FS",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15.",
"nombre": "Fecha del diagnostico de la tuberculosis activa reportada",
"es": "la fecha en que se hizo el diagnóstico de tuberculosis activa reportada",
"ej": "2026-08-15",
"padre": {
"nombre": "Persona con tuberculosis activa",
"excel": "FQ",
"col": 173
}
},
"fecha_de_realizacion_de_tamizaje_para_vih_a_la_persona_con_tuberculosis_activa_reportada": {
"col": 176,
"excel": "FT",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15.",
"nombre": "Fecha de realizacion de tamizaje para vih a la persona con tuberculosis activa",
"es": "la fecha en que se hizo el tamizaje para vih a persona con tuberculosis activa reportada",
"ej": "2026-08-15",
"padre": {
"nombre": "Persona con tuberculosis activa",
"excel": "FQ",
"col": 173
}
},
"fecha_de_muerte": {
"col": 177,
"excel": "FU",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de muerte",
"es": "la fecha de muerte de la gestante, si aplica",
"ej": "2026-08-15",
"padre": {
"nombre": "Vitalidad de la madre al final del embarazo",
"excel": "FO",
"col": 171
}
},
"causa_de_muerte": {
"col": 178,
"excel": "FV",
"como": "Escribe uno de estos códigos: 1 = Muerte por VIH/SIDA, 2 = Muerte por otra patología no definitoria de SIDA. Registre, 3 = Muerte por causa externa, 4 = La persona no ha fallecido, 55 = No aplica, paciente reportado por ente territorial por prestación de servicios no incluidos en el plan de beneficios.",
"nombre": "Causa de Muerte",
"es": "la causa de muerte de la gestante, si falleció",
"ej": "1"
},
"consulta_primera_vez_por_ginecologo": {
"col": 179,
"excel": "FW",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Consulta primera vez por ginecologo",
"es": "la fecha de consulta primera vez por ginecólogo",
"ej": "2026-08-15"
},
"control_por_ginecologia_1": {
"col": 180,
"excel": "FX",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 1",
"es": "la fecha de control por ginecologia1",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_1": {
"col": 181,
"excel": "FY",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 1",
"es": "el tipo de consulta control por ginecologia1",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 1",
"excel": "FX",
"col": 180
}
},
"control_por_ginecologia_2": {
"col": 182,
"excel": "FZ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control por ginecologia 1. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 2",
"es": "la fecha de control por ginecología 2",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_2": {
"col": 183,
"excel": "GA",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 2",
"es": "el tipo de consulta control por ginecologia2",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 2",
"excel": "FZ",
"col": 182
}
},
"control_por_ginecologia_3": {
"col": 184,
"excel": "GB",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control por ginecologia 1, Control por ginecologia 2. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 3",
"es": "la fecha de control por ginecología 3",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_3": {
"col": 185,
"excel": "GC",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 3",
"es": "el tipo de consulta control por ginecologia3",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 3",
"excel": "GB",
"col": 184
}
},
"control_por_ginecologia_4": {
"col": 186,
"excel": "GD",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control por ginecologia 1, Control por ginecologia 2, Control por ginecologia 3. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 4",
"es": "la fecha de control por ginecología 4",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_4": {
"col": 187,
"excel": "GE",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 4",
"es": "el tipo de consulta control por ginecologia4",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 4",
"excel": "GD",
"col": 186
}
},
"control_por_ginecologia_5": {
"col": 188,
"excel": "GF",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control por ginecologia 1, Control por ginecologia 2, Control por ginecologia 3, Control por ginecologia 4. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 5",
"es": "la fecha de control por ginecología 5",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_5": {
"col": 189,
"excel": "GG",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 5",
"es": "el tipo de consulta control por ginecologia5",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 5",
"excel": "GF",
"col": 188
}
},
"control_por_ginecologia_6": {
"col": 190,
"excel": "GH",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control por ginecologia 1, Control por ginecologia 2, Control por ginecologia 3, Control por ginecologia 4, Control por ginecologia 5. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 6",
"es": "la fecha de control por ginecología 6",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_6": {
"col": 191,
"excel": "GI",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 6",
"es": "el tipo de consulta control por ginecologia6",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 6",
"excel": "GH",
"col": 190
}
},
"control_por_ginecologia_7": {
"col": 192,
"excel": "GJ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control por ginecologia 1, Control por ginecologia 2, Control por ginecologia 3, Control por ginecologia 4, Control por ginecologia 5, Control por ginecologia 6. No puede ser una fecha futura.",
"nombre": "Control por ginecologia 7",
"es": "la fecha de control por ginecología 7",
"ej": "2026-08-15"
},
"tipo_consulta_control_por_ginecologia_7": {
"col": 193,
"excel": "GK",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo Consulta Control por ginecologia 7",
"es": "el tipo de consulta control por ginecologia7",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control por ginecologia 7",
"excel": "GJ",
"col": 192
}
},
"primera_vez_medicina_general": {
"col": 194,
"excel": "GL",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Primera vez Medicina General",
"es": "la fecha de primera vez medicina general",
"ej": "2026-08-15"
},
"tipo_de_consulta_primera_vez_medicina_general": {
"col": 195,
"excel": "GM",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta Primera vez Medicina General",
"es": "el tipo de consulta primera vez medicina general",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Primera vez Medicina General",
"excel": "GL",
"col": 194
}
},
"control_2_medicina_general": {
"col": 196,
"excel": "GN",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Primera vez Medicina General. No puede ser una fecha futura.",
"nombre": "Control 2 Medicina General",
"es": "la fecha de control 2 de medicina general",
"ej": "2026-08-15"
},
"tipo_de_consulta_medicina_general_2": {
"col": 197,
"excel": "GO",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta Medicina General 2",
"es": "el tipo de consulta medicina general2",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control 2 Medicina General",
"excel": "GN",
"col": 196
}
},
"control_nutricion1": {
"col": 198,
"excel": "GP",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Control Nutricion1",
"es": "la fecha de control nutricion1",
"ej": "2026-08-15"
},
"tipo_de_consulta_nutricion_1": {
"col": 199,
"excel": "GQ",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta nutricion 1",
"es": "el tipo de consulta nutricion1",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control Nutricion1",
"excel": "GP",
"col": 198
}
},
"alteracion_nutricional_consulta1": {
"col": 200,
"excel": "GR",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Alteracion nutricional consulta1",
"es": "la confirmación o negación de la alteración nutricional consulta 1",
"ej": "SI",
"padre": {
"nombre": "Control Nutricion1",
"excel": "GP",
"col": 198
}
},
"control_nutricion2": {
"col": 201,
"excel": "GS",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control Nutricion1. No puede ser una fecha futura.",
"nombre": "Control Nutricion2",
"es": "la fecha de control nutricion2",
"ej": "2026-08-15"
},
"tipo_de_consulta_nutricion_2": {
"col": 202,
"excel": "GT",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta nutricion 2",
"es": "el tipo de consulta nutricion2",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control Nutricion2",
"excel": "GS",
"col": 201
}
},
"alteracion_nutricional_consulta2": {
"col": 203,
"excel": "GU",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Alteracion nutricional consulta2",
"es": "la confirmación o negación de la alteración nutricional consulta 2",
"ej": "SI",
"padre": {
"nombre": "Control Nutricion2",
"excel": "GS",
"col": 201
}
},
"control_psicologia1": {
"col": 204,
"excel": "GV",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Control Psicologia1",
"es": "la fecha de control psicologia1",
"ej": "2026-08-15"
},
"tipo_de_consulta_psicologia1": {
"col": 205,
"excel": "GW",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta Psicologia1",
"es": "el tipo de consulta psicologia1",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control Psicologia1",
"excel": "GV",
"col": 204
}
},
"control_psicologia2": {
"col": 206,
"excel": "GX",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control Psicologia1. No puede ser una fecha futura.",
"nombre": "Control Psicologia2",
"es": "la fecha de control psicologia2",
"ej": "2026-08-15"
},
"tipo_de_consulta_psicologia2": {
"col": 207,
"excel": "GY",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta Psicologia2",
"es": "el tipo de consulta psicologia2",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control Psicologia2",
"excel": "GX",
"col": 206
}
},
"control_perinatologo1": {
"col": 208,
"excel": "GZ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Control Perinatologo1",
"es": "la fecha de control pertinatologo1",
"ej": "2026-08-15"
},
"tipo_de_consulta_perinatologo1": {
"col": 209,
"excel": "HA",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta Perinatologo1",
"es": "el tipo de consulta perinatologo1",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control Perinatologo1",
"excel": "GZ",
"col": 208
}
},
"control_perinatologo2": {
"col": 210,
"excel": "HB",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control Perinatologo1. No puede ser una fecha futura.",
"nombre": "Control Perinatologo2",
"es": "la fecha de control perinatologo2",
"ej": "2026-08-15"
},
"tipo_de_consulta_perinatologo2": {
"col": 211,
"excel": "HC",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): TELECONSULTA, PRESENCIAL, DOMICILIARIA.",
"nombre": "Tipo de consulta Perinatologo2",
"es": "el tipo de consulta perinatologo2",
"ej": "TELECONSULTA",
"padre": {
"nombre": "Control Perinatologo2",
"excel": "HB",
"col": 210
}
},
"control_enfermeria_1": {
"col": 212,
"excel": "HD",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Control Enfermeria 1",
"es": "la fecha de control de enfermería 1",
"ej": "2026-08-15"
},
"control_enfermeria_2": {
"col": 213,
"excel": "HE",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control Enfermeria 1. No puede ser una fecha futura.",
"nombre": "Control Enfermeria 2",
"es": "la fecha de control de enfermería 2",
"ej": "2026-08-15"
},
"control_enfermeria_3": {
"col": 214,
"excel": "HF",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM, Control Enfermeria 1, Control Enfermeria 2. No puede ser una fecha futura.",
"nombre": "Control Enfermeria 3",
"es": "la fecha de control de enfermería 3",
"ej": "2026-08-15"
},
"control_odontologia_1": {
"col": 215,
"excel": "HG",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM. No puede ser una fecha futura.",
"nombre": "Control Odontologia 1",
"es": "la fecha de control de odontología 1",
"ej": "2026-08-15"
},
"semana_epidemiologica": {
"col": 216,
"excel": "HH",
"como": "Escribe un número entero, sin puntos ni comas. Entre 1 y 52.",
"nombre": "Semana epidemiologica",
"es": "la semana epidemiológica en que se realiza la atención de la gestante reportada, según calendario epidemiológico del INS",
"ej": "2"
},
"gestante_antecedentes_preeclampsia": {
"col": 217,
"excel": "HI",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Gestante antecedentes preclampsia",
"es": "la confirmación o negación de los antecedentes de preeclampsia de la gestante",
"ej": "SI"
},
"riesgo_preeclampsia": {
"col": 218,
"excel": "HJ",
"como": "Escribe uno de estos códigos: 4 = Alto, 5 = Bajo.",
"nombre": "Riesgo preeclampsia",
"es": "el riesgo de preeclampsia de la gestante",
"ej": "4"
},
"consulta_urgencia_ultimos_30_dias": {
"col": 219,
"excel": "HK",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Consulta urgencia ultimos 30 dias",
"es": "la confirmación o negación de consulta de urgencias últimos 30 días de la gestante",
"ej": "SI"
},
"gestante_egreso_hospitalizacion_ultimos_30_dias": {
"col": 220,
"excel": "HL",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Gestante egreso hospitalizacion ultimos 30 dias",
"es": "la confirmación o negación de egreso hospitalización últimos 30 días de la gestante",
"ej": "SI"
},
"gestante_cumple_al_menos_1_criterio_mme": {
"col": 221,
"excel": "HM",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO.",
"nombre": "Gestante cumple al menos 1 criterio MME",
"es": "la confirmación o negación si la gestante cumple con al menos 1 criterio MME",
"ej": "SI"
},
"gestante_riesgo_tromboembolismo": {
"col": 222,
"excel": "HN",
"como": "Escribe uno de estos códigos: 4 = Alto, 5 = Bajo, 21 = Riesgo no evaluado.",
"nombre": "Gestante riesgo tromboembolismo",
"es": "la confirmación o negación del riesgo de tromboembolismo de la gestante",
"ej": "4"
},
"fecha_control_puerperio": {
"col": 223,
"excel": "HO",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha control puerperio",
"es": "la fecha de control puerperio",
"ej": "2026-08-15"
},
"laboratorios_alterados": {
"col": 224,
"excel": "HP",
"como": "Escribe exactamente una de estas palabras (en mayúsculas): SI, NO, RIESGO NO EVALUADO.",
"nombre": "Laboratorios alterados",
"es": "la confirmación o negación de laboratorios alterados",
"ej": "SI"
},
"seguimiento_posevento_obstetrico1_medico_especialista_casos_morbilidad_materna_extrema": {
"col": 225,
"excel": "HQ",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Seguimiento posevento obstetrico o 1 medico especialista casos MME",
"es": "la fecha de seguimiento post evento obstetrico1",
"ej": "2026-08-15"
},
"seguimiento_posevento_obstetrico2_medico_especialista_casos_morbilidad_materna_extrema": {
"col": 226,
"excel": "HR",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Seguimiento posevento obstetrico o 2 medico especialista casos MME",
"es": "la fecha de seguimiento post evento obstetrico2",
"ej": "2026-08-15"
},
"seguimiento_posevento_obstetrico3_medico_especialista_casos_morbilidad_materna_extrema": {
"col": 227,
"excel": "HS",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Seguimiento posevento obstetrico o 3 medico especialista casos MME",
"es": "la fecha de seguimiento post evento obstetrico3",
"ej": "2026-08-15"
},
"seguimiento_posevento_obstetrico4_medico_especialista_casos_morbilidad_materna_extrema": {
"col": 228,
"excel": "HT",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Seguimiento posevento obstetrico o 4 medico especialista casos MME",
"es": "la fecha de seguimiento post evento obstetrico4",
"ej": "2026-08-15"
},
"nacionalidad_procedencia": {
"col": 229,
"excel": "HU",
"como": "Escribe solo números, sin puntos ni guiones. Máximo 3 dígitos.",
"nombre": "Nacionalidad procedencia",
"es": "el código del país de procedencia de la gestante",
"ej": "123"
},
"codigo_ocupacion": {
"col": 230,
"excel": "HV",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Codigo ocupacion",
"es": "el código de ocupación de la gestante",
"ej": "2"
},
"nivel_educativo": {
"col": 231,
"excel": "HW",
"como": "Escribe un número entero, sin puntos ni comas. Entre 1 y 13.",
"nombre": "Nivel educativo",
"es": "el código del nivel educativo de la gestante",
"ej": "2"
},
"codigo_pertenencia_etnica": {
"col": 232,
"excel": "HX",
"como": "Escribe uno de estos códigos: 01 = Indígena, 02 = ROM (Gitanos), 03 = Raizal (San Andrés y Providencia), 04 = Palenquero de San Basilio de Palenque, 05 = Negro(a), 06 = Afrocolombiano(a), 99 = Ninguna de las anteriores.",
"nombre": "Codigo pertenencia etnica",
"es": "el código de pertenencia étnica de la gestante",
"ej": "01"
},
"fecha_de_inicio_de_acido_acetilsalicilico_asa": {
"col": 233,
"excel": "HY",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de inicio de acido acetilsalicilico - ASA",
"es": "la fecha inicio de ácido acetilsalicílico - ASA",
"ej": "2026-08-15"
},
"suministro_de_acido_folico_en_el_control_prenatal": {
"col": 234,
"excel": "HZ",
"como": "Escribe uno de estos códigos: 0 = No aplica, 1 = Si se formula, 21 = Registro no evaluado.",
"nombre": "Suministro de acido folico en el control prenatal",
"es": "la FORMULACIÓN de ácido fólico en el control prenatal",
"ej": "0"
},
"suministro_de_sulfato_ferroso_en_el_control_prenatal": {
"col": 235,
"excel": "IA",
"como": "Escribe uno de estos códigos: 0 = No aplica, 1 = Si se formula, 21 = Registro no evaluado.",
"nombre": "Suministro de sulfato ferroso en el control prenatal",
"es": "el FORMULACIÓN de sulfato ferroso en el control prenatal",
"ej": "0"
},
"suministro_de_carbonato_de_calcio_en_el_control_prenatal": {
"col": 236,
"excel": "IB",
"como": "Escribe uno de estos códigos: 0 = No aplica, 1 = Si se formula, 21 = Registro no evaluado.",
"nombre": "Suministro de carbonato de calcio en el control prenatal",
"es": "el FORMULACIÓN de carbonato de calcio en el control prenatal",
"ej": "0"
},
"fecha_de_salida_de_atencion_parto_o_cesarea": {
"col": 237,
"excel": "IC",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15. Tiene que ser posterior a FUM.",
"nombre": "Fecha de salida de atencion parto o cesarea",
"es": "la fecha de salida de atención parto o cesárea",
"ej": "2026-08-15",
"padre": {
"nombre": "Via de terminacion del embarazo",
"excel": "EU",
"col": 151
}
},
"municipio_de_atencion_del_control_prenatal": {
"col": 238,
"excel": "ID",
"como": "Escribe un número entero, sin puntos ni comas.",
"nombre": "Municipio de Atencion del control prenatal",
"es": "el código del municipio según División Política Administrativa de Colombia DIVIPOLA del DANE",
"ej": "2"
},
"tipo_de_caso": {
"col": 239,
"excel": "IE",
"como": "Escribe uno de estos códigos: 1 = Mayor de 35 años, 2 = Alteraciones nutricionales, 3 = Consulta a servicios de urgencias, 4 = Hospitalización, 5 = Laboratorios alterados, 6 = Antecedente de preeclampsia, 7 = Riesgo de preeclampsia, 8 = Menos de cuatro controles prenatales mediando la semana gestacional 30, 9 = Morbilidad Materna Extrema, 10 = Riesgo de tromboembolismo, 11 = Diagnóstico de enfermedad del colágeno, 12 = Diagnóstico de algún tipo de, 21 = No tiene tipo de caso.",
"nombre": "Tipo de caso",
"es": "la característica principal que motiva el seguimiento",
"ej": "1"
},
"fecha_de_seguimiento": {
"col": 240,
"excel": "IF",
"como": "Escribe la fecha en formato AAAA-MM-DD. Por ejemplo: 2026-08-15.",
"nombre": "Fecha de seguimiento",
"es": "la fecha en que se realiza seguimiento al caso",
"ej": "2026-08-15",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"tipo_de_seguimiento": {
"col": 241,
"excel": "IG",
"como": "Escribe uno de estos códigos: 1 = Contacto telefónico, 2 = Visita domiciliaria, 3 = Visita de auditor concurrente en hospitalización, 4 = Otro.",
"nombre": "Tipo de seguimiento",
"es": "el tipo de estrategia que utilizó para realizar seguimiento al caso",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_asignacion_de_cita_por_profesional_de_medicina": {
"col": 242,
"excel": "IH",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Asignacion de cita por profesional de medicina",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_asignacion_de_cita_por_medicina_especializada": {
"col": 243,
"excel": "II",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Asignacion de cita por medicina especializada",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_referencia_a_institucion_de_mayor_complejidad": {
"col": 244,
"excel": "IJ",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Referencia a institucion de mayor complejidad",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_asignacion_de_cita_para_procedimientos": {
"col": 245,
"excel": "IK",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Asignacion de cita para procedimientos",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_canalizacion_a_entrega_de_resultados_de_laboratorio": {
"col": 246,
"excel": "IL",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Canalizacion a entrega de resultados de laboratorio",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_entrega_de_medicamentos": {
"col": 247,
"excel": "IM",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Entrega de medicamentos",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
},
"seguimiento_informacion_para_el_cuidado_de_la_salud": {
"col": 248,
"excel": "IN",
"como": "Escribe uno de estos códigos: 1 = Si, 2 = No.",
"nombre": "Seguimiento - Informacion para el cuidado de la salud",
"es": "la confirmación o negación del seguimiento",
"ej": "1",
"padre": {
"nombre": "Tipo de caso",
"excel": "IE",
"col": 239
}
}
};
