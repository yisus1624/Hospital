# -*- coding: utf-8 -*-
"""
Esquema de los 248 campos del archivo SMH (Seguimiento Materno Hospitalario)
segun "Instructivo_SMH_V5_20240430".

Cada campo se declara como:
    (num, key, nombre, tipo, longitud, requerido, valores, extras)

tipo:
    F = fecha (AAAA-MM-DD)
    N = numerico
    T = texto de catalogo (lista cerrada de valores)
    A = alfanumerico libre (mayusculas, sin tildes ni caracteres especiales)

requerido:
    "SI"   -> obligatorio siempre
    "NO"   -> opcional
    "COND" -> obligatorio solo si se cumple `cond` (ver extras)

extras (dict, todas las claves opcionales):
    cond        : condicion de obligatoriedad / permanencia. Ver COND_* abajo.
    dec         : True si admite decimales
    sep_dec     : "," o "." separador decimal exigido por el instructivo
    ndec        : numero de decimales a forzar
    min / max   : rango de valores permitido
    zfill       : rellenar con ceros a la izquierda hasta la longitud
    na          : valor centinela a usar cuando "no aplica" (ej. "1845-01-01")
    mayor_que   : lista de keys; esta fecha debe ser posterior a todas ellas
    menor_que   : lista de keys; esta fecha debe ser anterior a todas ellas
    no_futura   : True si la fecha no puede superar la fecha actual

Condiciones (`cond`) se expresan como tuplas:
    ("lleno", key)             -> el campo `key` tiene dato
    ("igual", key, [valores])  -> el campo `key` es alguno de esos valores
"""

from dataclasses import dataclass, field
from typing import Any, Optional

# Catalogos reutilizados
POS_NEG = ["POSITIVO", "NEGATIVO"]
REACTIVO = ["REACTIVO", "NO REACTIVO"]
SI_NO = ["SI", "NO"]
UROCULTIVO = ["POSITIVO", "NEGATIVO", "INDETECTABLE"]
TIPO_CONSULTA = ["TELECONSULTA", "PRESENCIAL", "DOMICILIARIA"]
TIPO_ESTUDIO = ["PRUEBA RAPIDA", "VDRL"]
# El resultado de sifilis depende del tipo de estudio; se valida cruzado en motor.py
SIFILIS = ["POSITIVO", "NEGATIVO", "REACTIVO", "NO REACTIVO"]
TIPO_ID = ["AS", "DE", "MS", "PT", "CC", "CE", "CD", "PA", "SC", "PE", "RC", "TI", "CN"]

NA_FECHA = "1845-01-01"


@dataclass
class Campo:
    num: int
    key: str
    nombre: str
    tipo: str
    longitud: int
    requerido: str
    valores: Optional[list] = None
    extras: dict = field(default_factory=dict)

    def x(self, nombre: str, defecto: Any = None) -> Any:
        return self.extras.get(nombre, defecto)


# ---------------------------------------------------------------------------
# Definicion de los 248 campos, en el orden exacto de columnas del archivo.
# ---------------------------------------------------------------------------

