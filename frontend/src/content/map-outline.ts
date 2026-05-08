/**
 * Stylized SVG outline of the SF Peninsula service area.
 * ViewBox: 1000 (wide) x 1100 (tall). North=top, west=left.
 *
 * Not a survey-grade boundary — a clean illustrative path that captures the
 * Peninsula's distinctive narrow-north / wide-south shape and the bay/coast
 * silhouette. Hand-tuned so the AREAS coords land convincingly inside the land mass.
 */
export const MAP_VIEWBOX = { width: 1000, height: 1100 } as const

/** Main land mass: SF tip + San Mateo County + northern Santa Clara County. */
export const LAND_PATH = [
  'M 70 90',
  'Q 130 40 200 30',
  'Q 270 30 310 70',
  'L 330 130',
  'Q 360 200 380 270',
  'L 460 360',
  'Q 510 405 560 425',
  'L 580 480',
  'Q 630 510 680 555',
  'L 740 620',
  'Q 770 670 790 710',
  'L 850 780',
  'Q 905 825 950 870',
  'L 970 935',
  'L 940 1000',
  'Q 870 1030 790 1025',
  'L 640 985',
  'Q 530 950 430 920',
  'Q 360 880 320 825',
  'L 270 740',
  'Q 215 660 195 575',
  'Q 175 495 165 430',
  'Q 140 345 110 270',
  'Q 80 195 65 140',
  'Z',
].join(' ')

/** A subtle "I-280 spine" decorative path, dashed in the rendering. */
export const SPINE_PATH = [
  'M 175 110',
  'Q 230 240 290 360',
  'Q 360 490 460 600',
  'Q 570 700 670 800',
  'Q 770 880 870 950',
].join(' ')

/** Tiny ornamental arrow indicating the bay (drawn east of the land path). */
export const BAY_LABEL_POINT = { x: 870, y: 320 } as const

/** Tiny ornamental arrow indicating the Pacific coast (drawn west of the land path). */
export const COAST_LABEL_POINT = { x: 130, y: 720 } as const
