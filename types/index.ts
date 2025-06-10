export type SerieType = {
    reps: string,
    weight: string,
}

export type SerieRowType = {
    id: number;
    reps: string;
    weight: string;
    isDone: boolean;
    previousReps?: string;
    previousWeight?: string;
    weightError: boolean;
    repsError: boolean;
    isDoneError: boolean;
}

export type ExerciseSelectType = {
    id: number;
    exerciseName: string;
}

export type ExerciseType = {
    exerciseName: string,
    series: SerieRowType[],
}

export type CleanExerciseType = {
    exerciseName: string,
    series: SerieType[],
}

export type AvailableExerciseType = {
    name: string;
    category: string[];
}

export type BackgroundClassType = "bg-secondaryGreen" | "bg-secondaryBrown" | "bg-azure";