_D = [
    # --- Identificacion del reporte y de la gestante (1-25) -----------------
    (1, "fecha_cargue", "Fecha de cargue", "F", 10, "SI", None, {"no_futura": True}),
    (2, "fecha_ini_periodo", "Fecha inicial del periodo reportado", "F", 10, "SI", None,
     {"no_futura": True}),
    (3, "fecha_fin_periodo", "Fecha final del periodo reportado", "F", 10, "SI", None,
     {"no_futura": True, "mayor_que": ["fecha_ini_periodo"]}),
    (4, "tipo_id", "Tipo de identificacion", "T", 2, "SI", TIPO_ID, {}),
    (5, "documento", "Documento", "A", 17, "SI", None, {"solo_digitos": True}),
    (6, "nombre1", "Nombre 1", "A", 60, "SI", None, {}),
    (7, "nombre2", "Nombre 2", "A", 60, "SI", None, {"vacio_como": "NONE"}),
    (8, "apellido1", "Apellido 1", "A", 60, "SI", None, {}),
    (9, "apellido2", "Apellido 2", "A", 60, "SI", None, {"vacio_como": "NONE"}),
    (10, "telefono", "Telefono", "N", 10, "SI", None, {}),
    (11, "talla", "Talla (cm)", "N", 3, "SI", None, {"min": 90, "max": 200}),
    (12, "peso_inicio", "Peso al inicio de la gestacion", "A", 5, "SI", None,
     {"dec": True, "sep_dec": ",", "ndec": 1, "min": 30, "max": 120}),
    (13, "gravida", "Gravida", "N", 2, "SI", None, {}),
    (14, "partos", "Partos", "N", 2, "SI", None, {}),
    (15, "cesareas", "Cesareas", "N", 2, "SI", None, {}),
    (16, "abortos", "Abortos", "N", 2, "SI", None, {}),
    (17, "ectopicos", "Ectopicos", "N", 2, "SI", None, {}),
    (18, "vivos", "Vivos", "N", 2, "SI", None, {}),
    (19, "muertos", "Muertos", "N", 2, "SI", None, {}),
    (20, "fum", "FUM", "F", 10, "SI", None, {"no_futura": True}),
    (21, "fpp", "FPP", "F", 10, "SI", None, {"mayor_que": ["fum"], "max_dias_desde": ("fum", 294)}),
    (22, "fecha_ingreso_programa", "Fecha de ingreso al programa de atencion integral", "F", 10,
     "SI", None, {"no_futura": True, "mayor_que": ["fum", "fecha_ingreso_riamp"]}),
    (23, "nit", "NIT", "N", 9, "SI", None, {"zfill": True}),
    (24, "nombre_ips", "Nombre IPS", "T", 60, "SI", None, {"sin_espacios": True}),
    (25, "doc_profesional", "Documento del profesional que realiza la primera atencion", "N", 18,
     "SI", None, {}),
    (26, "semana_gestacional", "Semana gestacional", "N", 2, "SI", None,
     {"dec": True, "sep_dec": ".", "max": 42}),
    (27, "riesgo", "Riesgo", "T", 2, "SI", ["ALTO", "BAJO"], {}),
    (28, "fecha_ingreso_riamp", "Fecha ingreso RIAMP nivel primario", "F", 10, "SI", None,
     {"mayor_que": ["fum"], "menor_que": ["fpp", "fecha_ingreso_programa"]}),

    # --- Hemoclasificacion y laboratorios base (29-37) ----------------------
    (29, "grupo_sanguineo", "Grupo sanguineo", "T", 2, "NO", ["A", "B", "O", "AB"], {}),
    (30, "rh", "RH", "T", 8, "COND", ["POSITIVO", "NEGATIVO"],
     {"cond": ("lleno", "grupo_sanguineo")}),
    (31, "fecha_grupo_sanguineo", "Fecha grupo sanguineo", "F", 10, "COND", None,
     {"cond": ("lleno", "grupo_sanguineo"), "mayor_que": ["fum"]}),
    (32, "coombs", "Coombs indirecto", "T", 8, "NO", POS_NEG, {}),
    (33, "fecha_coombs", "Fecha Coombs indirecto", "F", 10, "COND", None,
     {"cond": ("lleno", "coombs"), "mayor_que": ["fum"]}),
    (34, "glicemia", "Glicemia en ayunas", "N", 3, "NO", None, {}),
    (35, "fecha_glicemia", "Fecha glicemia en ayunas", "F", 10, "COND", None,
     {"cond": ("lleno", "glicemia"), "mayor_que": ["fum"]}),
    (36, "hepatitis_b", "Hepatitis b", "T", 11, "NO", REACTIVO, {}),
    (37, "fecha_hepatitis_b", "Fecha Hepatitis b", "F", 10, "COND", None,
     {"cond": ("lleno", "hepatitis_b"), "mayor_que": ["fum"]}),

    # --- Toxoplasma (38-57) -------------------------------------------------
    (38, "toxo_igg", "Toxoplasma IGG", "T", 8, "NO", POS_NEG, {}),
    (39, "fecha_toxo_igg", "Fecha Toxoplasma IGG", "F", 10, "COND", None,
     {"cond": ("lleno", "toxo_igg"), "mayor_que": ["fum"]}),
    (40, "toxo_igm", "Toxoplasma IGM", "T", 8, "NO", POS_NEG, {}),
    (41, "fecha_toxo_igm", "Fecha toxoplasma IGM", "F", 10, "COND", None,
     {"cond": ("lleno", "toxo_igm"), "mayor_que": ["fum"]}),
]

# Toxoplasma IGM por EIA para negativos 1..8 -> campos 42 a 57 (pares valor/fecha)
_n = 42
for i in range(1, 9):
    _D.append((_n, f"toxo_eia_neg{i}", f"Toxoplasma IGM por EIA para negativos{i}", "T", 8, "NO",
               POS_NEG, {}))
    _D.append((_n + 1, f"fecha_toxo_eia_neg{i}", f"Fecha toxoplasma IGM por EIA para negativos{i}",
               "F", 10, "COND", None,
               {"cond": ("lleno", f"toxo_eia_neg{i}"), "mayor_que": ["fum"]}))
    _n += 2

