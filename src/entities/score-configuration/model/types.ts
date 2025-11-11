export type ScoringType = 'PERCENTAGE' | 'POINTS' | 'GRADE';

export interface ScoreConfiguration {
  id: string;
  name: string;
  description?: string;
  formula: string;
  scoringType: ScoringType;
  availablePlaceholders: string[];
  isActive: boolean;
  gradeRanges?: Record<string, [number, number]>;
  negativeMarking: boolean;
  negativeMarkValue?: number;
  passingScore?: number;
  maxScore?: number;
  centerId: string;
  center?: {
    id: string;
    centerName: string;
    state: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateScoreConfigurationRequest {
  name: string;
  description?: string;
  formula: string;
  scoringType?: ScoringType;
  isActive?: boolean;
  gradeRanges?: Record<string, [number, number]>;
  negativeMarking?: boolean;
  negativeMarkValue?: number;
  passingScore?: number;
  maxScore?: number;
  centerId: string;
}

export interface UpdateScoreConfigurationRequest {
  name?: string;
  description?: string;
  formula?: string;
  scoringType?: ScoringType;
  isActive?: boolean;
  gradeRanges?: Record<string, [number, number]>;
  negativeMarking?: boolean;
  negativeMarkValue?: number;
  passingScore?: number;
  maxScore?: number;
  centerId?: string;
}

export interface ValidateFormulaRequest {
  formula: string;
  sampleValues?: Record<string, number>;
}

export interface ValidateFormulaResponse {
  isValid: boolean;
  error?: string;
  placeholders: string[];
  availablePlaceholders?: string[];
  previewResult?: number;
  sampleValues?: Record<string, number>;
}

export interface PreviewScoreRequest {
  formula: string;
  values: Record<string, number>;
}

export interface PreviewScoreResponse {
  formula: string;
  values: Record<string, number>;
  result: number;
  calculation: string[];
}

export const FORMULA_TEMPLATES = {
  SIMPLE_PERCENTAGE: {
    name: 'Simple Percentage',
    formula: '({correctAnswers} / {totalQuestions}) * 100',
    description: 'Basic percentage calculation',
    scoringType: 'PERCENTAGE' as ScoringType,
  },
  NEGATIVE_MARKING_UPSC: {
    name: 'UPSC Pattern',
    formula: '({correctAnswers} * 4) - ({wrongAnswers} * 1)',
    description: '4 marks for correct, -1 for wrong',
    scoringType: 'POINTS' as ScoringType,
    negativeMarking: true,
    negativeMarkValue: 1,
  },
  NEGATIVE_MARKING_JEE: {
    name: 'IIT-JEE Pattern',
    formula: '({correctAnswers} * 4) - ({wrongAnswers} * 1)',
    description: '4 marks for correct, -1 for wrong',
    scoringType: 'POINTS' as ScoringType,
    negativeMarking: true,
    negativeMarkValue: 1,
  },
  WEIGHTED_SECTIONS: {
    name: 'Weighted Sections',
    formula: '(({section1Correct} * 2) + ({section2Correct} * 3)) / 50 * 100',
    description: 'Different weights for different sections',
    scoringType: 'PERCENTAGE' as ScoringType,
  },
  TIME_BONUS: {
    name: 'Time Bonus',
    formula: '({correctAnswers} * 4) + ((({maxTime} - {timeSpent}) / {maxTime}) * 10)',
    description: 'Bonus points for faster completion',
    scoringType: 'POINTS' as ScoringType,
  },
};

export const AVAILABLE_PLACEHOLDERS = [
  {
    name: 'correctAnswers',
    description: 'Number of correct answers',
  },
  {
    name: 'wrongAnswers',
    description: 'Number of incorrect answers',
  },
  {
    name: 'skippedQuestions',
    description: 'Number of unanswered questions',
  },
  {
    name: 'totalQuestions',
    description: 'Total number of questions',
  },
  {
    name: 'attemptedQuestions',
    description: 'Number of attempted questions',
  },
  {
    name: 'timeSpent',
    description: 'Time taken in minutes',
  },
  {
    name: 'maxTime',
    description: 'Maximum allowed time in minutes',
  },
  {
    name: 'section1Correct',
    description: 'Correct answers in section 1',
  },
  {
    name: 'section2Correct',
    description: 'Correct answers in section 2',
  },
  {
    name: 'section3Correct',
    description: 'Correct answers in section 3',
  },
];