_D += [
    # --- Carga viral, rubeola, estreptococo (58-65) -------------------------
    (58, "carga_viral", "Carga viral", "N", 6, "NO", None, {}),
    (59, "fecha_carga_viral", "Fecha carga viral", "F", 10, "COND", None,
     {"cond": ("lleno", "carga_viral"), "mayor_que": ["fum"]}),
    (60, "rubeola", "Rubeola", "T", 8, "NO", POS_NEG, {}),
    (61, "fecha_rubeola", "Fecha rubeola", "F", 10, "COND", None,
     {"cond": ("lleno", "rubeola"), "mayor_que": ["fum"]}),
    (62, "estreptococo_rectal", "Estreptococo rectal", "T", 8, "NO", POS_NEG, {}),
    (63, "fecha_estreptococo_rectal", "Fecha estreptococo rectal", "F", 10, "COND", None,
     {"cond": ("lleno", "estreptococo_rectal"), "mayor_que": ["fum"]}),
    (64, "estreptococo_vaginal", "Estreptococo vaginal", "T", 8, "NO", POS_NEG, {}),
    (65, "fecha_estreptococo_vaginal", "Fecha estreptococo vaginal", "F", 10, "COND", None,
     {"cond": ("lleno", "estreptococo_vaginal"), "mayor_que": ["fum"]}),

    # --- Vacunacion (66-71) -------------------------------------------------
    (66, "influenza", "Influenza estacional", "T", 2, "SI", SI_NO, {}),
    (67, "fecha_influenza", "Fecha influenza estacional", "F", 10, "COND", None,
     {"cond": ("igual", "influenza", ["SI"]), "mayor_que": ["fum"]}),
    (68, "tdap", "Tdap", "T", 2, "SI", SI_NO, {}),
    (69, "fecha_tdap", "Fecha Tdap", "F", 10, "COND", None,
     {"cond": ("igual", "tdap", ["SI"]), "mayor_que": ["fum"]}),
    (70, "antitetanica", "Antitetanica", "T", 2, "SI", SI_NO, {}),
    (71, "fecha_antitetanica", "Fecha antitetanica", "F", 10, "COND", None,
     {"cond": ("igual", "antitetanica", ["SI"]), "mayor_que": ["fum"]}),
]

# Curso de paternidad, fechas 1..7 -> campos 72 a 78 (cada una posterior a la anterior)
for i in range(1, 8):
    _prev = [f"fecha_curso_paternidad{j}" for j in range(1, i)]
    _D.append((71 + i, f"fecha_curso_paternidad{i}", f"Fecha {i} curso paternidad", "F", 10, "NO",
               None, {"mayor_que": ["fum"] + _prev, "menor_que": ["fpp"], "no_futura": True}))

_D += [
    # --- Curva de tolerancia, hemograma, frotis, orina (79-92) --------------
    (79, "ctog_pre", "Ctog pre", "N", 3, "NO", None, {}),
    (80, "ctog_1hora", "Ctog 1hora", "N", 3, "NO", None, {}),
    (81, "ctog_2hora", "Ctog 2hora", "N", 3, "NO", None, {}),
    (82, "ctog_fecha", "Ctog fecha", "F", 10, "COND", None,
     {"cond": ("lleno", "ctog_pre"), "mayor_que": ["fum"]}),
    (83, "hb", "Hb", "N", 2, "NO", None, {"dec": True, "sep_dec": ".", "min": 6, "max": 20}),
    (84, "fecha_hb", "Fecha hb", "F", 10, "COND", None,
     {"cond": ("lleno", "hb"), "mayor_que": ["fum"]}),
    (85, "htco", "Htco", "N", 2, "NO", None, {"max": 50}),
    # El instructivo numera dos veces "87"; este es el campo 86 por posicion.
    (86, "fecha_htco", "Fecha htco", "F", 10, "COND", None,
     {"cond": ("lleno", "htco"), "mayor_que": ["fum"]}),
    (87, "frotis", "Frotis", "T", 7, "NO", ["NORMAL", "ANORMAL"], {}),
    (88, "fecha_frotis", "Fecha frotis", "F", 10, "COND", None,
     {"cond": ("lleno", "frotis"), "mayor_que": ["fum"]}),
    (89, "gram_orina", "Gram de orina", "T", 2, "SI", SI_NO, {}),
    (90, "fecha_gram_orina", "Fecha gram de orina", "F", 10, "COND", None,
     {"cond": ("igual", "gram_orina", ["SI"]), "mayor_que": ["fum"]}),
    (91, "parcial_orina", "Parcial orina", "T", 2, "SI", SI_NO, {}),
    (92, "fecha_parcial_orina", "Fecha parcial orina", "F", 10, "COND", None,
     {"cond": ("igual", "parcial_orina", ["SI"]), "mayor_que": ["fum"]}),

    # --- Trimestre 1 (93-110) ----------------------------------------------
    (93, "carga_viral1", "Carga viral1", "N", 6, "NO", None, {}),
    (94, "fecha_carga_viral1", "Fecha carga viral1", "F", 10, "COND", None,
     {"cond": ("lleno", "carga_viral1"), "mayor_que": ["fum"]}),
    (95, "tipo_estudio_sifilis1", "Tipo de estudio prueba rapida1 o vdrl1", "T", 13, "NO",
     TIPO_ESTUDIO, {}),
    (96, "vdrl1", "Vdrl1 o prueba rapida1 sifilis", "T", 11, "COND", SIFILIS,
     {"cond": ("lleno", "tipo_estudio_sifilis1"), "pareja_estudio": "tipo_estudio_sifilis1"}),
    (97, "fecha_vdrl1", "Fecha vdrl1 o prueba rapida1", "F", 10, "COND", None,
     {"cond": ("lleno", "tipo_estudio_sifilis1"), "mayor_que": ["fum"]}),
    (98, "urocultivo1", "Urocultivo1", "T", 2, "NO", UROCULTIVO, {}),
    (99, "fecha_urocultivo1", "Fecha Urocultivo1", "F", 10, "COND", None,
     {"cond": ("lleno", "urocultivo1"), "mayor_que": ["fum"]}),
    (100, "ecografia1", "Ecografia1 (translucencia nucal)", "T", 2, "SI", SI_NO, {}),
    (101, "fecha_ecografia1", "Fecha ecografia1", "F", 10, "COND", None,
     {"cond": ("igual", "ecografia1", ["SI"]), "mayor_que": ["fum"]}),
    (102, "anormalidades_eco1", "Anormalidades ecografia1", "T", 2, "COND", SI_NO,
     {"cond": ("igual", "ecografia1", ["SI"])}),
    (103, "semana_gest_eco1", "Semana gestacion por ecografia", "N", 2, "COND", None,
     {"cond": ("igual", "ecografia1", ["SI"]), "dec": True, "sep_dec": ".", "max": 42}),
    (104, "urocultivo_post1", "Urocultivo_post1", "T", 2, "NO", UROCULTIVO, {}),
    (105, "fecha_urocultivo_post1", "Fecha Urocultivo_post1", "F", 10, "COND", None,
     {"cond": ("lleno", "urocultivo_post1"), "mayor_que": ["fum"]}),
    (106, "fecha_asesoria_pre_vih1", "Fecha asesoria pre test vih 1", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (107, "acepta_prueba_vih1", "Acepta prueba 1 vih", "T", 2, "NO", SI_NO, {}),
    (108, "fecha_asesoria_post_vih1", "Fecha asesoria post test vih 1", "F", 10, "NO", None,
     {"mayor_que": ["fum", "fecha_asesoria_pre_vih1"]}),
    (109, "resultado_vih1", "Resultado prueba rapida trimestre 1", "T", 8, "NO", POS_NEG, {}),
    (110, "fecha_prueba_vih1", "Fecha de realizacion de la prueba vih 1", "F", 10, "COND", None,
     {"cond": ("lleno", "resultado_vih1"), "mayor_que": ["fum"]}),

    # --- Trimestre 2 (111-126) ---------------------------------------------
    (111, "tipo_estudio_sifilis2", "Tipo de estudio prueba rapida2 o vdrl2", "T", 13, "NO",
     TIPO_ESTUDIO, {}),
    (112, "vdrl2", "Vdrl2 o prueba rapida sifilis2", "T", 11, "COND", SIFILIS,
     {"cond": ("lleno", "tipo_estudio_sifilis2"), "pareja_estudio": "tipo_estudio_sifilis2"}),
    (113, "fecha_vdrl2", "Fecha vdrl2 o prueba rapida2", "F", 10, "COND", None,
     {"cond": ("lleno", "tipo_estudio_sifilis2"), "mayor_que": ["fum"]}),
    (114, "urocultivo2", "Urocultivo2", "T", 2, "NO", UROCULTIVO, {}),
    (115, "fecha_urocultivo2", "Fecha Urocultivo2", "F", 10, "COND", None,
     {"cond": ("lleno", "urocultivo2"), "mayor_que": ["fum"]}),
    (116, "ecografia2", "Ecografia2 (detalle anatomico)", "T", 2, "SI", SI_NO, {}),
    (117, "fecha_ecografia2", "Fecha ecografia2", "F", 10, "COND", None,
     {"cond": ("igual", "ecografia2", ["SI"]), "mayor_que": ["fum"]}),
    (118, "anormalidades_eco2", "Anormalidades ecografia2", "T", 2, "COND", SI_NO,
     {"cond": ("igual", "ecografia2", ["SI"])}),
    (119, "semana_gest_eco2", "Semana gestacion por ecografia2", "N", 2, "COND", None,
     {"cond": ("igual", "ecografia2", ["SI"]), "dec": True, "sep_dec": ".", "max": 42}),
    (120, "urocultivo_post2", "Urocultivo_post2", "T", 2, "COND", UROCULTIVO,
     {"cond": ("igual", "urocultivo2", ["POSITIVO", "INDETECTABLE"])}),
    (121, "fecha_urocultivo_post2", "Fecha Urocultivo_post2", "F", 10, "COND", None,
     {"cond": ("lleno", "urocultivo_post2"), "mayor_que": ["fum"]}),
    (122, "fecha_asesoria_pre_vih2", "Fecha asesoria pre test vih2", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (123, "acepta_prueba_vih2", "Acepta prueba vih2", "T", 2, "NO", SI_NO, {}),
    (124, "fecha_asesoria_post_vih2", "Fecha asesoria post test vih2", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (125, "resultado_vih2", "Resultado prueba rapida trimestre2", "T", 8, "NO", POS_NEG, {}),
    (126, "fecha_prueba_vih2", "Fecha de realizacion de la prueba vih2", "F", 10, "COND", None,
     {"cond": ("lleno", "resultado_vih2"), "mayor_que": ["fum"]}),

    # --- Trimestre 3 (127-142) ---------------------------------------------
    (127, "tipo_estudio_sifilis3", "Tipo de estudio prueba rapida3 o vdrl3", "T", 13, "NO",
     TIPO_ESTUDIO, {}),
    (128, "vdrl3", "Vdrl3 o prueba rapida sifilis3", "T", 11, "COND", SIFILIS,
     {"cond": ("lleno", "tipo_estudio_sifilis3"), "pareja_estudio": "tipo_estudio_sifilis3"}),
    (129, "fecha_vdrl3", "Fecha vdrl3 o prueba rapida3", "F", 10, "COND", None,
     {"cond": ("lleno", "tipo_estudio_sifilis3"), "mayor_que": ["fum"]}),
    (130, "urocultivo3", "Urocultivo3", "T", 2, "NO", UROCULTIVO, {}),
    (131, "fecha_urocultivo3", "Fecha Urocultivo3", "F", 10, "COND", None,
     {"cond": ("lleno", "urocultivo3"), "mayor_que": ["fum"]}),
    (132, "ecografia3", "Ecografia3 (OBSTETRICA)", "T", 2, "SI", SI_NO, {}),
    (133, "fecha_ecografia3", "Fecha ecografia3", "F", 10, "COND", None,
     {"cond": ("igual", "ecografia3", ["SI"]), "mayor_que": ["fum"]}),
    (134, "anormalidades_eco3", "Anormalidades ecografia3", "T", 2, "COND", SI_NO,
     {"cond": ("igual", "ecografia3", ["SI"])}),
    (135, "semana_gest_eco3", "Semana gestacion por ecografia3", "N", 2, "COND", None,
     {"cond": ("igual", "ecografia3", ["SI"]), "dec": True, "sep_dec": ".", "max": 42}),
    (136, "urocultivo_post3", "Urocultivo_post3", "T", 2, "NO", SI_NO, {}),
    (137, "fecha_urocultivo_post3", "Fecha Urocultivo_post3", "F", 10, "COND", None,
     {"cond": ("lleno", "urocultivo_post3"), "mayor_que": ["fum"]}),
    (138, "fecha_asesoria_pre_vih3", "Fecha asesoria pre test vih3", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (139, "acepta_prueba_vih3", "Acepta prueba vih3", "T", 2, "NO", SI_NO, {}),
    (140, "fecha_asesoria_post_vih3", "Fecha asesoria post test vih3", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (141, "resultado_vih3", "Resultado prueba rapida trimestre3", "T", 8, "NO", POS_NEG, {}),
    (142, "fecha_prueba_vih3", "Fecha de realizacion de la prueba vih3", "F", 10, "COND", None,
     {"cond": ("lleno", "resultado_vih3"), "mayor_que": ["fum"]}),

    # --- Diagnosticos CIE10 (143-149) --------------------------------------
    (143, "diag1", "Diag1", "A", 4, "SI", None, {"cie10": True}),
    (144, "diag2", "Diag2", "A", 4, "SI", None, {"cie10": True}),
    (145, "diag3", "Diag3", "A", 4, "COND", None,
     {"cie10": True, "cond": ("igual", "riesgo", ["ALTO"])}),
    (146, "diag4", "Diag4", "A", 4, "NO", None, {"cie10": True}),
    (147, "diag5", "Diag5", "A", 4, "NO", None, {"cie10": True}),
    (148, "diag6", "Diag6", "A", 4, "NO", None, {"cie10": True}),
    (149, "diag7", "Diag7", "A", 4, "NO", None, {"cie10": True}),

    # --- Terminacion del embarazo y desenlaces (150-178) --------------------
    (150, "fecha_terminacion_embarazo", "Fecha de terminacion del embarazo", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (151, "via_terminacion", "Via de terminacion del embarazo", "T", 7, "COND",
     ["PARTO", "CESAREA", "ABORTO"], {"cond": ("lleno", "fecha_terminacion_embarazo")}),
    (152, "fcf", "Frecuencia cardiaca fetal", "N", 3, "NO", None, {}),
    (153, "fecha_fcf", "Fecha frecuencia cardiaca fetal", "F", 10, "COND", None,
     {"cond": ("lleno", "fcf"), "mayor_que": ["fum"]}),
    (154, "fecha_asesoria_ive", "Fecha asesoria IVE", "F", 10, "NO", None, {}),
    (155, "se_realizo_ive", "Se realizo IVE", "T", 2, "SI", SI_NO, {}),
    (156, "consentimiento_ive", "La usuaria firmo consentimiento informado para IVE", "T", 2,
     "COND", SI_NO, {"cond": ("igual", "se_realizo_ive", ["SI"])}),
    (157, "asesoria_lactancia", "Asesoria lactancia materna", "T", 2, "SI", SI_NO, {}),
    (158, "fecha_asesoria_planificacion",
     "Fecha asesoria en planificacion familiar durante la gestacion", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (159, "malformaciones", "Malformaciones congenitas en la gestacion", "T", 2, "SI", SI_NO, {}),
    (160, "fecha_malformacion", "Fecha de identificacion de malformacion", "F", 10, "COND", None,
     {"cond": ("igual", "malformaciones", ["SI"]), "mayor_que": ["fum"]}),
    (161, "chagas", "Diagnostico de Chagas en la gestacion", "T", 2, "SI",
     ["POSITIVO", "NEGATIVO", "NO SE REALIZA TAMIZAJE"], {}),
    (162, "fecha_chagas", "Fecha de identificacion gestante con Chagas", "F", 10, "SI", None,
     {"mayor_que": ["fum"], "na": NA_FECHA,
      "na_si": ("igual", "chagas", ["NO SE REALIZA TAMIZAJE"])}),
    (163, "fecha_seguimiento_chagas", "Fecha seguimiento gestante con Chagas", "F", 10, "COND",
     None, {"cond": ("igual", "chagas", ["POSITIVO"]), "mayor_que": ["fum"]}),
    (164, "tratamiento_chagas", "Gestante recibio tratamiento para Chagas", "T", 2, "COND", SI_NO,
     {"cond": ("igual", "chagas", ["POSITIVO"])}),
    (165, "sifilis_confirmada", "Sifilis gestacional confirmada", "T", 2, "SI", SI_NO, {}),
    (166, "tratamiento_sifilis", "Tratamiento de sifilis", "N", 1, "SI", ["1", "2", "3", "4"],
     {"na_valor": "4", "na_si": ("igual", "sifilis_confirmada", ["NO"])}),
    (167, "tratamiento_sifilis_pareja", "Tratamiento de sifilis a la pareja", "N", 1, "SI",
     ["1", "2", "3"], {"na_valor": "3", "na_si": ("igual", "sifilis_confirmada", ["NO"])}),
    (168, "vih_materno", "Vih materno confirmado", "T", 2, "SI", SI_NO, {}),
    (169, "fecha_anticonceptivo", "Fecha suministro de anticonceptivo post evento obstetrico", "F",
     10, "SI", None, {"mayor_que": ["fum"], "na": NA_FECHA}),
    (170, "metodo_anticonceptivo", "Suministro de metodo anticonceptivo post evento obstetrico",
     "N", 2, "SI",
     ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "13", "14"], {}),
    (171, "vitalidad_madre", "Vitalidad de la madre al final del embarazo", "N", 1, "SI",
     ["1", "2", "3"], {}),
    (172, "vitalidad_rn", "Vitalidad del recien nacido", "N", 1, "SI", ["1", "2", "3"], {}),
    (173, "tuberculosis", "Persona con tuberculosis activa", "N", 1, "SI", ["1", "2", "3"], {}),
    (174, "fecha_tamizaje_vih_parto",
     "Fecha de realizacion de tamizaje para vih en el momento del parto", "F", 10, "SI", None,
     {"na": NA_FECHA}),
    (175, "fecha_dx_tuberculosis", "Fecha del diagnostico de la tuberculosis activa reportada",
     "F", 10, "COND", None, {"cond": ("igual", "tuberculosis", ["1", "2"])}),
    (176, "fecha_tamizaje_vih_tb",
     "Fecha de realizacion de tamizaje para vih a la persona con tuberculosis activa", "F", 10,
     "COND", None, {"cond": ("igual", "tuberculosis", ["1", "2"])}),
    (177, "fecha_muerte", "Fecha de muerte", "F", 10, "COND", None,
     {"cond": ("igual", "vitalidad_madre", ["2"]), "mayor_que": ["fum"]}),
    (178, "causa_muerte", "Causa de Muerte", "N", 2, "SI", ["1", "2", "3", "4", "55"], {}),
]

# --- Controles por ginecologia 1..7 -> campos 179 a 193 --------------------
_D.append((179, "consulta_1v_ginecologo", "Consulta primera vez por ginecologo", "F", 10, "NO",
           None, {"mayor_que": ["fum"], "no_futura": True}))
_n = 180
for i in range(1, 8):
    _prev = [f"control_gineco{j}" for j in range(1, i)]
    _D.append((_n, f"control_gineco{i}", f"Control por ginecologia {i}", "F", 10, "NO", None,
               {"mayor_que": ["fum"] + _prev, "no_futura": True}))
    _D.append((_n + 1, f"tipo_gineco{i}", f"Tipo Consulta Control por ginecologia {i}", "T", 12,
               "COND", TIPO_CONSULTA, {"cond": ("lleno", f"control_gineco{i}")}))
    _n += 2

_D += [
    # --- Otros profesionales (194-215) -------------------------------------
    (194, "primera_vez_med_general", "Primera vez Medicina General", "F", 10, "NO", None,
     {"mayor_que": ["fum"], "no_futura": True}),
    (195, "tipo_med_general1", "Tipo de consulta Primera vez Medicina General", "T", 12, "COND",
     TIPO_CONSULTA, {"cond": ("lleno", "primera_vez_med_general")}),
    (196, "control2_med_general", "Control 2 Medicina General", "F", 10, "NO", None,
     {"mayor_que": ["fum", "primera_vez_med_general"], "no_futura": True}),
    (197, "tipo_med_general2", "Tipo de consulta Medicina General 2", "T", 12, "COND",
     TIPO_CONSULTA, {"cond": ("lleno", "control2_med_general")}),
    (198, "control_nutricion1", "Control Nutricion1", "F", 10, "NO", None,
     {"mayor_que": ["fum"], "no_futura": True}),
    (199, "tipo_nutricion1", "Tipo de consulta nutricion 1", "T", 12, "COND", TIPO_CONSULTA,
     {"cond": ("lleno", "control_nutricion1")}),
    (200, "alteracion_nutricional1", "Alteracion nutricional consulta1", "T", 2, "COND", SI_NO,
     {"cond": ("lleno", "control_nutricion1")}),
    (201, "control_nutricion2", "Control Nutricion2", "F", 10, "NO", None,
     {"mayor_que": ["fum", "control_nutricion1"], "no_futura": True}),
    (202, "tipo_nutricion2", "Tipo de consulta nutricion 2", "T", 12, "COND", TIPO_CONSULTA,
     {"cond": ("lleno", "control_nutricion2")}),
    (203, "alteracion_nutricional2", "Alteracion nutricional consulta2", "T", 2, "COND", SI_NO,
     {"cond": ("lleno", "control_nutricion2")}),
    (204, "control_psicologia1", "Control Psicologia1", "F", 10, "NO", None,
     {"mayor_que": ["fum"], "no_futura": True}),
    (205, "tipo_psicologia1", "Tipo de consulta Psicologia1", "T", 12, "COND", TIPO_CONSULTA,
     {"cond": ("lleno", "control_psicologia1")}),
    (206, "control_psicologia2", "Control Psicologia2", "F", 10, "NO", None,
     {"mayor_que": ["fum", "control_psicologia1"], "no_futura": True}),
    (207, "tipo_psicologia2", "Tipo de consulta Psicologia2", "T", 12, "COND", TIPO_CONSULTA,
     {"cond": ("lleno", "control_psicologia2")}),
    (208, "control_perinatologo1", "Control Perinatologo1", "F", 10, "NO", None,
     {"mayor_que": ["fum"], "no_futura": True}),
    (209, "tipo_perinatologo1", "Tipo de consulta Perinatologo1", "T", 12, "COND", TIPO_CONSULTA,
     {"cond": ("lleno", "control_perinatologo1")}),
    (210, "control_perinatologo2", "Control Perinatologo2", "F", 10, "NO", None,
     {"mayor_que": ["fum", "control_perinatologo1"], "no_futura": True}),
    (211, "tipo_perinatologo2", "Tipo de consulta Perinatologo2", "T", 12, "COND", TIPO_CONSULTA,
     {"cond": ("lleno", "control_perinatologo2")}),
    (212, "control_enfermeria1", "Control Enfermeria 1", "F", 10, "NO", None,
     {"mayor_que": ["fum"], "no_futura": True}),
    (213, "control_enfermeria2", "Control Enfermeria 2", "F", 10, "NO", None,
     {"mayor_que": ["fum", "control_enfermeria1"], "no_futura": True}),
    (214, "control_enfermeria3", "Control Enfermeria 3", "F", 10, "NO", None,
     {"mayor_que": ["fum", "control_enfermeria1", "control_enfermeria2"], "no_futura": True}),
    (215, "control_odontologia1", "Control Odontologia 1", "F", 10, "NO", None,
     {"mayor_que": ["fum"], "no_futura": True}),

    # --- Riesgo y seguimiento (216-228) ------------------------------------
    (216, "semana_epidemiologica", "Semana epidemiologica", "N", 2, "SI", None,
     {"min": 1, "max": 52}),
    (217, "antecedentes_preclampsia", "Gestante antecedentes preclampsia", "T", 2, "SI", SI_NO,
     {}),
    (218, "riesgo_preeclampsia", "Riesgo preeclampsia", "N", 2, "SI", ["4", "5"], {}),
    (219, "consulta_urgencias_30d", "Consulta urgencia ultimos 30 dias", "T", 2, "SI", SI_NO, {}),
    (220, "egreso_hospitalizacion_30d", "Gestante egreso hospitalizacion ultimos 30 dias", "T", 2,
     "SI", SI_NO, {}),
    (221, "criterio_mme", "Gestante cumple al menos 1 criterio MME", "T", 2, "SI", SI_NO, {}),
    (222, "riesgo_tromboembolismo", "Gestante riesgo tromboembolismo", "N", 2, "SI",
     ["4", "5", "21"], {}),
    (223, "fecha_control_puerperio", "Fecha control puerperio", "F", 10, "NO", None,
     {"mayor_que": ["fum"]}),
    (224, "laboratorios_alterados", "Laboratorios alterados", "T", 2, "SI",
     ["SI", "NO", "RIESGO NO EVALUADO"], {}),
]

# Seguimiento posevento obstetrico 1..4 -> campos 225 a 228
for i in range(1, 5):
    _D.append((224 + i, f"seguimiento_posevento{i}",
               f"Seguimiento posevento obstetrico o {i} medico especialista casos MME", "F", 10,
               "SI", None, {"mayor_que": ["fum"], "na": NA_FECHA}))

_D += [
    # --- Datos sociodemograficos y suministros (229-239) --------------------
    (229, "nacionalidad", "Nacionalidad procedencia", "A", 3, "SI", None, {"solo_digitos": True}),
    (230, "codigo_ocupacion", "Codigo ocupacion", "N", 4, "SI", None, {}),
    (231, "nivel_educativo", "Nivel educativo", "N", 2, "SI", None, {"min": 1, "max": 13}),
    (232, "pertenencia_etnica", "Codigo pertenencia etnica", "N", 2, "SI",
     ["01", "02", "03", "04", "05", "06", "99"], {"zfill": True}),
    (233, "fecha_asa", "Fecha de inicio de acido acetilsalicilico - ASA", "F", 10, "SI", None,
     {"mayor_que": ["fum"], "na": NA_FECHA}),
    (234, "acido_folico", "Suministro de acido folico en el control prenatal", "N", 2, "SI",
     ["0", "1", "21"], {}),
    (235, "sulfato_ferroso", "Suministro de sulfato ferroso en el control prenatal", "N", 2, "SI",
     ["0", "1", "21"], {}),
    (236, "carbonato_calcio", "Suministro de carbonato de calcio en el control prenatal", "N", 2,
     "SI", ["0", "1", "21"], {}),
    (237, "fecha_salida_parto", "Fecha de salida de atencion parto o cesarea", "F", 10, "COND",
     None, {"cond": ("lleno", "via_terminacion"), "mayor_que": ["fum"], "na": NA_FECHA,
            "na_si": ("igual", "via_terminacion", ["ABORTO"])}),
    (238, "municipio", "Municipio de Atencion del control prenatal", "N", 5, "SI", None,
     {"zfill": True}),
    (239, "tipo_caso", "Tipo de caso", "N", 2, "SI",
     ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "21"], {}),

    # --- Seguimiento del caso (240-248) ------------------------------------
    (240, "fecha_seguimiento", "Fecha de seguimiento", "F", 10, "COND", None,
     {"cond": ("igual", "tipo_caso",
               ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"])}),
    (241, "tipo_seguimiento", "Tipo de seguimiento", "N", 1, "COND", ["1", "2", "3", "4"],
     {"cond": ("igual", "tipo_caso",
               ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"])}),
]

_SEG = [
    (242, "seg_cita_medicina", "Seguimiento - Asignacion de cita por profesional de medicina"),
    (243, "seg_cita_especializada", "Seguimiento - Asignacion de cita por medicina especializada"),
    (244, "seg_referencia", "Seguimiento - Referencia a institucion de mayor complejidad"),
    (245, "seg_cita_procedimientos", "Seguimiento - Asignacion de cita para procedimientos"),
    (246, "seg_canalizacion_lab",
     "Seguimiento - Canalizacion a entrega de resultados de laboratorio"),
    (247, "seg_entrega_medicamentos", "Seguimiento - Entrega de medicamentos"),
    (248, "seg_informacion_cuidado", "Seguimiento - Informacion para el cuidado de la salud"),
]
for _num, _key, _nom in _SEG:
    _D.append((_num, _key, _nom, "N", 1, "COND", ["1", "2"],
               {"cond": ("igual", "tipo_caso",
                         ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"])}))


CAMPOS = [Campo(n, k, nom, t, l, r, v, e) for (n, k, nom, t, l, r, v, e) in _D]
CAMPOS.sort(key=lambda c: c.num)
POR_KEY = {c.key: c for c in CAMPOS}
KEYS = [c.key for c in CAMPOS]

assert len(CAMPOS) == 248, f"El esquema debe tener 248 campos, tiene {len(CAMPOS)}"
assert [c.num for c in CAMPOS] == list(range(1, 249)), "Numeracion de campos discontinua"
